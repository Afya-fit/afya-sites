import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { SectionRenderer, BrandThemeProvider } from '../../../src';
import type { SiteConfig, SectionUnion } from '../../../src/shared/types';

interface StandalonePreviewProps {
  config: SiteConfig;
  businessId: string;
  platformData?: any;
}

/**
 * Calculate which sections should be visible in standalone preview
 * This mimics the production behavior where only certain sections render
 * 
 * For now, we simply hide links_page sections since they should only show
 * when specifically selected (like when you click on them in the builder).
 * 
 * Future enhancement: Add a preview button in the links section editor
 * that opens a standalone preview with just the links page visible.
 */
function getVisibleSectionIndices(sections: SectionUnion[]): number[] {
  // Hide links_page in full-page (standalone) preview
  const visible: number[] = [];
  sections.forEach((section, index) => {
    if (section.type !== 'links_page') visible.push(index);
  });
  return visible;
}

/**
 * Standalone QA Preview Page
 * 
 * This is a completely standalone site preview that opens in a new tab.
 * It has no builder UI, no iframe, no parent window - just the pure site.
 * 
 * Benefits:
 * - True mobile viewport behavior
 * - Perfect debugging with normal DevTools
 * - Exact production rendering behavior
 * - No iframe context isolation issues
 * - Shareable preview URLs
 */
export default function StandalonePreview({ config, businessId, platformData }: StandalonePreviewProps) {
  // Debug: Log standalone preview config
  console.log('🌟 [StandalonePreview] Rendering with config:', {
    theme: config?.theme,
    sections: config?.sections?.length
  });

  // Add debug info only when explicitly enabled
  const isDebug = process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true';
  
  return (
    <>
      <Head>
        <title>Site Preview - {config.business_id}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <style>{`
          /* Reset for clean preview */
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
        `}</style>
      </Head>

      {/* Debug info in development */}
      {isDebug && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          fontSize: '12px',
          zIndex: 9999,
          borderBottomLeftRadius: '4px'
        }}>
          QA Preview | Business: {businessId} | Sections: {config.sections?.length || 0}
        </div>
      )}

      {/* Pure site rendering - exactly like production */}
      <div className="sb-root">
        <BrandThemeProvider config={config}>
        {config.sections && config.sections.length > 0 ? (
          <SectionRenderer
            sections={config.sections}
            data={{
              site_config: config,
              platform_data: platformData || {}, // Real platform data for schedule/business sections
              __preview_device: 'desktop', // This is a real viewport, not simulated
              __visible_indices: getVisibleSectionIndices(config.sections), // Hide links page and other only_selected sections
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div>
              <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>No Content</h2>
              <p style={{ margin: 0 }}>This site doesn&apos;t have any sections yet.</p>
            </div>
          </div>
        )}
        </BrandThemeProvider>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { businessId, config } = context.query;

  // Validate required parameters
  if (!businessId || typeof businessId !== 'string') {
    return {
      notFound: true,
    };
  }

  if (!config || typeof config !== 'string') {
    return {
      redirect: {
        destination: `/sitebuilder/${businessId}`,
        permanent: false,
      },
    };
  }

  try {
    // Parse the site configuration from query parameter
    const siteConfig: SiteConfig = JSON.parse(decodeURIComponent(config));
    
    // Basic validation
    if (!siteConfig || typeof siteConfig !== 'object') {
      throw new Error('Invalid site configuration');
    }

    // Ensure required fields exist
    const validatedConfig: SiteConfig = {
      version: siteConfig.version || '1.0',
      business_id: businessId,
      theme: siteConfig.theme || {
        theme_version: '1.1',
        mode: 'light',
        accent: 'blue',
        typography: {
          preset: 'modern',
          displayScale: 'standard',
          textScale: 'standard',
          adaptiveTitles: true
        }
      },
      sections: siteConfig.sections || [],
      meta: siteConfig.meta || {}
    };

    // Fetch platform data for business info and schedule sections
    let platformData = {};
    try {
      // Make server-side request to get platform data
      const protocol = context.req.headers['x-forwarded-proto'] || 'http';
      const host = context.req.headers.host;
      const baseUrl = `${protocol}://${host}`;
      
      const response = await fetch(`${baseUrl}/api/public/sites/data-for/${businessId}`, {
        headers: {
          // Forward cookies for authentication
          'Cookie': context.req.headers.cookie || '',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        platformData = data.platform_data || {};
      }
    } catch (error) {
      console.warn('Failed to fetch platform data for preview:', error);
      // Continue with empty platform data - preview will still work
    }

    return {
      props: {
        config: validatedConfig,
        businessId,
        platformData,
      },
    };
  } catch (error) {
    console.error('Failed to parse site configuration:', error);
    
    // Redirect back to builder on invalid config
    return {
      redirect: {
        destination: `/sitebuilder/${businessId}?error=invalid_config`,
        permanent: false,
      },
    };
  }
};
