import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography, Grid, Button } from '@mui/material';
import { TEMPLATES } from '../data/templates';
import TemplatePreviewThumbnail from './TemplatePreviewThumbnail';
import { getDisabledTemplates } from '../utils/admin';

function TemplateGallery() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('classic');
  const disabled = getDisabledTemplates();
  const visibleTemplates = TEMPLATES.filter(t => !disabled.includes(t.key));

  useEffect(() => {
    setSelected(localStorage.getItem('selectedTemplate') || 'classic');
  }, []);

  const handleSelect = (key) => {
    localStorage.setItem('selectedTemplate', key);
    setSelected(key);
    navigate('/builder');
  };

  return (
    <div className="template-gallery">
      <h2>Choose Your Resume Template</h2>
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        {visibleTemplates.map((template) => {
          const isSelected = selected === template.key;
          return (
            <Grid item key={template.key} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  border: isSelected ? '2px solid #1976d2' : '2px solid transparent',
                  boxShadow: isSelected ? 6 : 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                }}
              >
                <CardActionArea onClick={() => handleSelect(template.key)}>
                  <TemplatePreviewThumbnail templateKey={template.key} />
                  <CardContent>
                    <Typography variant="h6" align="center">{template.name}</Typography>
                    <Typography variant="body2" align="center" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Button
                  variant={isSelected ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                  onClick={() => handleSelect(template.key)}
                  sx={{ borderRadius: 0 }}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default TemplateGallery;
