// frontend/src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import IntrusionsPage from './pages/Intrusions'; // ✅ frontend component for /intrusions

function App() {
  return (
    <div>
      <h1>IntrusAI - Intrusion Detection System</h1>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/intrusions" element={<IntrusionsPage />} />
      </Routes>
    </div>
  );
}

export default App;

