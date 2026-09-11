import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../App';
import { getAnnouncement } from '../utils/admin';

function Home() {
  const { user } = useAuth();
  const announcement = getAnnouncement();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      {announcement && (
        <Alert severity="info" sx={{ mb: 4 }}>{announcement}</Alert>
      )}
      {user?.role === 'admin' && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Welcome, Admin — <Link to="/admin">go to your dashboard</Link>.
        </Alert>
      )}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom>Welcome to ResumeBuilder</Typography>
        <Typography variant="h5" color="textSecondary">Create a professional resume in minutes with beautiful templates and AI assistance.</Typography>
      </Box>
      <Box sx={{ textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/templates" className="get-started-btn">
          <Typography variant="button" sx={{ fontSize: 20, px: 4, py: 2, bgcolor: 'primary.main', color: '#fff', borderRadius: 2, textDecoration: 'none', '&:hover': { bgcolor: 'primary.dark' } }}>
            Get Started
          </Typography>
        </Link>
        {user && (
          <Link to="/dashboard" className="get-started-btn">
            <Typography variant="button" sx={{ fontSize: 20, px: 4, py: 2, border: '2px solid', borderColor: 'primary.main', color: 'primary.main', borderRadius: 2, textDecoration: 'none' }}>
              View Your Dashboard
            </Typography>
          </Link>
        )}
      </Box>
    </Container>
  );
}

export default Home;
