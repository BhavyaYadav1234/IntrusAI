// frontend/src/pages/Intrusions.jsx
import React, { useEffect, useState } from 'react';

const IntrusionsPage = () => {
  const [intrusions, setIntrusions] = useState([]);

  useEffect(() => {
    const fetchIntrusions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/intrusions');
        const data = await response.json();
        setIntrusions(data);
      } catch (error) {
        console.error('Error fetching intrusions:', error);
      }
    };

    fetchIntrusions();
  }, []);

  return (
    <div>
      <h2>Intrusions</h2>
      {intrusions.length > 0 ? (
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
              <tr key={intrusion._id}>
                <td>{intrusion._id}</td>
                <td>{intrusion.type}</td>
                <td>{intrusion.severity}</td>
                <td>{intrusion.sourceIP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No intrusions found.</p>
      )}
    </div>
  );
};

export default IntrusionsPage;
