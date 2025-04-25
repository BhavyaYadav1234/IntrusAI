// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { Container, Button, ProgressBar } from "react-bootstrap";
import io from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:5200"); // Adjust if backend uses a different port

const Dashboard = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState({
    vulnerabilities: 5,
    deviceHealth: 80,
  });

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
    navigate("/intrusions");
  };

  return (
    <Container className="dashboard-container text-light p-4">
      {/* Welcome Message */}
      <h1 className="text-center">IntrusAI - Intrusion Detection System</h1>
      <p className="text-center">Monitor your device security and detect intrusions in real-time.</p>

      {/* Fetch Intrusions Button */}
      {status.vulnerabilities > 0 && (
        <div className="text-center mb-4">
          <Button variant="danger" onClick={fetchIntrusions}>
            Fetch Intrusions
          </Button>
        </div>
      )}

      {/* Security Status Section */}
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

      {/* Extra Content */}
      <div className="other-dashboard-content mt-5">
        <h3>Welcome to IntrusAI!</h3>
        <p>Monitor your device security and detect intrusions in real-time.</p>
      </div>
    </Container>
  );
};

export default Dashboard;
