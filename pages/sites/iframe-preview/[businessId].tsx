import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { SectionRenderer, BrandThemeProvider } from '../../../src';
import { SiteConfig, SectionUnion } from '../../../src/shared/types';

interface IframePreviewProps {
  businessId: string;
  initialConfig: SiteConfig;
  platformData: any;
}

/**
 * Dedicated iframe preview page for real-time site builder preview
 * 
 * This page runs inside an iframe and communicates with the parent builder
 * via postMessage API. It provides:
 * - Real-time config updates without page reload
 * - Production-accurate rendering (same as standalone preview)
 * - Proper viewport behavior for mobile simulation
 * - Isolated context that prevents builder UI interference
 */
export default function IframePreview({ businessId, initialConfig, platformData }: IframePreviewProps) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [updateKey, setUpdateKey] = useState(0); // Force re-renders

  // Listen for messages from parent builder
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from same origin
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'UPDATE_CONFIG':
          console.log('📨 [IframePreview] Received config update:', {
            theme: payload.config?.theme,
            sections: payload.config?.sections?.length
          });
          setConfig(payload.config);
          // Force re-render to ensure theme changes apply
          setUpdateKey(prev => prev + 1);
          break;

        case 'UPDATE_DEVICE':
          console.log('[IframePreview] Device changed:', payload.device);
          setDevice(payload.device);
          break;

        case 'SELECT_SECTION':
          console.log('[IframePreview] Section selected:', payload.index);
          setSelectedSectionIndex(payload.index);
          // Scroll to section after a brief delay to ensure rendering
          setTimeout(() => {
            scrollToSection(payload.index);
          }, 100);
          break;

        case 'PING':
          // Respond to health checks
          window.parent.postMessage({ type: 'PONG' }, '*');
          break;

        default:
          console.log('[IframePreview] Unknown message type:', type);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Send ready signal to parent
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Scroll to selected section
  const scrollToSection = (index: number) => {
    // Match the attribute used by SectionRenderer wrappers
    const sectionElement = document.querySelector(`[data-sb-section-index="${index}"]`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Calculate visible sections (same logic as standalone preview)
  const getVisibleSectionIndices = (sections: SectionUnion[], selected: number | null): number[] => {
    // If a links_page is selected, show ONLY that links section
    if (selected != null && sections[selected]?.type === 'links_page') {
      return [selected];
    }
    // Otherwise, hide links_page sections by default
    const visible: number[] = [];
    sections.forEach((section, index) => {
      if (section.type !== 'links_page') visible.push(index);
    });
    return visible;
  };

  if (!config) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        color: '#666'
      }}>
        Loading preview...
      </div>
    );
  }

  return (
    <div className="sb-root">
      <BrandThemeProvider key={updateKey} config={config}>
        <SectionRenderer
          sections={config.sections}
          data={{
            site_config: config,
            platform_data: platformData || {},
            __preview_device: device, // Real-time device updates
            __visible_indices: getVisibleSectionIndices(config.sections, selectedSectionIndex),
            __selected_index: selectedSectionIndex,
          }}
        />
        
        {/* Debug info only when explicitly enabled */}
      {process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true' && (
        <div style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          Iframe Preview | Device: {device} | Sections: {config.sections.length} | Selected: {selectedSectionIndex} | Updates: {updateKey}
        </div>
      )}
      </BrandThemeProvider>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { businessId, config: configParam } = context.query;

  // Validate businessId
  if (!businessId || typeof businessId !== 'string') {
    return { notFound: true };
  }

  // Parse initial config from URL parameter
  let initialConfig: SiteConfig;
  try {
    if (!configParam || typeof configParam !== 'string') {
      throw new Error('No config provided');
    }
    
    const decodedConfig = decodeURIComponent(configParam);
    initialConfig = JSON.parse(decodedConfig);
    
    // Validate config structure
    if (!initialConfig.sections || !Array.isArray(initialConfig.sections)) {
      throw new Error('Invalid config structure');
    }
  } catch (error) {
    console.error('Failed to parse initial config:', error);
    return { notFound: true };
  }

  // Fetch platform data (same as standalone preview)
  let platformData = {};
  try {
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const host = context.req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/public/sites/data-for/${businessId}`, {
      headers: {
        'Cookie': context.req.headers.cookie || '',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      platformData = data.platform_data || {};
    }
  } catch (error) {
    console.warn('Failed to fetch platform data for iframe preview:', error);
  }

  return {
    props: {
      businessId,
      initialConfig,
      platformData,
    },
  };
};
