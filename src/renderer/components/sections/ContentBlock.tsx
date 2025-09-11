import React from 'react';
import type { ContentBlockSection } from '../../types';
import MediaFrame from '../../utils/MediaFrame'

type Props = { section: ContentBlockSection };

export default function ContentBlock({ section }: Props) {
  const { title, body, media = [], layout = 'media_top', textAlign = 'left' } = section;
  const isGrid = media.length >= 2;
  const anyData: any = (globalThis as any).__SB_RENDER_DATA || {}
  const deviceHint: 'desktop'|'mobile'|undefined = anyData.__preview_device
  const isMobile = deviceHint === 'mobile'
  const mediaEl = media.length > 0 ? (
    isGrid ? (
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: media.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)' }}>
        {media.slice(0, 3).map((m: any, i) => (
          <figure key={i} style={{ margin: 0 }}>
            <MediaFrame src={m.url} alt={m.alt} ratio={m.ratio || '4x3'} fit={m.fit || 'contain'} />
          </figure>
        ))}
      </div>
    ) : (
      <figure style={{ margin: 0 }}>
        {isMobile ? (
          <div style={{ maxHeight: 'clamp(160px, 40vh, 360px)', width: '100%', marginInline: 'auto' }}>
            <MediaFrame src={(media[0] as any).url} alt={(media[0] as any).alt} ratio={(media[0] as any).ratio || '16x9'} fit={(media[0] as any).fit || 'cover'} />
          </div>
        ) : (
          <MediaFrame src={(media[0] as any).url} alt={(media[0] as any).alt} ratio={(media[0] as any).ratio || '16x9'} fit={(media[0] as any).fit || 'cover'} />
        )}
      </figure>
    )
  ) : null;

  const textEl = (
    <div style={{ textAlign }}>
      {title ? <h2 style={{ marginTop: 0 }}>{title}</h2> : null}
      {body ? <p>{body}</p> : null}
    </div>
  );

  let content: React.ReactNode;
  if (layout === 'media_left') {
    content = (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {mediaEl}
        {textEl}
      </div>
    );
  } else if (layout === 'media_right') {
    content = (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {textEl}
        {mediaEl}
      </div>
    );
  } else if (layout === 'media_top') {
    content = (
      <div style={{ display: 'grid', gap: 16 }}>
        {isMobile ? (
          <div style={{ maxHeight: 'clamp(160px, 40vh, 360px)', width: '100%', marginInline: 'auto' }}>
            {mediaEl}
          </div>
        ) : (
          <div style={{ maxWidth: (section as any).figureSize==='S'?360:(section as any).figureSize==='M'?640:960, marginInline: 'auto', width: '100%' }}>
            {mediaEl}
          </div>
        )}
        {textEl}
      </div>
    );
  } else {
    content = textEl;
  }

  return (
    <section style={{ padding: '40px 16px', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>{content}</div>
    </section>
  );
}


