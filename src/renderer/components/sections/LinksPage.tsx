import React from 'react';
import type { LinksPageSection } from '../../types';

type Props = { section: LinksPageSection };

export default function LinksPage({ section }: Props) {
  const { title, links } = section;
  return (
    <section style={{ padding: '40px 16px', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        {title ? <h2 style={{ marginTop: 0 }}>{title}</h2> : null}
        <div style={{ display: 'grid', gap: 12 }}>
          {links.map(link => (
            <a
              key={link.id}
              href={link.href}
              style={{ display: 'block', padding: '12px 16px', border: '1px solid #eee', borderRadius: 8 }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


