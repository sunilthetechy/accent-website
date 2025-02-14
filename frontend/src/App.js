import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import HubertPage from "./components/HubertPage";
import Wav2vec2Page from "./components/Wav2vec2Page";
import WhisperPage from "./components/WhisperPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hubert" element={<HubertPage />} />
        <Route path="/wav2vec2" element={<Wav2vec2Page />} />
        <Route path="/whisper" element={<WhisperPage />} />
      </Routes>
    </Router>
  );
}

export default App;
