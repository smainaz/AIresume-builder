import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Grid, Card, CardContent, Typography, Box, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, FormControlLabel, Switch, Paper, Snackbar, Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import LoginIcon from '@mui/icons-material/Login';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../App';
import { TEMPLATES } from '../data/templates';
import {
  getAllUsersWithStats, deleteUser,
  getDisabledTemplates, setTemplateEnabled,
  getAnnouncement, setAnnouncement,
} from '../utils/admin';

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

function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [disabledTemplates, setDisabledTemplates] = useState([]);
  const [announcement, setAnnouncementText] = useState('');
  const [health, setHealth] = useState(null);
  const [toast, setToast] = useState('');

  const refreshUsers = () => setUsers(getAllUsersWithStats());

  useEffect(() => {
    refreshUsers();
    setDisabledTemplates(getDisabledTemplates());
    setAnnouncementText(getAnnouncement());
    axios.get(`${API_URL}/api/health`).then(res => setHealth(res.data)).catch(() => setHealth(null));
  }, []);

  if (!user) {
    return <div className="locked-msg">Please <Link to="/login">log in</Link> to view this page.</div>;
  }
  if (user.role !== 'admin') {
    return <div className="locked-msg">You don't have access to the admin dashboard.</div>;
  }

  const totalResumes = users.reduce((sum, u) => sum + (u.stats?.cvsCreated || 0), 0);
  const totalLogins = users.reduce((sum, u) => sum + (u.stats?.logins || 0), 0);

  const handleDelete = (targetUser) => {
    if (targetUser.email === user.email) {
      setToast("You can't delete your own account from here.");
      return;
    }
    if (!window.confirm(`Delete ${targetUser.email}? This removes their account and usage stats.`)) return;
    deleteUser(targetUser.email);
    refreshUsers();
    setToast(`${targetUser.email} was deleted.`);
  };

  const handleTemplateToggle = (key, enabled) => {
    setTemplateEnabled(key, enabled);
    setDisabledTemplates(getDisabledTemplates());
  };

  const handleAnnouncementSave = () => {
    setAnnouncement(announcement);
    setToast('Announcement updated.');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Alert severity="success" sx={{ mb: 4 }}>
        Welcome, Admin ({user.email}) — you have full system access.
      </Alert>
      <Typography variant="h4" fontWeight={700} gutterBottom>Admin Dashboard</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        System-wide overview and management tools.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<PeopleIcon fontSize="large" />} label="Total users" value={users.length} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<DescriptionIcon fontSize="large" />} label="Resumes created" value={totalResumes} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<LoginIcon fontSize="large" />} label="Total logins" value={totalLogins} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: 'primary.main' }}><SmartToyIcon fontSize="large" /></Box>
              <Box>
                <Chip
                  size="small"
                  color={health?.aiConfigured ? 'success' : 'default'}
                  label={health ? (health.aiConfigured ? 'AI enhancement live' : 'AI fallback mode') : 'Unknown'}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {health ? (health.jobsConfigured ? 'Live job search' : 'Sample job listings') : 'Server unreachable'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight={700} gutterBottom>Activity by user</Typography>
      <Paper sx={{ p: 2, mb: 5 }}>
        {users.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={users.map(u => ({ name: u.email.split('@')[0], Logins: u.stats?.logins || 0, Resumes: u.stats?.cvsCreated || 0 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE4FB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Logins" fill="#5323A4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Resumes" fill="#F5B841" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">No user activity yet.</Typography>
        )}
      </Paper>

      <Typography variant="h5" fontWeight={700} gutterBottom>Users</Typography>
      <TableContainer component={Paper} sx={{ mb: 5 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Logins</TableCell>
              <TableCell align="right">Resumes</TableCell>
              <TableCell>Last login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.email}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.name || '—'}</TableCell>
                <TableCell>{u.provider || 'email'}</TableCell>
                <TableCell>
                  <Chip size="small" color={u.role === 'admin' ? 'primary' : 'default'} label={u.role} />
                </TableCell>
                <TableCell align="right">{u.stats?.logins ?? 0}</TableCell>
                <TableCell align="right">{u.stats?.cvsCreated ?? 0}</TableCell>
                <TableCell>{u.stats?.lastLogin ? new Date(u.stats.lastLogin).toLocaleString() : '—'}</TableCell>
                <TableCell align="right">
                  <Button size="small" color="error" onClick={() => handleDelete(u)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {!users.length && (
              <TableRow><TableCell colSpan={8} align="center">No users yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" fontWeight={700} gutterBottom>Template visibility</Typography>
      <Paper sx={{ p: 2, mb: 5 }}>
        {TEMPLATES.map((t) => (
          <FormControlLabel
            key={t.key}
            sx={{ display: 'block' }}
            control={
              <Switch
                checked={!disabledTemplates.includes(t.key)}
                onChange={(e) => handleTemplateToggle(t.key, e.target.checked)}
              />
            }
            label={`${t.name} — ${t.description}`}
          />
        ))}
      </Paper>

      <Typography variant="h5" fontWeight={700} gutterBottom>Site announcement</Typography>
      <Paper sx={{ p: 2 }}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Shown as a banner on the home page. Leave blank to hide it."
          value={announcement}
          onChange={(e) => setAnnouncementText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleAnnouncementSave}>Save announcement</Button>
      </Paper>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminDashboard;
