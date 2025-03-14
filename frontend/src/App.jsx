import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Intrusions from './backend/models/Intrusions';

function App() {
  const [intrusions, setIntrusions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/intrusions');
      const data = await response.json();
      setIntrusions(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const App = () => {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/intrusions" element={<Intrusions />} />
      </Routes>
    );
  };
  return (
    <div>
      <h1>IntrusAI - Intrusion Detection System</h1>
      <button onClick={fetchData}>Fetch Intrusions</button>

      {intrusions.length > 0 && (
        <table border="1" style={{ marginTop: '20px', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Source IP</th>
            </tr>
          </thead>
          <tbody>
            {intrusions.map((intrusion) => (
              <tr key={intrusion.id}>
                <td>{intrusion.id}</td>
                <td>{intrusion.type}</td>
                <td>{intrusion.severity}</td>
                <td>{intrusion.sourceIP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
