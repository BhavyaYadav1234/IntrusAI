import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import "./App.css";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Records from "./pages/Records";

// Diagnose Page Component
function Diagnose() {
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
      const res = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
    <Container sx={{ padding: 4 }}>
      <h1 className="hacker-heading">AI Intrusion Detection System</h1>
      <div className="upload-input-box">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setResult(null);
          }}
        />
      </div>
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
    </Container>
  );
}

// Layout wrapper with AppBar (Navbar)
function Layout() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "black" }} elevation={1}>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Button
            component={Link}
            to="/records"
            size="large"
            sx={{ color: "#00ff9f", mr: 2 }}
          >
            Records
          </Button>
          {isLoggedIn && (
            <Button onClick={logout} size="large" sx={{  color: '#00ff9f' }}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ marginTop: 8 }}>
        <Outlet />
      </Box>
    </>
  );
}

// Protect routes component
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography>Loading…</Typography>
      </Box>
    );
  }
  return isLoggedIn ? children : <Navigate to="/signin" replace />;
}

// Main App Router
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Diagnose />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diagnose"
              element={
                <ProtectedRoute>
                  <Diagnose />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <Records />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
