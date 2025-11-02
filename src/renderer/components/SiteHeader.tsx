import React from 'react';

type SiteHeaderProps = {
  logoUrl?: string;
  businessName?: string;
};

export default function SiteHeader(props: SiteHeaderProps) {
  const { logoUrl, businessName } = props;
  return (
    <header style={{ padding: '12px 16px', borderBottom: '1px solid var(--sb-color-border)', background: 'var(--sb-color-surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={businessName || 'Logo'}
            style={{ height: 32, width: 32, objectFit: 'contain' }}
          />
        ) : null}
        <strong style={{ color: 'var(--sb-color-text)' }}>{businessName || ''}</strong>
      </div>
    </header>
  );
}


