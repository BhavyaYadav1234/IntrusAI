// src/components/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaExclamationCircle, FaCheckCircle, FaSyncAlt } from "react-icons/fa";
import { ProgressBar, Container, Button } from "react-bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();

  // Example state for device security status
  const [status, setStatus] = useState({
    firewall: true,
    antivirus: false,
    updates: true,
    vulnerabilities: 5, // Number of vulnerabilities
    deviceHealth: 80, // Percentage of device health
  });

  // Redirect to Intrusions page
  const fetchIntrusions = () => {
    navigate("/intrusions");
  };

  return (
    <Container className="dashboard-container">
      {/* Security Status Section */}
      <h1 className="text-center">Device Security Status</h1>
      <div className="security-status-card">

        {/* Firewall Status */}
        <div className="status-item">
          <FaShieldAlt size={30} />
          <h3>Firewall</h3>
          <div className="status">
            {status.firewall ? <FaCheckCircle color="green" /> : <FaExclamationCircle color="red" />}
          </div>
        </div>

        {/* Antivirus Status */}
        <div className="status-item">
          <FaExclamationCircle size={30} />
          <h3>Antivirus</h3>
          <div className="status">
            {status.antivirus ? <FaCheckCircle color="green" /> : <FaExclamationCircle color="red" />}
          </div>
        </div>

        {/* System Updates Status */}
        <div className="status-item">
          <FaSyncAlt size={30} />
          <h3>System Updates</h3>
          <div className="status">
            {status.updates ? <FaCheckCircle color="green" /> : <FaExclamationCircle color="red" />}
          </div>
        </div>

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

        {/* Fetch Intrusions Button */}
        {status.vulnerabilities > 0 && (
          <Button variant="danger" onClick={fetchIntrusions} className="mt-3">
            Fetch Intrusions
          </Button>
        )}
      </div>

      {/* Welcome Message */}
      <div className="text-center mt-4">
        <h2>Welcome to IntrusAI!</h2>
        <p>Monitor your device security and detect intrusions in real-time.</p>
      </div>
    </Container>
  );
};

export default Dashboard;
