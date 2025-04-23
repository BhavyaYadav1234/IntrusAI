import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5200');  // Make sure this port matches your backend server port

const IntrusionsPage = () => {
  const [intrusions, setIntrusions] = useState([]);

  // Fetch initial intrusion list
  useEffect(() => {
    const fetchIntrusions = async () => {
      try {
        const response = await fetch('http://localhost:5200/api/intrusions');
        const data = await response.json();
        setIntrusions(data);
      } catch (error) {
        console.error('Error fetching intrusions:', error);
      }
    };

    fetchIntrusions();
  }, []);

  // Listen for real-time intrusion events
  useEffect(() => {
    socket.on('new_intrusion', (newIntrusion) => {
      console.log('New intrusion detected:', newIntrusion);
      setIntrusions(prev => [newIntrusion, ...prev]);
    });

    return () => {
      socket.off('new_intrusion');  // Clean up the listener on unmount
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Detected Intrusions</h2>
      {intrusions.length > 0 ? (
        <table border="1" style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Source IP</th>
              <th>Destination IP</th>
              <th>Description</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {intrusions.map((intrusion) => (
              <tr key={intrusion._id}>
                <td>{intrusion._id}</td>
                <td>{intrusion.type}</td>
                <td>{intrusion.severity}</td>
                <td>{intrusion.sourceIP}</td>
                <td>{intrusion.destinationIP}</td>
                <td>{intrusion.description}</td>
                <td>{new Date(intrusion.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No intrusions detected.</p>
      )}
    </div>
  );
};

export default IntrusionsPage;
