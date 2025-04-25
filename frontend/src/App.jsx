// frontend/src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import IntrusionsPage from './pages/Intrusions'; // ✅ frontend component for /intrusions
import Report from './pages/Report';

function App() {
  return (
    <div>
      <h1>IntrusAI - Intrusion Detection System</h1>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/intrusions" element={<IntrusionsPage />} />
        <Route path="/Report" element={<Report />} />
      </Routes>
    </div>
  );
}

export default App;

