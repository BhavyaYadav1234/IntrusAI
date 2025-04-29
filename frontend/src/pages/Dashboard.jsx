import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { Container, Button, ProgressBar, Card } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";

// Socket connection
const socket = io("http://localhost:5200");

const Dashboard = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState({
    vulnerabilities: 5,
    deviceHealth: 80,
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("status_update", ({ health, vulnerabilityCount }) => {
      setStatus({
        vulnerabilities: vulnerabilityCount,
        deviceHealth: health,
      });
    });

    return () => {
      socket.off("status_update");
    };
  }, []);

  const fetchIntrusions = () => {
    predictIntrusion(); // Call the predict route
  };

  const predictIntrusion = async () => {
    setLoading(true);

    // Replace this sampleInput with actual feature data
    const sampleInput = [
      {
        "Dst Port": 80,
        "Flow Duration": 123456,
        "Total Fwd Packet": 10,
        "Total Bwd packets": 15,
        // Add all required fields from selected_features
      }
    ];

    try {
      const response = await axios.post("http://localhost:5200/api/predict", sampleInput);
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Prediction error:", error.message);
      setPredictionResult({ error: "Failed to fetch prediction" });
    }

    setLoading(false);
  };

  return (
    <Container className="dashboard-container text-light p-4">
      <h1 className="text-center">IntrusAI - Intrusion Detection System</h1>
      <p className="text-center">Monitor your device security and detect intrusions in real-time.</p>

      {/* Fetch Intrusions Button */}
      <div className="text-center mb-4">
        <Button variant="danger" onClick={fetchIntrusions} disabled={loading}>
          {loading ? "Detecting..." : "Fetch Intrusions"}
        </Button>
      </div>

      {/* Device Status */}
      <div className="security-status">
        <h2>Device Security Status</h2>
        <div className="security-status-card">

          {/* Device Health */}
          <div className="status-item mb-3">
            <h4>Device Health</h4>
            <ProgressBar now={status.deviceHealth} label={`${status.deviceHealth}%`} />
          </div>

          {/* Vulnerabilities */}
          <div className="status-item">
            <h4>Vulnerabilities</h4>
            <div className="status">
              {status.vulnerabilities > 0 ? (
                <p style={{ color: "red" }}>
                  <FaExclamationCircle /> {status.vulnerabilities} Vulnerabilities Found
                </p>
              ) : (
                <p style={{ color: "green" }}>
                  <FaCheckCircle /> No vulnerabilities found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Intrusion Detection Results */}
      {predictionResult && (
        <Card bg="dark" text="light" className="mt-4 p-3">
          <h4>Intrusion Detection Result</h4>
          {predictionResult.error ? (
            <p style={{ color: "red" }}>{predictionResult.error}</p>
          ) : (
            <>
              <p><strong>Class:</strong> {predictionResult.class_name}</p>
              <p><strong>Model Used:</strong> {predictionResult.model_used}</p>
              <p><strong>Confidence:</strong> {(predictionResult.confidence * 100).toFixed(2)}%</p>
            </>
          )}
        </Card>
      )}

      {/* Extra Info */}
      <div className="other-dashboard-content mt-5">
        <h3>Welcome to IntrusAI!</h3>
        <p>Monitor your device security and detect intrusions in real-time.</p>
      </div>
    </Container>
  );
};

export default Dashboard;
