import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom>Welcome to ResumeBuilder</Typography>
        <Typography variant="h5" color="textSecondary">Create a professional resume in minutes with beautiful templates and AI assistance.</Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Link to="/templates" className="get-started-btn">
          <Typography variant="button" sx={{ fontSize: 20, px: 4, py: 2, bgcolor: 'primary.main', color: '#fff', borderRadius: 2, textDecoration: 'none', '&:hover': { bgcolor: 'primary.dark' } }}>
            Get Started
          </Typography>
        </Link>
      </Box>
    </Container>
  );
}

export default Home; 