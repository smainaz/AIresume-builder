import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Alert, Grid } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PaletteIcon from '@mui/icons-material/Palette';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useAuth } from '../App';
import { getAnnouncement } from '../utils/admin';

const FEATURES = [
  {
    icon: <AutoAwesomeIcon />,
    title: 'AI-assisted writing',
    body: 'Get help wording your experience and skills so your resume reads clearly and confidently.',
  },
  {
    icon: <PaletteIcon />,
    title: 'Professional templates',
    body: 'Pick from a small set of clean, recruiter-friendly layouts and switch anytime.',
  },
  {
    icon: <PictureAsPdfIcon />,
    title: 'Instant PDF export',
    body: 'Download a polished, ready-to-send PDF the moment your resume is complete.',
  },
];

function Home() {
  const { user } = useAuth();
  const announcement = getAnnouncement();

  return (
    <>
      <div className="hero">
        <svg className="hero-doc-motif" viewBox="0 0 220 260" aria-hidden="true">
          <rect x="10" y="10" width="140" height="180" rx="10" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
          <line x1="30" y1="45" x2="120" y2="45" stroke="#F5B841" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="70" x2="130" y2="70" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="85" x2="105" y2="85" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="115" x2="130" y2="115" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="130" x2="95" y2="130" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
          <circle cx="178" cy="150" r="34" fill="#F5B841" fillOpacity="0.18" stroke="#F5B841" strokeOpacity="0.6" strokeWidth="2" />
          <path d="M163 150 L174 161 L196 137" fill="none" stroke="#F5B841" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="hero-content">
          <Typography component="h1" sx={{ fontFamily: '"Space Grotesk", Inter, sans-serif', fontSize: { xs: '2.2rem', sm: '3.2rem' }, fontWeight: 700, color: '#fff', mb: 2.5, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Build a resume that gets you the interview
          </Typography>
          <Typography sx={{ fontSize: { xs: '1.05rem', sm: '1.2rem' }, color: 'rgba(255,255,255,0.82)', mb: 5, lineHeight: 1.6 }}>
            Create a professional resume in minutes with AI-assisted writing and clean, recruiter-friendly templates.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/templates" className="get-started-btn">Get Started</Link>
            {user && (
              <Link to="/dashboard" className="get-started-btn outline">View Your Dashboard</Link>
            )}
          </Box>
        </div>
      </div>

      <div className="feature-strip">
        <Grid container spacing={3}>
          {FEATURES.map((f) => (
            <Grid item xs={12} sm={4} key={f.title}>
              <div className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>

      {(announcement || user?.role === 'admin') && (
        <Container maxWidth="md" sx={{ mb: 6 }}>
          {announcement && (
            <Alert severity="info" sx={{ mb: 2 }}>{announcement}</Alert>
          )}
          {user?.role === 'admin' && (
            <Alert severity="success">
              Welcome, Admin — <Link to="/admin">go to your dashboard</Link>.
            </Alert>
          )}
        </Container>
      )}
    </>
  );
}

export default Home;
