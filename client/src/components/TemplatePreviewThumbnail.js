import React from 'react';

function ClassicThumb() {
  return (
    <div className="template-thumb template-thumb-classic">
      <div className="thumb-header">
        <div className="thumb-name">Jane Doe</div>
        <div className="thumb-contact">email@example.com</div>
      </div>
      <div className="thumb-section">
        <div className="thumb-label">Professional Summary</div>
        <div className="thumb-line" />
        <div className="thumb-line short" />
      </div>
      <div className="thumb-section">
        <div className="thumb-label">Experience</div>
        <div className="thumb-line" />
        <div className="thumb-line medium" />
      </div>
      <div className="thumb-chips">
        <span className="thumb-chip">Leadership</span>
        <span className="thumb-chip">Strategy</span>
      </div>
    </div>
  );
}

function ModernThumb() {
  return (
    <div className="template-thumb template-thumb-modern">
      <div className="thumb-sidebar" />
      <div className="thumb-body">
        <div className="thumb-name accent">Jane Doe</div>
        <div className="thumb-contact">email@example.com</div>
        <div className="thumb-section">
          <div className="thumb-label accent">Summary</div>
          <div className="thumb-line" />
        </div>
        <div className="thumb-section">
          <div className="thumb-label accent">Experience</div>
          <div className="thumb-line medium" />
        </div>
        <div className="thumb-pills">
          <span className="thumb-pill">Design</span>
          <span className="thumb-pill">React</span>
        </div>
      </div>
    </div>
  );
}

function MinimalThumb() {
  return (
    <div className="template-thumb template-thumb-minimal">
      <div className="thumb-name">Jane Doe</div>
      <div className="thumb-contact muted">email@example.com</div>
      <div className="thumb-inline"><strong>Summary:</strong> Experienced professional...</div>
      <div className="thumb-inline"><strong>Experience:</strong> Senior role at...</div>
      <div className="thumb-inline"><strong>Skills:</strong> Communication, Analysis</div>
    </div>
  );
}

function CreativeThumb() {
  return (
    <div className="template-thumb template-thumb-creative">
      <div className="thumb-name creative">Jane Doe ✨</div>
      <div className="thumb-contact">email@example.com</div>
      <div className="thumb-section">
        <div className="thumb-label creative">🌟 Summary</div>
        <div className="thumb-line" />
      </div>
      <div className="thumb-section">
        <div className="thumb-label creative">💼 Experience</div>
        <div className="thumb-line medium" />
      </div>
      <div className="thumb-chips">
        <span className="thumb-chip creative">UI/UX</span>
        <span className="thumb-chip creative">Branding</span>
      </div>
    </div>
  );
}

const previews = {
  classic: ClassicThumb,
  modern: ModernThumb,
  minimal: MinimalThumb,
  creative: CreativeThumb,
};

function TemplatePreviewThumbnail({ templateKey }) {
  const Preview = previews[templateKey] || ClassicThumb;
  return (
    <div className="template-preview-wrap" aria-hidden="true">
      <Preview />
    </div>
  );
}

export default TemplatePreviewThumbnail;
