import { useState } from "react";
// import "./HubertPage.css"; // Uncomment if you have a CSS file

const HubertPage = () => {
  const [modelType, setModelType] = useState("");
  const [inputText, setInputText] = useState("");
  const [wavFile, setWavFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState(""); // State to store the audio file URL
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleModelTypeChange = (e) => {
    setModelType(e.target.value);
    setInputText("");
    setWavFile(null);
    setResponseMessage("");
    setAudioUrl("");
    setError("");
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFileChange = (e) => {
    setWavFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMessage("");
    setAudioUrl("");
    setError("");

    if (modelType === "text") {
      // Submit the text input to FastAPI endpoint
      try {
        const response = await fetch("http://localhost:8000/process_text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputText }),
        });
        if (!response.ok) {
          throw new Error("Failed to process text input");
        }
        const data = await response.json();
        setResponseMessage(data.message);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else if (modelType === "wav") {
      // Submit the WAV file to FastAPI endpoint
      if (!wavFile) {
        setError("Please upload a WAV file.");
        setIsLoading(false);
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", wavFile);
        const response = await fetch("http://localhost:8000/store_wav", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Failed to process WAV file");
        }
        const data = await response.json();
        setResponseMessage(data.message);
        // Set the audio file URL to display the player
        if (data.file_url) {
          setAudioUrl(data.file_url);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please select a model type.");
      setIsLoading(false);
    }
  };

  return (
    <div className="hubert-page">
      <h1>Hubert Shared Model</h1>
      
      {/* Step-by-step instructions */}
      <div className="instructions">
        <h2>Steps to Follow:</h2>
        <ol>
          <li>
            <strong>Step 1:</strong> Choose a model path by selecting either "Text" or "Wav" from the dropdown.
          </li>
          <li>
            <strong>Step 2:</strong> Based on your selection, provide the required input:
            <ul>
              <li>
                If you select <em>Text</em>, a text input field will appear where you can enter your text.
              </li>
              <li>
                If you select <em>Wav</em>, a file upload field will appear to upload your WAV file.
              </li>
            </ul>
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Submit" button to process your input.
          </li>
        </ol>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="modelType">Select Model Path:</label>
          <select
            id="modelType"
            value={modelType}
            onChange={handleModelTypeChange}
            required
          >
            <option value="">--Select Model Path--</option>
            <option value="text">Text</option>
            <option value="wav">Wav</option>
          </select>
        </div>

        {modelType === "text" && (
          <div className="form-group">
            <label htmlFor="inputText">Enter Text:</label>
            <input
              type="text"
              id="inputText"
              value={inputText}
              onChange={handleTextChange}
              placeholder="Enter your text here..."
              required
            />
          </div>
        )}

        {modelType === "wav" && (
          <div className="form-group">
            <label htmlFor="wavFile">Upload WAV File:</label>
            <input
              type="file"
              id="wavFile"
              accept=".wav,audio/wav"
              onChange={handleFileChange}
              required
            />
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </form>
      
      {responseMessage && <p className="result">{responseMessage}</p>}
      {error && <p className="error">{error}</p>}
      
      {/* Display audio player if an audio file URL is available */}
      {audioUrl && (
        <div className="audio-player">
          <h3>Uploaded Audio:</h3>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default HubertPage;
