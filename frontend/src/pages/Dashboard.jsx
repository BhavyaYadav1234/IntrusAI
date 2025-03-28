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
      <h2 className="mt-3">Device Security Status</h2>
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
      </div>
    </Container>
  );
};

export default Dashboard;
