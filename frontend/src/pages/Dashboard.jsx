// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { ProgressBar } from "react-bootstrap";
import io from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:5200"); // adjust if your backend runs on a different port

const Dashboard = () => {
  const navigate = useNavigate();

  // State for device security status
  const [status, setStatus] = useState({
    vulnerabilities: 5, // Number of vulnerabilities
    deviceHealth: 80, // Percentage of device health
  });

  // Listen for real-time status updates from the server
  useEffect(() => {
    socket.on("status_update", ({ health, vulnerabilityCount }) => {
      setStatus({
        vulnerabilities: vulnerabilityCount,
        deviceHealth: health,
      });
    });

    // Clean up the socket event on component unmount
    return () => {
      socket.off("status_update");
    };
  }, []);

  // Handle redirect to intrusions page
  const fetchIntrusions = () => {
    navigate("/intrusions");
  };

  return (
    <Container className="dashboard-container text-light p-4">
      {/* Welcome Message at the Top */}
      <h1 className="text-center">IntrusAI - Intrusion Detection System</h1>
      <p className="text-center">Monitor your device security and detect intrusions in real-time.</p>

      {/* Fetch Intrusions Button (Only Once) */}
      {status.vulnerabilities > 0 && (
        <div className="text-center mb-4">
          <Button variant="danger" onClick={fetchIntrusions}>
            Fetch Intrusions
          </Button>
        </div>
      )}

      {/* Security Status Section */}
      <div className="security-status">
        <h1>Device Security Status</h1>
        <div className="security-status-card">

        {/* Device Health */}
        <div className="status-item">
          <h3>Device Health</h3>
          <ProgressBar now={status.deviceHealth} label={`${status.deviceHealth}%`} />
        </div>

        {/* Vulnerabilities */}
        <div className="status-item">
          <h3>Vulnerabilities</h3>
          <div className="status">
            {status.vulnerabilities > 0 ? (
              <p style={{ color: "red" }}>{status.vulnerabilities} Vulnerabilities Found</p>
            ) : (
              <p style={{ color: "green" }}>No vulnerabilities found</p>
            )}
          </div>
        </div>
      </div>

      {/* Existing Dashboard Content */}
      <div className="other-dashboard-content">
        <h2>Welcome to IntrusAI!</h2>
        <p>Monitor your device security and detect intrusions in real-time.</p>
      </div>
    </div>
  );
};

export default Dashboard;
