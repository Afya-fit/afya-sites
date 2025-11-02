import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useBuilder } from './context/BuilderProvider'
import VersionHistoryPanel from './VersionHistoryPanel'

/**
 * PostMessage-based Preview Pane
 * 
 * This component creates an iframe that loads a dedicated preview page
 * and communicates via postMessage API. This architecture provides:
 * - Production-accurate rendering (same as standalone preview)
 * - Isolated context that prevents builder UI interference
 * - Real-time updates without page reload
 * - Bulletproof mobile simulation
 */
export default function PreviewPane() {
  const { draft, published, view, device, selectedIndex, businessId, isPreviewMode, previewingConfig, previewingVersionId, exitPreview } = useBuilder()
  const active = useMemo(() => {
    if (isPreviewMode && previewingConfig) {
      return previewingConfig
    }
    return view === 'draft' ? draft : published || draft
  }, [view, draft, published, isPreviewMode, previewingConfig])
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [iframeReady, setIframeReady] = useState(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Send message to iframe
  const sendToIframe = useCallback((type: string, payload: any) => {
    if (iframeRef.current?.contentWindow && iframeReady) {
      iframeRef.current.contentWindow.postMessage({ type, payload }, '*')
    }
  }, [iframeReady])

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from same origin
      if (event.origin !== window.location.origin) {
        return
      }

      const { type } = event.data

      switch (type) {
        case 'IFRAME_READY':
          console.log('[PreviewPane] Iframe ready')
          setIframeReady(true)
          break

        case 'PONG':
          // Health check response
          break

        default:
          console.log('[PreviewPane] Unknown message from iframe:', type)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Send config updates to iframe when active config changes (debounced)
  useEffect(() => {
    if (!active || !iframeReady) return

    // Clear previous timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    // Debounce config updates to prevent excessive flashing
    updateTimeoutRef.current = setTimeout(() => {
      console.log('🚀 [PreviewPane] Sending config update to iframe:', {
        theme: active.theme,
        sections: active.sections?.length
      })
      sendToIframe('UPDATE_CONFIG', { config: active })
    }, 150) // 150ms debounce

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [active, iframeReady, sendToIframe])

  // Send device updates to iframe (immediate, no debounce)
  useEffect(() => {
    if (!iframeReady) return
    
    console.log('[PreviewPane] Sending immediate device update to iframe:', device)
    sendToIframe('UPDATE_DEVICE', { device })
  }, [device, iframeReady, sendToIframe])

  // Send section selection to iframe (immediate, no debounce)
  useEffect(() => {
    if (!iframeReady || selectedIndex == null) return
    
    console.log('[PreviewPane] Sending immediate section selection to iframe:', selectedIndex)
    sendToIframe('SELECT_SECTION', { index: selectedIndex })
  }, [selectedIndex, iframeReady, sendToIframe])

  // Generate stable iframe URL (only depends on businessId, not config)
  const iframeUrl = useMemo(() => {
    if (!businessId) return ''
    
    // Use minimal initial config to avoid URL length issues
    const minimalConfig = {
      meta: {},
      theme: { mode: 'light', accent: 'blue' },
      sections: [],
      version: '1.0'
    }
    
    try {
      const configParam = encodeURIComponent(JSON.stringify(minimalConfig))
      return `/platform/sites/iframe-preview/${businessId}?config=${configParam}`
    } catch (error) {
      console.error('Failed to generate iframe URL:', error)
      return ''
    }
  }, [businessId]) // Only regenerate if businessId changes

  if (!active) {
    return (
      <div style={{ padding: 16, opacity: .6 }}>
        Loading…
      </div>
    )
  }

  if (!iframeUrl) {
    return (
      <div style={{ padding: 24, color: 'var(--sb-color-text)' }}>
        <strong>Preview Error</strong>
        <div style={{ marginTop: 8, opacity: .8 }}>
          Unable to generate preview URL. Please check your configuration.
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)' }}>
      <PreviewControls />
      <div
        className='site-preview-container'
        style={{
          background: '#f7f7f8',
          padding: device === 'mobile' ? '24px 0' : '0',
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div
          className='site-preview-shadow-wrapper'
          style={{
            width: device === 'mobile' ? 375 : '100%',
            height: '100%',
            marginInline: device === 'mobile' ? 'auto' : undefined,
            borderRadius: device === 'mobile' ? 24 : 4,
            boxShadow: device === 'mobile' ? '0 0 0 12px #e2e2e2, 0 2px 20px rgba(0,0,0,.1)' : undefined,
            border: '1px solid var(--sb-color-border)',
            overflow: 'hidden',
          }}
        >
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'white',
            }}
            title="Site Preview"
            // Security attributes
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
          
          {/* Loading overlay */}
          {!iframeReady && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#666',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Loading preview...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


function PreviewControls() {
  const { device, setDevice, view, setView, businessId, draft, published, updateDraft, previewingVersionId, exitPreview } = useBuilder() as any
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [selectedVersionFromHistory, setSelectedVersionFromHistory] = useState<string | null>(null)
  
  // Check if there are unpublished changes
  const hasUnpublishedChanges = draft && published && JSON.stringify(draft) !== JSON.stringify(published)
  const hasPublishedVersion = !!published
  
  const openQAPreview = () => {
    if (!draft) {
      alert('No draft available for preview');
      return;
    }
    
    try {
      // Encode the site configuration for URL passing
      const configParam = encodeURIComponent(JSON.stringify(draft));
      const previewUrl = `/platform/sites/preview/${businessId}?config=${configParam}`;
      
      // Open in new tab - completely standalone
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open QA preview:', error);
      alert('Failed to open preview. Please try again.');
    }
  };
  
  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#fff', borderBottom: '1px solid var(--sb-color-border)', borderRadius: '4px 4px 0 0' }}>
      {/* QA Preview Button */}
      <button
        onClick={openQAPreview}
        disabled={!draft}
        style={{
          padding: '6px 12px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '500',
          cursor: draft ? 'pointer' : 'not-allowed',
          opacity: draft ? 1 : 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        title="Open standalone preview in new tab for QA testing"
      >
🔍 Preview Full Page
      </button>
      
      {/* Draft Name Field & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
            Draft Name:
          </label>
          <input
            type="text"
            value={draft?.meta?.draftName || ''}
            onChange={(e) => updateDraft({ meta: { ...draft?.meta, draftName: e.target.value } })}
            placeholder="My Website"
            style={{
              padding: '6px 8px',
              border: '1px solid var(--sb-color-border)',
              borderRadius: '6px',
              fontSize: '13px',
              width: '140px',
              backgroundColor: '#fff'
            }}
          />
        </div>
        
        {/* Status Indicator */}
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          Viewing: 
          <span style={{ 
            fontWeight: '500',
            color: view === 'draft' ? '#f59e0b' : '#10b981'
          }}>
            {view === 'draft' ? 'Draft' : 'Published'}
          </span>
          {view === 'draft' && hasUnpublishedChanges && (
            <span style={{ color: '#f59e0b' }}>• Unsaved changes</span>
          )}
        </div>
      </div>
      
      {/* Existing Controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ display: 'inline-flex', border: '1px solid var(--sb-color-border)', borderRadius: 8, overflow: 'hidden' }}>
          <button onClick={() => setDevice('desktop')} style={{ padding: '6px 10px', background: device==='desktop'?'#eee':'#fff', border: 'none' }}>Desktop</button>
          <button onClick={() => setDevice('mobile')} style={{ padding: '6px 10px', background: device==='mobile'?'#eee':'#fff', border: 'none', borderLeft: '1px solid var(--sb-color-border)' }}>Mobile</button>
        </div>
        
        {/* Version History Button */}
        <button
          onClick={() => setShowVersionHistory(!showVersionHistory)}
          title="View version history"
          style={{ 
            padding: '6px 8px', 
            borderRadius: 8, 
            border: '1px solid var(--sb-color-border)', 
            display: 'inline-flex', 
            alignItems: 'center', 
            background: showVersionHistory ? '#e6f6ec' : '#fff',
            color: showVersionHistory ? '#0a5a2a' : '#666'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M12 7v5l4 2"/>
          </svg>
        </button>
        
        <div style={{ display: 'inline-flex', border: '1px solid var(--sb-color-border)', borderRadius: 8, overflow: 'hidden' }}>
          <button 
            onClick={() => setView('draft')} 
            style={{ 
              padding: '6px 10px', 
              background: view==='draft'?'#eee':'#fff', 
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px'
            }}
          >
            Draft
            {hasUnpublishedChanges && (
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: '#f59e0b',
                display: 'inline-block'
              }} title="Unpublished changes" />
            )}
          </button>
          <button 
            onClick={() => setView('published')} 
            disabled={!hasPublishedVersion}
            style={{ 
              padding: '6px 10px', 
              background: view==='published'?'#eee':'#fff', 
              border: 'none', 
              borderLeft: '1px solid var(--sb-color-border)',
              opacity: hasPublishedVersion ? 1 : 0.5,
              cursor: hasPublishedVersion ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px'
            }}
            title={hasPublishedVersion ? 'View published version' : 'No published version available'}
          >
            Published
            {hasPublishedVersion && (
              <span style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: '#10b981',
                display: 'inline-block'
              }} />
            )}
          </button>
        </div>
      </div>
    </div>
    
    {/* Version History Panel - Left Side Flyout */}
    {showVersionHistory && (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '360px', 
        height: '100vh', 
        zIndex: 1000,
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
      }}>
        <VersionHistoryPanel
          businessId={businessId}
          onClose={() => {
            // This close comes from either X button or click-outside
            console.log('📝 VersionHistoryPanel onClose called');
            console.log('📝 previewingVersionId:', previewingVersionId);
            console.log('📝 selectedVersionFromHistory:', selectedVersionFromHistory);
            
            // Simple approach: just exit preview and close
            exitPreview();
            setShowVersionHistory(false);
            setSelectedVersionFromHistory(null);
          }}
          onVersionSelect={(versionId) => {
            // Track which version was selected for potential validation
            setSelectedVersionFromHistory(versionId);
            console.log('Version selected for preview:', versionId);
          }}
          onVersionRevert={(versionId) => {
            // Using the new restore method that doesn't require page refresh
            console.log('Version restored:', versionId);
            // Note: VersionHistoryPanel handles the restore via restoreVersion()
          }}
        />
      </div>
    )}
    </>
  )
}
