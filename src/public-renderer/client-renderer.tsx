/**
 * Client-side renderer for published sites
 * This mirrors the preview iframe renderer but for standalone sites
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrandThemeProvider } from '../renderer/theme/BrandThemeProvider';
import SectionRenderer from '../renderer/SectionRenderer';
import type { SiteConfig, SectionUnion } from '../renderer/types';

interface PublicSiteData {
  site_config: SiteConfig;
  platform_data: {
    business_info: any;
    schedule_data?: any;
  };
}

function PublicSiteRenderer({ siteData }: { siteData: PublicSiteData }) {
  return (
    <BrandThemeProvider config={siteData.site_config}>
      <div className="sb-root">
        <SectionRenderer 
          sections={siteData.site_config.sections} 
          data={{
            site_config: siteData.site_config,
            platform_data: siteData.platform_data,
            __visible_indices: getVisibleSectionIndices(siteData.site_config.sections)
          }}
        />
      </div>
    </BrandThemeProvider>
  );
}

function getVisibleSectionIndices(sections: SectionUnion[]): number[] {
  const urlParams = new URLSearchParams(window.location.search);
  const showLinks = urlParams.has('links');
  
  return sections
    .map((section, index) => {
      // Links page: only show when ?links parameter is present
      if (section.type === 'links_page') {
        return showLinks ? index : -1;
      }
      // Other sections: hide when ?links parameter is present
      return showLinks ? -1 : index;
    })
    .filter(index => index !== -1);
}

// Initialize the renderer when DOM is ready
function initRenderer() {
  try {
    console.log('🚀 [PublicRenderer] Initializing...');
    
    const rootElement = document.getElementById('site-root');
    if (!rootElement) {
      console.error('❌ [PublicRenderer] Root element #site-root not found');
      return;
    }

    const siteData = (window as any).__SITE_DATA__ as PublicSiteData;
    if (!siteData) {
      console.error('❌ [PublicRenderer] No site data found in window.__SITE_DATA__');
      return;
    }

    console.log('✅ [PublicRenderer] Site data loaded:', {
      business_id: siteData.site_config?.business_id,
      sections: siteData.site_config?.sections?.length,
      theme: siteData.site_config?.theme
    });

    const root = createRoot(rootElement);
    root.render(
      <PublicSiteRenderer siteData={siteData} />
    );
    
    console.log('✅ [PublicRenderer] React app rendered successfully');
  } catch (error) {
    console.error('❌ [PublicRenderer] Failed to initialize:', error);
    
    // Show error in the UI
    const rootElement = document.getElementById('site-root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #dc2626;">
          <h2>Site Loading Error</h2>
          <p>Unable to load site content.</p>
          <details style="margin-top: 16px;">
            <summary>Technical Details</summary>
            <pre style="background: #f3f4f6; padding: 12px; border-radius: 4px; margin-top: 8px; text-align: left; overflow: auto;">${error}</pre>
          </details>
        </div>
      `;
    }
  }
}

// Wait for DOM and then initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRenderer);
} else {
  initRenderer();
}
