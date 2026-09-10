import React from 'react';
import jsPDF from 'jspdf';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function DownloadPDF({ resumeData, template }) {
  const handleDownload = () => {
    if (!resumeData || !resumeData.name) {
      alert('Please fill in your resume details before downloading.');
      return;
    }

    const doc = new jsPDF();
    let y = 15;
    
    // Add profile image if present
    if (resumeData.image) {
      // Draw image at top left, size 32x32mm
      doc.addImage(resumeData.image, 'JPEG', 15, y, 32, 32);
      y += 36;
    }
    
    // Apply template-specific styling
    const templateStyles = {
      classic: {
        headerColor: '#3730a3',
        sectionColor: '#6366f1',
        backgroundColor: '#ffffff',
        fontFamily: 'helvetica'
      },
      modern: {
        headerColor: '#6366f1',
        sectionColor: '#6366f1',
        backgroundColor: '#f1f5f9',
        fontFamily: 'helvetica'
      },
      minimal: {
        headerColor: '#22223b',
        sectionColor: '#22223b',
        backgroundColor: '#ffffff',
        fontFamily: 'helvetica'
      },
      creative: {
        headerColor: '#f59e42',
        sectionColor: '#6366f1',
        backgroundColor: '#fdf6e3',
        fontFamily: 'helvetica'
      }
    };
    
    const styles = templateStyles[template] || templateStyles.classic;
    
    // Header with template-specific styling
    doc.setFont(styles.fontFamily, 'bold');
    doc.setFontSize(24);
    doc.setTextColor(styles.headerColor);
    doc.text(resumeData.name || '', 105, y, { align: 'center' });
    y += 12;
    
    doc.setFont(styles.fontFamily, 'normal');
    doc.setFontSize(12);
    doc.setTextColor('#64748b');
    const contactInfo = `Email: ${resumeData.email || ''}    Phone: ${resumeData.phone || ''}`;
    doc.text(contactInfo, 105, y, { align: 'center' });
    y += 20;
    
    // Add a line separator for modern and creative templates
    if (template === 'modern' || template === 'creative') {
      doc.setDrawColor(styles.sectionColor);
      doc.setLineWidth(0.5);
      doc.line(10, y, 200, y);
      y += 15;
    }
    
    // Professional Summary
    if (resumeData.summary) {
      doc.setFontSize(16);
      doc.setFont(styles.fontFamily, 'bold');
      doc.setTextColor(styles.sectionColor);
      
      // Template-specific section headers
      let sectionTitle = 'Professional Summary';
      if (template === 'modern') sectionTitle = 'Summary';
      if (template === 'creative') sectionTitle = '🌟 Summary';
      
      doc.text(sectionTitle, 10, y);
      y += 8;
      
      doc.setFont(styles.fontFamily, 'normal');
      doc.setFontSize(11);
      doc.setTextColor('#22223b');
      const summaryLines = doc.splitTextToSize(resumeData.summary, 190);
      doc.text(summaryLines, 10, y);
      y += (summaryLines.length * 6) + 12;
    }
    
    // Experience
    if (resumeData.experience) {
      doc.setFontSize(16);
      doc.setFont(styles.fontFamily, 'bold');
      doc.setTextColor(styles.sectionColor);
      
      let sectionTitle = 'Experience';
      if (template === 'creative') sectionTitle = '💼 Experience';
      
      doc.text(sectionTitle, 10, y);
      y += 8;
      
      doc.setFont(styles.fontFamily, 'normal');
      doc.setFontSize(11);
      doc.setTextColor('#22223b');
      const experienceLines = doc.splitTextToSize(resumeData.experience, 190);
      doc.text(experienceLines, 10, y);
      y += (experienceLines.length * 6) + 12;
    }
    
    // Education
    if (resumeData.education) {
      doc.setFontSize(16);
      doc.setFont(styles.fontFamily, 'bold');
      doc.setTextColor(styles.sectionColor);
      
      let sectionTitle = 'Education';
      if (template === 'creative') sectionTitle = '🎓 Education';
      
      doc.text(sectionTitle, 10, y);
      y += 8;
      
      doc.setFont(styles.fontFamily, 'normal');
      doc.setFontSize(11);
      doc.setTextColor('#22223b');
      const educationLines = doc.splitTextToSize(resumeData.education, 190);
      doc.text(educationLines, 10, y);
      y += (educationLines.length * 6) + 12;
    }
    
    // Skills
    if (resumeData.skills && (resumeData.skills.length > 0 || resumeData.skills)) {
      doc.setFontSize(16);
      doc.setFont(styles.fontFamily, 'bold');
      doc.setTextColor(styles.sectionColor);
      
      let sectionTitle = 'Skills';
      if (template === 'creative') sectionTitle = '🛠️ Skills';
      
      doc.text(sectionTitle, 10, y);
      y += 8;
      
      doc.setFont(styles.fontFamily, 'normal');
      doc.setFontSize(11);
      doc.setTextColor('#22223b');
      
      let skillsArr = [];
      if (Array.isArray(resumeData.skills)) {
        skillsArr = resumeData.skills;
      } else if (typeof resumeData.skills === 'string') {
        skillsArr = resumeData.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      
      // For modern template, format skills differently
      if (template === 'modern') {
        const skillsText = skillsArr.join(' • ');
        const skillsLines = doc.splitTextToSize(skillsText, 190);
        doc.text(skillsLines, 10, y);
      } else {
        skillsArr.forEach((skill, i) => {
          doc.text(`• ${skill}`, 14, y + i * 6);
        });
      }
    }
    
    doc.save(`resume-${template}.pdf`);
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      sx={{ mt: 2 }}
    >
      Download PDF
    </Button>
  );
}

export default DownloadPDF; 