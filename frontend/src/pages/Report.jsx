import { useEffect, useState } from 'react';
import api from '../services/api';

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized. Please login.');
        }

        const { data } = await api.get('/report', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReportData(data);
      } catch (err) {
        setError(err.message || 'Error fetching report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <p>Loading report...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Report</h1>
      <pre>{JSON.stringify(reportData, null, 2)}</pre>
    </div>
  );
};

export default Report;
