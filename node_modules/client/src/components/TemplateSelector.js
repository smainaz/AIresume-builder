import React from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { TEMPLATES } from '../data/templates';
import TemplatePreviewThumbnail from './TemplatePreviewThumbnail';

function TemplateSelector({ value, onChange }) {
  return (
    <Box sx={{ mt: 4, px: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" gutterBottom align="center">Select a Resume Template</Typography>
      <Grid container spacing={2} justifyContent="center">
        {TEMPLATES.map((template) => {
          const selected = value === template.key;
          return (
            <Grid item key={template.key} xs={12} sm={6} md={3}>
              <Card
                elevation={selected ? 8 : 2}
                sx={{
                  borderRadius: 2,
                  border: selected ? '2px solid' : '2px solid transparent',
                  borderColor: selected ? 'primary.main' : 'transparent',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                }}
              >
                <CardActionArea onClick={() => onChange(template.key)}>
                  <TemplatePreviewThumbnail templateKey={template.key} />
                  <CardContent sx={{ py: 1.5, textAlign: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={700}>{template.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{template.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default TemplateSelector;
