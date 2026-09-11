import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Paper, Typography, Box, Avatar, Chip, Stack, CircularProgress } from '@mui/material';

function ResumeForm({ setResumeData }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    targetRole: '',
    summary: '',
    experience: '',
    education: '',
    skills: [],
    hobbies: '',
    languages: '',
    certifications: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkillInput = (e) => {
    setSkillInput(e.target.value);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  };

  const handleAIEnhance = async () => {
    if (!form.name || !form.email) {
      alert('Please fill in at least your name and email before enhancing with AI.');
      return;
    }
    setLoading(true);
    try {
      // Keep image locally for preview, but do NOT send base64 image to backend
      const aiData = { ...form, image };
      setResumeData(aiData);
      const payload = { ...form };
      const API_URL = process.env.REACT_APP_API_URL || 'https://airesume-builder-o7gf.onrender.com';
      const res = await axios.post(`${API_URL}/api/ai-resume`, payload);
      const enhanced = {
        name: res.data.name ?? form.name,
        email: res.data.email ?? form.email,
        phone: res.data.phone ?? form.phone,
        targetRole: res.data.targetRole ?? form.targetRole,
        summary: res.data.summary ?? form.summary,
        experience: res.data.experience ?? form.experience,
        education: res.data.education ?? form.education,
        skills: Array.isArray(res.data.skills) ? res.data.skills : form.skills,
        hobbies: res.data.hobbies ?? form.hobbies,
        languages: res.data.languages ?? form.languages,
        certifications: res.data.certifications ?? form.certifications,
        headline: res.data.headline ?? '',
      };
      setForm(enhanced);
      setResumeData({ ...enhanced, image });
      const modelNote = res.data.model ? ` (${res.data.model})` : '';
      alert(`Resume fully enhanced${modelNote}! Summary, experience, skills, and more have been rewritten.`);
    } catch (err) {
      console.error('AI enhancement error:', err);
      const status = err.response?.status;
      if (status === 413) {
        alert('The request was too large. Please try again without a large photo.');
      } else if (status === 429) {
        alert('Too many requests. Please wait a few seconds and try again.');
      } else if (status === 500) {
        alert('AI enhancement failed. Please check your OpenRouter API key in server/.env file and restart the server.');
      } else if (err.code === 'ECONNREFUSED') {
        alert('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        const detail = err.response?.data?.error || err.message || 'Unknown error';
        alert('AI enhancement failed: ' + detail);
      }
    }
    setLoading(false);
  };

  // Update resume data whenever form changes
  React.useEffect(() => {
    if (form.name || form.email) {
      setResumeData({ ...form, image });
    }
  }, [form, image, setResumeData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResumeData({ ...form, image });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box component={Paper} elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">Resume Builder</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={image} sx={{ width: 80, height: 80, mb: 1 }} />
            <Button variant="outlined" component="label" size="small">
              Upload Photo
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Target Role (e.g. Senior Software Engineer)"
              name="targetRole"
              value={form.targetRole}
              onChange={handleChange}
              fullWidth
              placeholder="Helps AI tailor your resume to a specific job"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Professional Summary" name="summary" value={form.summary} onChange={handleChange} fullWidth multiline rows={3} placeholder="Rough notes are fine — AI will polish this" />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Experience" name="experience" value={form.experience} onChange={handleChange} fullWidth multiline rows={4} placeholder="Job title, company, dates, and what you did — AI turns this into achievement bullets" />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Education" name="education" value={form.education} onChange={handleChange} fullWidth multiline rows={2} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Add a skill and press Enter"
              value={skillInput}
              onChange={handleSkillInput}
              onKeyDown={e => { if (e.key === 'Enter') handleAddSkill(e); }}
              fullWidth
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
              {form.skills.map((skill, i) => (
                <Chip
                  key={i}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  color="primary"
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Hobbies" name="hobbies" value={form.hobbies} onChange={handleChange} fullWidth multiline rows={2} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Languages" name="languages" value={form.languages} onChange={handleChange} fullWidth multiline rows={2} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Certifications" name="certifications" value={form.certifications} onChange={handleChange} fullWidth multiline rows={2} />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth size="large">Generate Resume</Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              size="large"
              onClick={handleAIEnhance}
              disabled={loading}
              sx={{ mt: 1 }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'AI is rewriting your resume...' : '✨ AI Pro Enhance'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default ResumeForm; 