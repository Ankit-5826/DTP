import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface ApiKeyModalProps {
  //   onSave: (apiKey: string) => void;
  //   onClose: () => void;
  setApiKey: Dispatch<SetStateAction<boolean>>;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ setApiKey }) => {
  const [aiKey, setaiKey] = useState("");
  const saveApiKey = () => {
    if (aiKey.trim().length < 1) {
      return;
    }
    localStorage.setItem("API_KEY", btoa(aiKey));
    setApiKey(true);
  };
  const downloadPdf = ()=>{
       const link = document.createElement("a");

    link.href = "../../public/Gemini_API_Key_Guide.pdf";
    link.download = "guide.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const closeApiKeyPopup = () => {
    setApiKey(true);
  };
  return (
    <div className="modal-overlay">
      <div className="api-modal">
        <div className="api-modal-header">
          <div className="api-logo">A</div>

          <div>
            <div className="api-modal-title">Connect API Key</div>

            <div className="api-modal-subtitle">
              Add your Gemini API key to continue
            </div>
          </div>
        </div>

        <label className="api-label">API Key</label>

        <input
          className="api-input"
          placeholder="AIzaSy..."
          type="password"
          onChange={(e) => setaiKey(e.target.value)}
        />

        <div className="api-help">Get your key from Google AI Studio</div>
        <div className="api-help" style={{color: "#8b6cff", cursor : "pointer"}} onClick={downloadPdf}>Download API Guide</div>

        <div className="api-actions">
          <button className="cancel-btn" onClick={closeApiKeyPopup}>
            Cancel
          </button>

          <button className="save-btn" onClick={saveApiKey}>
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
