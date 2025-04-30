// client/src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) return alert("Please select a CSV file first.");
    if (file.type !== "text/csv") {
      return alert("Please upload a valid CSV file.");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // ▶️ POST to your Express server
      const res = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ▶️ The server returns { success: true, result: { … } }
      const mlResult = res.data.result ?? res.data;
      setResult(mlResult);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 className="hacker-heading">AI Intrusion Detection System</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          setFile(e.target.files[0]);
          setResult(null);
        }}
      />
      <button onClick={uploadFile} disabled={loading}>
        {loading ? "Detecting…" : "Upload & Detect"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Result for {file.name}</h2>
          <p><strong>Predicted Class:</strong> {result.predicted_class}</p>
          <p><strong>Class Name:</strong> {result.class_name}</p>
          <p><strong>Model Used:</strong> {result.model_used}</p>
          <p>
            <strong>Confidence:</strong>{" "}
            {typeof result.confidence === "number"
              ? result.confidence.toFixed(2)
              : result.confidence}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
