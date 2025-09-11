import React from 'react';
import type { SpecialOffersSection } from '../../types';

type Props = { section: SpecialOffersSection };

export default function SpecialOffers({ section }: Props) {
  const { title, offers } = section;
  return (
    <section style={{ padding: '40px 16px', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {title ? <h2 style={{ marginTop: 0 }}>{title}</h2> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {offers.map(of => (
            <article key={of.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>{of.title}</h3>
              {of.description ? <p>{of.description}</p> : null}
              {of.price ? <p><strong>{of.price}</strong></p> : null}
              {of.ctaHref && of.ctaLabel ? (
                <a href={of.ctaHref} style={{ color: '#1f6feb' }}>{of.ctaLabel}</a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


