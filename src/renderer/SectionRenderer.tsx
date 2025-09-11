import React from 'react';
import type { SectionUnion, SiteConfig } from './types';
import Hero from './components/sections/Hero';
import ContentBlock from './components/sections/ContentBlock';
import BusinessData from './components/sections/BusinessData';
import SpecialOffers from './components/sections/SpecialOffers';
import LinksPage from './components/sections/LinksPage';
import Schedule from './components/sections/Schedule';
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
      />
      {sections.map((section, index) => {
        if (Array.isArray(visible) && !visible.includes(index)) return null
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
  );
}


