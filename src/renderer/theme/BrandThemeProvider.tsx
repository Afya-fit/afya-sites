import React, { PropsWithChildren, useMemo } from 'react';
import type { SiteConfig } from '../types';

type Props = PropsWithChildren<{ config: SiteConfig | undefined | null }>;

export function BrandThemeProvider({ config, children }: Props) {
  const styleVars = useMemo(() => {
    const mode = config?.theme?.mode || 'light';
    const surface = mode === 'dark' ? '#0f1115' : '#ffffff';
    const text = mode === 'dark' ? '#eaeaea' : '#111111';
    const border = mode === 'dark' ? '#22262e' : '#e6e6e6';
    const brand = config?.theme?.accent === 'brand' ? '#2563eb' : '#6b7280';
    return {
      // Surface colors
      ['--sb-color-surface' as any]: surface,
      ['--sb-color-text' as any]: text,
      ['--sb-color-border' as any]: border,
      ['--sb-color-brand' as any]: brand,
    } as React.CSSProperties;
  }, [config]);

  return (
    <div style={styleVars}>
      {children}
    </div>
  );
}

export default BrandThemeProvider;


