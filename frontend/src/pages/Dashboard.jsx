import { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [intrusions, setIntrusions] = useState([]);

  useEffect(() => {
    const fetchIntrusions = async () => {
      const { data } = await api.get('/ids');
      setIntrusions(data);
    };

    fetchIntrusions();
  }, []);

  return (
    <div>
      <h1>Intrusion Reports</h1>
      {intrusions.map((intrusion) => (
        <div key={intrusion._id}>
          <p>{intrusion.type} - Confidence: {intrusion.confidence}%</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
