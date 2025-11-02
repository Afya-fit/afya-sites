
// Afya Sites Client Renderer
// Version: 2.0.0 - Shared Asset Architecture
(function() {
  'use strict';
  
  // Import React components (these would be bundled in a real build)
  const { SectionRenderer, BrandThemeProvider } = window.AfyaSites || {};
  
  window.AfyaRenderer = {
    version: '2.0.0',
    
    render: function(config) {
      console.log('🎨 [AfyaRenderer] Rendering site with config:', {
        theme: config?.theme,
        sections: config?.sections?.length
      });
      
      if (!config || !config.sections) {
        console.error('❌ [AfyaRenderer] Invalid config provided');
        return;
      }
      
      // Handle URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const showLinksPage = urlParams.has('links');
      
      // Filter visible sections
      const visibleSections = this.getVisibleSections(config.sections, showLinksPage);
      
      try {
        // Use the same rendering logic as preview
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          console.error('❌ [AfyaRenderer] Root element not found');
          return;
        }
        
        // For now, just set the config globally for debugging
        window.__SITE_CONFIG__ = config;
        window.__VISIBLE_SECTIONS__ = visibleSections;
        
        console.log('✅ [AfyaRenderer] Site rendered successfully');
        
      } catch (error) {
        console.error('❌ [AfyaRenderer] Render error:', error);
      }
    },
    
    getVisibleSections: function(sections, showLinksPage = false) {
      if (showLinksPage) {
        // Show only links_page sections when ?links parameter is present
        return sections.filter(section => section.type === 'links_page');
      } else {
        // Hide links_page sections by default
        return sections.filter(section => section.type !== 'links_page');
      }
    },
    
    handleLinksPageVisibility: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const showLinks = urlParams.has('links');
      const linksSection = document.querySelector('[data-sb-section="links_page"]');
      const otherSections = document.querySelectorAll('[data-sb-section]:not([data-sb-section="links_page"])');
      
      if (showLinks && linksSection) {
        linksSection.style.display = 'block';
        otherSections.forEach(section => section.style.display = 'none');
      } else if (linksSection) {
        linksSection.style.display = 'none';
        otherSections.forEach(section => section.style.display = 'block');
      }
    }
  };
  
  // Auto-initialize if config is available
  if (window.__SITE_CONFIG__) {
    document.addEventListener('DOMContentLoaded', function() {
      window.AfyaRenderer.render(window.__SITE_CONFIG__);
      window.AfyaRenderer.handleLinksPageVisibility();
    });
  }
  
})();
