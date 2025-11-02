import React from 'react';
import type { SectionUnion, SiteConfig } from './types';
import { Hero } from './components/sections/hero/Hero';
import ContentBlock from './components/sections/content-block';
import BusinessData from './components/sections/business-data';
import SpecialOffers from './components/sections/special-offers';
import LinksPage from './components/sections/links-page';
import Schedule from './components/sections/schedule';

import SiteHeader from './components/SiteHeader';

type SectionRendererProps = {
  sections: SectionUnion[];
  data?: { site_config?: SiteConfig } & Record<string, unknown>;
};

export default function SectionRenderer(props: SectionRendererProps) {
  const { sections } = props;
  const visible = (props.data as any)?.__visible_indices as number[] | undefined
  
  
  if (!sections || sections.length === 0) {
    return null;
  }
  // Expose data to children without prop-drilling for preview hints
  ;(globalThis as any).__SB_RENDER_DATA = props.data
  return (
    <div>
      <SiteHeader
        businessName={(props.data as any)?.platform_data?.business_info?.name || ''}
        logoUrl={(props.data as any)?.site_config?.theme?.logo_url || ''}
      />
      <div className="site-container">
        {sections.map((section, index) => {
          const isVisible = !Array.isArray(visible) || visible.includes(index);
          
          
          if (!isVisible) return null
          switch (section.type) {
          case 'hero':
            return (
              <div key={index} data-sb-section-index={index}>
                <Hero section={section} />
              </div>
            );
          case 'content_block':
            return (
              <div key={index} data-sb-section-index={index}>
                <ContentBlock section={section} />
              </div>
            );
          case 'business_data':
            return (
              <div key={index} data-sb-section-index={index}>
                <BusinessData section={section} data={props.data} />
              </div>
            );
          case 'special_offers':
            return (
              <div key={index} data-sb-section-index={index}>
                <SpecialOffers section={section} />
              </div>
            );
          case 'links_page':
            return (
              <div key={index} data-sb-section-index={index}>
                <LinksPage section={section} />
              </div>
            );
          case 'schedule':
            return (
              <div key={index} data-sb-section-index={index}>
                <Schedule section={section as any} data={props.data} />
              </div>
            );
          default:
            return null;
        }
      })}
      </div>
    </div>
  );
}


