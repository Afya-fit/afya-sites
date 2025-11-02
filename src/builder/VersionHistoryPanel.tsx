import React, { useState, useEffect, useRef } from 'react';
import { getCookie } from '../utils/api';
import { useBuilder } from './context/BuilderProvider';

// Inline styles to avoid Next.js CSS Modules restrictions
const styles = {
  panel: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    background: '#fff',
    borderLeft: '1px solid #e5e7eb',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: 0,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: '#6b7280',
  },
  error: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: '#6b7280',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: '#6b7280',
  },
  versionList: {
    padding: 0,
  },
  versionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative' as const,
  },
  versionItemSelected: {
    background: '#eff6ff',
    borderLeft: '3px solid #3b82f6',
    paddingLeft: '17px',
  },
  versionItemCurrent: {
    background: '#f0fdf4',
  },
  versionMain: {
    flex: 1,
    minWidth: 0,
  },
  versionNote: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#111827',
    marginBottom: '4px',
    lineHeight: '1.4',
  },
  versionMeta: {
    fontSize: '12px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  versionBadges: {
    display: 'flex',
    gap: '6px',
    marginTop: '6px',
  },
  badge: {
    fontSize: '10px',
    fontWeight: 500,
    padding: '2px 6px',
    borderRadius: '10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  badgeCurrent: {
    background: '#dcfce7',
    color: '#166534',
  },
  badgePublished: {
    background: '#dbeafe',
    color: '#1d4ed8',
  },
  versionActions: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    opacity: 0,
    transition: 'opacity 0.2s',
    marginLeft: '12px',
  },
  revertButton: {
    background: 'none',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    padding: '6px 10px',
    fontSize: '12px',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
    lineHeight: 1,
    fontWeight: '500',
  },
  footer: {
    padding: '12px 20px',
    borderTop: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  versionCount: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    textAlign: 'center' as const,
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #f3f4f6',
    borderTop: '2px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '12px',
  },
};

interface VersionInfo {
  id: string;
  note: string;
  date_created: string;
  sections_count: number;
  theme_name: string;
  draft_name: string;
  is_current: boolean;
  is_published: boolean;
  section_preview: string[];
}

interface VersionHistoryResponse {
  ok: boolean;
  business_id: string;
  versions: VersionInfo[];
  current_version_id: string | null;
  published_version_id: string | null;
  total_versions: number;
}

interface VersionHistoryPanelProps {
  businessId: string;
  onVersionSelect?: (versionId: string) => void;
  onVersionRevert?: (versionId: string) => void;
  onClose?: () => void;
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  businessId,
  onVersionSelect,
  onVersionRevert,
  onClose
}) => {
  const { startPreview, isPreviewMode, previewingVersionId, restoreVersion, exitPreview } = useBuilder();
  const [versions, setVersions] = useState<VersionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [reverting, setReverting] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch version history
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/sitebuilder/${businessId}/versions`, {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') || '',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: VersionHistoryResponse = await response.json();
        
        if (data.ok) {
          setVersions(data.versions);
          console.log('📚 Fetched versions:', data.versions.length);
          console.log('🎯 Backend current_version_id:', data.current_version_id);
          
          // Debug which versions are marked as current
          data.versions.forEach(v => {
            if (v.is_current) {
              console.log('✅ Backend marked as current:', v.id, v.note);
            }
          });
          
          // Auto-select current version
          if (data.current_version_id) {
            setSelectedVersionId(data.current_version_id);
            console.log('🔵 Set selectedVersionId to:', data.current_version_id);
          }
        } else {
          throw new Error('Failed to fetch version history');
        }
      } catch (err) {
        console.error('Error fetching version history:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchVersions();
    }
  }, [businessId]);

  // Click-outside detection - simple approach: just exit preview and close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        console.log('🖱️ Click outside detected - exiting preview and closing');
        // Simple approach: always exit preview and close
        exitPreview();
        if (onClose) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, exitPreview]);

  const refreshVersions = async () => {
    try {
      const response = await fetch(`/api/sitebuilder/${businessId}/versions`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.ok) {
        setVersions(data.versions);
        
        // Update selected version tracking
        if (data.current_version_id) {
          setSelectedVersionId(data.current_version_id);
        }
        
        console.log('🔄 Versions refreshed after restore');
      }
    } catch (err) {
      console.error('Error refreshing versions:', err);
    }
  };

  const handleVersionClick = (version: VersionInfo) => {
    setSelectedVersionId(version.id);
    console.log('👆 Version clicked:', version.id, version.note);
    
    // Direct preview update - always fetch and show version content
    startPreview(version.id);
    
    if (onVersionSelect) {
      onVersionSelect(version.id);
    }
  };

  const handleRevertClick = async (version: VersionInfo, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm(`Are you sure you want to revert to this version?\n\n"${version.note}"\n\nThis will create a new version with the selected content.`)) {
      return;
    }

    try {
      setReverting(version.id);
      setError(null);

      // Use the new restore method (no page refresh needed!)
      await restoreVersion(version.id);
      
      // Refresh versions list to show updated order and badges
      await refreshVersions();
    } catch (err) {
      console.error('❌ Error restoring version:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setReverting(null);
    }
  };


  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={styles.panel}>
        <div style={styles.header}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>Version History</h3>
          {onClose && (
            <button onClick={onClose} style={styles.closeButton}>×</button>
          )}
        </div>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading versions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.panel}>
        <div style={styles.header}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>Version History</h3>
          {onClose && (
            <button onClick={onClose} style={styles.closeButton}>×</button>
          )}
        </div>
        <div style={styles.error}>
          <p style={{ color: '#ef4444', marginBottom: '12px' }}>Failed to load versions</p>
          <p style={{ fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div ref={panelRef} style={styles.panel}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>Version History</h3>
        {onClose && (
          <button 
            onClick={() => {
              console.log('❌ X button clicked - exiting preview and closing');
              exitPreview();
              onClose();
            }} 
            style={styles.closeButton}
          >
            ×
          </button>
        )}
      </div>
      
      <div style={styles.content}>
        {versions.length === 0 ? (
          <div style={styles.empty}>
            <p>No versions found</p>
          </div>
        ) : (
          <div style={styles.versionList}>
            {versions.map((version) => {
              const isSelected = selectedVersionId === version.id;
              const isCurrent = version.is_current;
              const isPreviewing = previewingVersionId === version.id;
              
              // Debug logging for rendering
              if (isSelected || isCurrent || isPreviewing) {
                console.log(`🎨 Rendering version ${version.id}:`, {
                  isSelected,
                  isCurrent,
                  isPreviewing,
                  selectedVersionId,
                  previewingVersionId,
                  note: version.note
                });
              }
              
              const itemStyle = {
                ...styles.versionItem,
                ...(isSelected ? styles.versionItemSelected : {}),
                ...(isCurrent ? styles.versionItemCurrent : {}),
                ...(isPreviewing ? { background: '#fef3c7', borderLeft: '3px solid #f59e0b', paddingLeft: '17px' } : {}),
                ...(isSelected && isCurrent ? { background: '#dcfce7' } : {}),
              };
              
              return (
                <div
                  key={version.id}
                  style={itemStyle}
                  onClick={() => handleVersionClick(version)}
                  onMouseEnter={(e) => {
                    if (selectedVersionId !== version.id && !version.is_current) {
                      e.currentTarget.style.background = '#f9fafb';
                    }
                    const actions = e.currentTarget.querySelector('[data-actions]') as HTMLElement;
                    if (actions) actions.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedVersionId !== version.id && !version.is_current) {
                      e.currentTarget.style.background = 'transparent';
                    }
                    const actions = e.currentTarget.querySelector('[data-actions]') as HTMLElement;
                    if (actions) actions.style.opacity = '0';
                  }}
                >
                  <div style={styles.versionMain}>
                    <div style={styles.versionNote}>
                      {version.note.startsWith('Reverted to version') ? (
                        // Show revert notes prominently
                        <span style={{ color: '#f59e0b', fontWeight: 500 }}>↶ {version.note}</span>
                      ) : version.draft_name ? (
                        // Show draft name + timestamp for regular versions
                        <>
                          <strong>{version.draft_name}</strong>
                          <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '8px' }}>
                            {formatDate(version.date_created)}
                          </span>
                        </>
                      ) : (
                        // Fallback to note
                        version.note
                      )}
                    </div>
                    <div style={styles.versionMeta}>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>
                        {version.sections_count} section{version.sections_count !== 1 ? 's' : ''}
                        {version.section_preview && version.section_preview.length > 0 && (
                          <span style={{ marginLeft: '8px', color: '#9ca3af' }}>
                            • {version.section_preview.slice(0, 2).join(', ')}
                            {version.section_preview.length > 2 && '...'}
                          </span>
                        )}
                      </span>
                      {version.theme_name !== 'Default' && (
                        <span style={{ marginLeft: '8px' }}>• {version.theme_name}</span>
                      )}
                    </div>
                    <div style={styles.versionBadges}>
                      {version.is_current && (
                        <span style={{ ...styles.badge, ...styles.badgeCurrent }}>
                          CURRENT
                        </span>
                      )}
                      {version.is_published && (
                        <span style={{ ...styles.badge, ...styles.badgePublished }}>
                          LIVE
                        </span>
                      )}
                      {isPreviewing && (
                        <span style={{ ...styles.badge, background: '#fef3c7', color: '#f59e0b' }}>
                          PREVIEWING
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {!version.is_current && (
                    <div style={styles.versionActions} data-actions>
                      <button
                        onClick={(e) => handleRevertClick(version, e)}
                        disabled={reverting === version.id}
                        style={{
                          ...styles.revertButton,
                          ...(reverting === version.id ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                        }}
                        title="Revert to this version"
                        onMouseEnter={(e) => {
                          if (reverting !== version.id) {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#9ca3af';
                            e.currentTarget.style.color = '#374151';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (reverting !== version.id) {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.color = '#6b7280';
                          }
                        }}
                        >
                          {reverting === version.id ? 'Restoring...' : 'Restore'}
                        </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div style={styles.footer}>
        <p style={styles.versionCount}>{versions.length} version{versions.length !== 1 ? 's' : ''} total</p>
      </div>
    </div>
    </>
  );
};

export default VersionHistoryPanel;