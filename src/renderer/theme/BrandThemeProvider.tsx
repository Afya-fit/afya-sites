/**
 * BrandThemeProvider - Theme Layer Implementation
 * 
 * Simplified theme provider that focuses on the theme layer of the One-Path Styling Framework.
 * Converts theme configuration into CSS variables and applies them to document.documentElement.
 * 
 * Architecture:
 * 1. Import design token fallbacks (tokens.css)
 * 2. Resolve theme configuration (palettes, typography)
 * 3. Apply CSS variables to root element (theme layer)
 * 4. Let sections override via SectionBox (section layer)
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import type { SiteConfig, SiteTheme } from '../types';

// Import theme utilities
import { resolveAccentPalette, SURFACE_COLORS } from './palettes';
import { 
  generateTypographyVariables, 
  generateFontFamilyVariables,
} from './typography';

export interface BrandThemeProviderProps {
  config: SiteConfig | undefined | null;
  children: React.ReactNode;
}

/**
 * Derives theme CSS variables from site configuration
 */
function deriveThemeVariables(theme: SiteTheme): Record<string, string> {
  const mode = theme.mode || 'light';
  const accent = theme.accent || 'blue';
  const typography = theme.typography || {};
  
  // Resolve color palette
  const brandPalette = resolveAccentPalette(accent, mode);
  const surfaceColors = SURFACE_COLORS[mode];
  
  // Generate typography variables
  const typographyVars = generateTypographyVariables({
    preset: typography.preset || 'modern',
    displayScale: typography.displayScale || 'standard',
    textScale: typography.textScale || 'standard',
    adaptiveTitles: typography.adaptiveTitles !== false,
  });
  
  // Generate font family variables
  const fontVars = generateFontFamilyVariables(typography.preset || 'modern');
  
  return {
    // Color system (theme layer)
    '--sb-color-surface': surfaceColors.surface,
    '--sb-color-surface-alt': surfaceColors.surfaceAlt,
    '--sb-color-text': surfaceColors.text,
    '--sb-color-text-muted': surfaceColors.textMuted,
    '--sb-color-border': surfaceColors.border,
    '--sb-color-bg-alt': surfaceColors.bgAlt,
    
    // Brand colors (theme layer)
    '--sb-color-brand': brandPalette.brand,
    '--sb-color-brand-hover': brandPalette.brandHover,
    '--sb-color-brand-contrast': brandPalette.brandContrast,
    '--sb-color-accent': brandPalette.accent,
    '--sb-color-neutral': brandPalette.neutral,
    
    // Typography system (theme layer)
    ...typographyVars,
    ...fontVars,
    
    // Theme metadata
    '--sb-theme-mode': mode,
    '--sb-theme-accent': accent,
  };
}
/**
 * BrandThemeProvider Component
 * 
 * Applies theme-level CSS variables to the document root.
 * Works in both main window and iframe contexts.
 */
export function BrandThemeProvider({ config, children }: BrandThemeProviderProps) {
  // Resolve theme configuration with defaults
  const theme = useMemo<SiteTheme>(() => {
    return config?.theme || {
      mode: 'light',
      accent: 'blue',
      typography: {
        preset: 'modern',
        displayScale: 'standard',
        textScale: 'standard',
        adaptiveTitles: true,
      },
    };
  }, [config?.theme]);
  
  // Generate CSS variables for the theme
  const themeVariables = useMemo(() => {
    return deriveThemeVariables(theme);
  }, [theme]);
  
  // Apply theme variables to document root (client-side only)
  useEffect(() => {
    // Skip during SSR - no document exists
    if (typeof document === 'undefined') return;
    
    const documentElement = document.documentElement;
    
    // Apply all theme variables
    Object.entries(themeVariables).forEach(([property, value]) => {
      documentElement.style.setProperty(property, value);
    });
    
    
    // Cleanup function to remove variables if component unmounts
    return () => {
      Object.keys(themeVariables).forEach((property) => {
        documentElement.style.removeProperty(property);
      });
    };
  }, [themeVariables, theme]);
  
  // Expose theme configuration globally for section components (client-side only)
  useEffect(() => {
    if (typeof globalThis === 'undefined') return; // Skip during SSR
    try {
      const themeConfig = {
        mode: theme.mode || 'light',
        accent: theme.accent || 'blue',
        displayScale: theme.typography?.displayScale || 'standard',
        textScale: theme.typography?.textScale || 'standard',
        adaptiveTitles: theme.typography?.adaptiveTitles !== false,
        fontPreset: theme.typography?.preset || 'modern',
      };
      
      // Set in both globalThis and window for iframe compatibility
      (globalThis as any).__SB_THEME_CONFIG = themeConfig;
      
      if (typeof window !== 'undefined') {
        (window as any).__SB_THEME_CONFIG = themeConfig;
      }
    } catch (error) {
      console.warn('[BrandThemeProvider] Failed to expose theme config globally:', error);
    }
  }, [theme]);
  
  return (
    <>
      {/* Render children with theme applied */}
      {children}
    </>
  );
}

/**
 * Hook to access current theme configuration
 */
export function useThemeConfig() {
  return useMemo(() => {
    try {
      return (globalThis as any).__SB_THEME_CONFIG || (window as any).__SB_THEME_CONFIG || {
        mode: 'light',
        accent: 'blue',
        displayScale: 'standard',
        textScale: 'standard',
        adaptiveTitles: true,
        fontPreset: 'modern',
      };
    } catch {
      return {
        mode: 'light',
        accent: 'blue',
        displayScale: 'standard',
        textScale: 'standard',
        adaptiveTitles: true,
        fontPreset: 'modern',
      };
    }
  }, []);
}

export default BrandThemeProvider;
