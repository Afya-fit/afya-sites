import React from 'react';
import { useBuilder } from './context/BuilderProvider';

const styles = {
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
    borderBottom: '2px solid #f59e0b',
    color: '#92400e',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  icon: {
    fontSize: '16px',
  },
  text: {
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  button: {
    background: '#ffffff',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#f59e0b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  primaryButton: {
    background: '#f59e0b',
    color: '#ffffff',
    border: '1px solid #f59e0b',
  },
};

export const PreviewBanner: React.FC = () => {
  const { isPreviewMode, previewingVersionId, exitPreview, restoreVersion } = useBuilder();

  if (!isPreviewMode || !previewingVersionId) {
    return null;
  }

  const handleRestore = async () => {
    if (confirm('Restore this version as the current draft?\n\nThis will create a new version with this content.')) {
      try {
        await restoreVersion();
        console.log('✅ Version restored from preview banner');
      } catch (error) {
        console.error('❌ Failed to restore version:', error);
        alert(`Failed to restore version: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <div style={styles.banner}>
      <div style={styles.content}>
        <span style={styles.icon}>👁️</span>
        <p style={styles.text}>
          Preview Mode - Viewing historical version • Editing is disabled
        </p>
      </div>
      
      <div style={styles.actions}>
        <button
          onClick={exitPreview}
          style={styles.button}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleRestore}
          style={{ ...styles.button, ...styles.primaryButton }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d97706';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f59e0b';
          }}
        >
          Restore & Edit
        </button>
      </div>
    </div>
  );
};

export default PreviewBanner;
