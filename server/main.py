from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


absolute_storage_path = "/home/siplab/Desktop/web_storage/hubert_2pskr_shared_results"

# Ensure the storage directory exists
os.makedirs(absolute_storage_path, exist_ok=True)

# Mount the absolute path in FastAPI to serve static files
app.mount("/results", StaticFiles(directory=absolute_storage_path), name="results")


class TextInput(BaseModel):
    text: str


@app.post("/process_text")
async def process_text(input_data: TextInput):
    processed_text = input_data.text.upper()
    return {"message": f"Text processed: {processed_text}"}


@app.post("/store_wav")
async def store_wav(file: UploadFile = File(...)):
 
    if file.content_type not in ["audio/wav", "audio/x-wav"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only WAV files are accepted.")
   
    subfolder = os.path.splitext(file.filename)[0]
    subfolder_path = os.path.join(absolute_storage_path, subfolder)
    os.makedirs(subfolder_path, exist_ok=True)  # Ensure subfolder exists

    file_location = os.path.join(subfolder_path, file.filename)
    with open(file_location, "wb") as f:
        content = await file.read()
        f.write(content)
    
    
    file_size = os.path.getsize(file_location)

    file_url = f"http://localhost:8000/results/{subfolder}/{file.filename}"

    return {
        "message": f"WAV file received. Size: {file_size} bytes.",
        "file_url": file_url
    }
