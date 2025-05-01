// src/pages/Records.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

export default function Records() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!isLoggedIn) {
        setError('You must be signed in to view records.');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/records');
        setRecords(res.data);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [isLoggedIn]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className="records-container" sx={{ mt: 8 }}>
      <Card className="record-card">
        <CardContent>
          <Typography className="records-heading" variant="h4" sx={{ mb: 3 }}>
            {user.name} Records
          </Typography>
          {records.length === 0 ? (
            <Typography className="no-records" variant="body1">
              No records found.
            </Typography>
          ) : (
            <List>
              {records.map(r => (
                <ListItem key={r._id} className="record-list-item">
                  <ListItemText
                    primary={r.filename}
                    secondary={
                      typeof r.model_response === 'string'
                        ? r.model_response
                        : JSON.stringify(r.model_response)
                    }
                    primaryTypographyProps={{ style: { color: '#00ff9f' } }}
                    secondaryTypographyProps={{ style: { color: '#00ff9f' } }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
