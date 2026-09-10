import React from 'react';
import { Paper, Typography, Box, Avatar, Grid } from '@mui/material';

function ClassicTemplate({ resumeData }) {
  return (
    <div className="resume-preview resume-card classic-template">
      <div className="resume-header">
        <h2>{resumeData.name}</h2>
        <div className="resume-contact">
          <span>{resumeData.email}</span> | <span>{resumeData.phone}</span>
        </div>
      </div>
      <div className="resume-section">
        <h3>Professional Summary</h3>
        <p>{resumeData.summary}</p>
      </div>
      <div className="resume-section">
        <h3>Experience</h3>
        <p>{resumeData.experience}</p>
      </div>
      <div className="resume-section">
        <h3>Education</h3>
        <p>{resumeData.education}</p>
      </div>
      <div className="resume-section">
        <h3>Skills</h3>
        <div className="skills-chips-preview">
          {Array.isArray(resumeData.skills)
            ? resumeData.skills.map((skill, i) => (
                <span className="skill-chip" key={i}>{skill}</span>
              ))
            : resumeData.skills && resumeData.skills.split(',').map((skill, i) => (
                <span className="skill-chip" key={i}>{skill.trim()}</span>
              ))}
        </div>
      </div>
    </div>
  );
}

function ModernTemplate({ resumeData }) {
  return (
    <div className="resume-preview resume-card modern-template">
      <div className="resume-header">
        <h2>{resumeData.name}</h2>
        <div className="resume-contact">
          <span>{resumeData.email}</span> | <span>{resumeData.phone}</span>
        </div>
      </div>
      <div className="resume-section">
        <h3>Summary</h3>
        <p>{resumeData.summary}</p>
      </div>
      <div className="resume-section">
        <h3>Experience</h3>
        <p>{resumeData.experience}</p>
      </div>
      <div className="resume-section">
        <h3>Education</h3>
        <p>{resumeData.education}</p>
      </div>
      <div className="resume-section">
        <h3>Skills</h3>
        <ul className="modern-skills-list">
          {Array.isArray(resumeData.skills)
            ? resumeData.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))
            : resumeData.skills && resumeData.skills.split(',').map((skill, i) => (
                <li key={i}>{skill.trim()}</li>
              ))}
        </ul>
      </div>
    </div>
  );
}

function MinimalTemplate({ resumeData }) {
  return (
    <div className="resume-preview resume-card minimal-template">
      <div className="resume-header">
        <h2>{resumeData.name}</h2>
        <div className="resume-contact">
          <span>{resumeData.email}</span> | <span>{resumeData.phone}</span>
        </div>
      </div>
      <div className="resume-section">
        <strong>Summary:</strong> {resumeData.summary}
      </div>
      <div className="resume-section">
        <strong>Experience:</strong> {resumeData.experience}
      </div>
      <div className="resume-section">
        <strong>Education:</strong> {resumeData.education}
      </div>
      <div className="resume-section">
        <strong>Skills:</strong> {Array.isArray(resumeData.skills) ? resumeData.skills.join(', ') : resumeData.skills}
      </div>
    </div>
  );
}

function CreativeTemplate({ resumeData }) {
  return (
    <div className="resume-preview resume-card creative-template">
      <div className="creative-header">
        <h2>{resumeData.name}</h2>
        <div className="creative-contact">
          <span>{resumeData.email}</span> | <span>{resumeData.phone}</span>
        </div>
      </div>
      <div className="creative-section creative-summary">
        <h3>🌟 Summary</h3>
        <p>{resumeData.summary}</p>
      </div>
      <div className="creative-section">
        <h3>💼 Experience</h3>
        <p>{resumeData.experience}</p>
      </div>
      <div className="creative-section">
        <h3>🎓 Education</h3>
        <p>{resumeData.education}</p>
      </div>
      <div className="creative-section">
        <h3>🛠️ Skills</h3>
        <div className="skills-chips-preview">
          {Array.isArray(resumeData.skills)
            ? resumeData.skills.map((skill, i) => (
                <span className="skill-chip creative-skill" key={i}>{skill}</span>
              ))
            : resumeData.skills && resumeData.skills.split(',').map((skill, i) => (
                <span className="skill-chip creative-skill" key={i}>{skill.trim()}</span>
              ))}
        </div>
      </div>
    </div>
  );
}

function ResumePreview({ resumeData, template }) {
  if (!resumeData || !resumeData.name) return <div className="resume-preview">Fill the form to preview your resume.</div>;
  switch (template) {
    case 'modern':
      return <ModernTemplate resumeData={resumeData} />;
    case 'minimal':
      return <MinimalTemplate resumeData={resumeData} />;
    case 'creative':
      return <CreativeTemplate resumeData={resumeData} />;
    case 'classic':
    default:
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 700, bgcolor: '#fff', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {resumeData.image && (
                <Avatar src={resumeData.image} sx={{ width: 90, height: 90 }} />
              )}
              <Box>
                <Typography variant="h5" gutterBottom align="left">{resumeData.name}</Typography>
                <Typography variant="subtitle1" align="left" color="textSecondary">{resumeData.email} | {resumeData.phone}</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Professional Summary</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{resumeData.summary}</Typography>
              <Typography variant="h6">Experience</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{resumeData.experience}</Typography>
              <Typography variant="h6">Education</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{resumeData.education}</Typography>
              <Typography variant="h6">Skills</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{Array.isArray(resumeData.skills) ? resumeData.skills.join(', ') : resumeData.skills}</Typography>
              {resumeData.hobbies && (
                <>
                  <Typography variant="h6">Hobbies</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{resumeData.hobbies}</Typography>
                </>
              )}
              {resumeData.languages && (
                <>
                  <Typography variant="h6">Languages</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{resumeData.languages}</Typography>
                </>
              )}
              {resumeData.certifications && (
                <>
                  <Typography variant="h6">Certifications</Typography>
                  <Typography variant="body1">{resumeData.certifications}</Typography>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      );
  }
}

export default ResumePreview; 