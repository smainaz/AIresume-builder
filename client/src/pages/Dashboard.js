import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Grid, Card, CardContent, Typography, TextField, Button,
  CircularProgress, Box, Chip,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LoginIcon from '@mui/icons-material/Login';
import DescriptionIcon from '@mui/icons-material/Description';
import { useAuth } from '../App';
import { getStats } from '../utils/stats';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function StatCard({ icon, label, value }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        <Box>
          <Typography variant="h4" fontWeight={700}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ logins: 0, cvsCreated: 0 });
  const [location, setLocation] = useState(() => localStorage.getItem('dashboard_location') || '');
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsNote, setJobsNote] = useState('');

  useEffect(() => {
    if (user?.email) setStats(getStats(user.email));
  }, [user]);

  const fetchJobs = async (loc) => {
    setJobsLoading(true);
    setJobsNote('');
    try {
      const res = await axios.get(`${API_URL}/api/jobs`, { params: { location: loc } });
      setJobs(res.data.jobs || []);
      if (res.data.note) setJobsNote(res.data.note);
    } catch (err) {
      setJobsNote('Could not load job listings right now. Please try again later.');
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(location);
  }, []);

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('dashboard_location', location);
    fetchJobs(location);
  };

  if (!user) {
    return (
      <div className="locked-msg">
        Please <Link to="/login">log in</Link> to view your dashboard.
      </div>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome back{user.name ? `, ${user.name}` : ''}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your account.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<LoginIcon fontSize="large" />} label="Times logged in" value={stats.logins} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<DescriptionIcon fontSize="large" />} label="CVs created" value={stats.cvsCreated} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={<WorkOutlineIcon fontSize="large" />} label="Jobs found nearby" value={jobs.length} />
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        Jobs near you
      </Typography>
      <Box component="form" onSubmit={handleLocationSubmit} sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Your area (e.g. Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          size="small"
          sx={{ minWidth: 240 }}
        />
        <Button type="submit" variant="contained" disabled={jobsLoading}>
          {jobsLoading ? 'Searching…' : 'Search jobs'}
        </Button>
      </Box>

      {jobsNote && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {jobsNote}
        </Typography>
      )}

      {jobsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.company} · {job.location}
                  </Typography>
                  {job.salary && <Chip size="small" label={job.salary} sx={{ mt: 1, mr: 1 }} />}
                  {job.url && job.url !== '#' && (
                    <Box sx={{ mt: 1 }}>
                      <a href={job.url} target="_blank" rel="noopener noreferrer">View job</a>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {!jobs.length && !jobsNote && (
            <Typography variant="body2" color="text.secondary">No jobs found for that area yet.</Typography>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default Dashboard;
