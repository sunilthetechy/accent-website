import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [checkpoint, setCheckpoint] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Redirect based on the selected checkpoint
    if (checkpoint === "checkpoint1") {
      navigate("/hubert");
    } else if (checkpoint === "checkpoint2") {
      navigate("/wav2vec2");
    } else if (checkpoint === "checkpoint3") {
      navigate("/whisper");
    }
  };

  return (
    <div className="home-page">
      <header>
        <h1>Accent Processing Tool</h1>
        <p>Select a checkpoint to process your accent data.</p>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="checkpoint">Select Checkpoint:</label>
            <select
              id="checkpoint"
              value={checkpoint}
              onChange={(e) => setCheckpoint(e.target.value)}
              required
            >
              <option value="">--Select a checkpoint--</option>
              <option value="checkpoint1">Hubert Shared Model</option>
              <option value="checkpoint2">Wav2Vec2 Shared Model</option>
              <option value="checkpoint3">Whisper Shared Model</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  );
};

export default HomePage;
