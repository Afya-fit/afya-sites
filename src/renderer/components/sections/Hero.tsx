import React from 'react';
import type { HeroSection } from '../../types';
import MediaFrame from '../../utils/MediaFrame'

type HeroProps = { section: HeroSection };

export default function Hero({ section }: HeroProps) {
  const { title, subtitle, backgroundImageUrl, backgroundFocal, contentImageUrl, align = 'center', valign = 'center', brandEmphasis } = section;
  const alignItems = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
  const justifyContent = valign === 'top' ? 'flex-start' : valign === 'bottom' ? 'flex-end' : 'center';
  // Choose focal based on preview device hint if present
  const anyData: any = (globalThis as any).__SB_RENDER_DATA || {}
  const deviceHint: 'desktop'|'mobile'|undefined = anyData.__preview_device
  const focal = deviceHint === 'mobile' ? backgroundFocal?.mobile || backgroundFocal?.desktop : backgroundFocal?.desktop
  const bgPos = focal ? `${focal.xPct}% ${focal.yPct}%` : 'center center'
  return (
    <section
      aria-label="Hero"
      style={{
        position: 'relative',
        padding: '56px 16px',
        minHeight: 280,
        background: backgroundImageUrl
          ? `url(${backgroundImageUrl}) ${bgPos}/cover no-repeat`
          : brandEmphasis
          ? 'linear-gradient(180deg, #f5f7ff 0%, #ffffff 100%)'
          : '#ffffff',
        borderBottom: '1px solid #eee',
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems,
          justifyContent,
          gap: 12,
          textAlign: align === 'left' ? 'left' : align === 'right' ? 'right' : 'center',
          minHeight: 200,
        }}
      >
        {contentImageUrl ? (
          <div style={{ maxWidth: '100%', marginInline: 0, alignSelf: 'auto' }}>
            <MediaFrame
              src={contentImageUrl}
              alt={(section as any).contentImageAlt || title || 'Hero image'}
              ratio={(section as any).contentImageRatio || '16x9'}
              fit={(section as any).contentImageFit || 'cover'}
              heightPx={(section as any).contentImageSize==='S' ? 120 : (section as any).contentImageSize==='L' ? 200 : 160}
            />
          </div>
        ) : null}
        {title ? (
          <h1 style={{ margin: 0 }}>{title}</h1>
        ) : null}
        {subtitle ? (
          <p style={{ margin: 0, color: '#555' }}>{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}


