/**
 * Typography System - Theme Layer Support
 * 
 * Defines font presets, scaling systems, and adaptive logic for the theme layer.
 * Supports the Display/Text hierarchy system with responsive scaling.
 * 
 * @version 1.1 - Enhanced Display/Text typography hierarchy system
 */

export interface FontPreset {
  heading: string;
  body: string;
}

export interface DisplayScale {
  heroBase: number;
  heroMax: number;
  h1Base: number;
  h1Max: number;
  h2Base: number;
  h2Max: number;
  h3Base: number;
  h3Max: number;
}

export interface TextScale {
  body: { base: number; max: number };
  subtitle: { base: number; max: number };
  small: { base: number; max: number };
}

export interface TypographyConfig {
  preset?: string;
  displayScale?: string;
  textScale?: string;
  adaptiveTitles?: boolean;
}

/**
 * Font Presets - Different font combinations for various brand personalities
 */
export const FONT_PRESETS: Record<string, FontPreset> = {
  modern: {
    heading: "'Inter', ui-sans-serif, system-ui, sans-serif",
    body: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  
  classic: {
    heading: "'Lora', Georgia, serif",
    body: "'Lato', ui-sans-serif, system-ui, sans-serif",
  },
  
  minimal: {
    heading: "'Manrope', ui-sans-serif, system-ui, sans-serif",
    body: "'Manrope', ui-sans-serif, system-ui, sans-serif",
  },
  
  energetic: {
    heading: "'Oswald', ui-sans-serif, system-ui, sans-serif",
    body: "'Lato', ui-sans-serif, system-ui, sans-serif",
  },
  
  friendly: {
    heading: "'Poppins', ui-sans-serif, system-ui, sans-serif",
    body: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  
  system: {
    heading: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    body: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
  },
};

/**
 * Display Typography Scales
 * Controls titles, headings, hero text - designed for impact and attention
 */
export const DISPLAY_SCALES: Record<string, DisplayScale> = {
  compact: {
    heroBase: 40,     heroMax: 56,     // Professional/conservative
    h1Base: 28,       h1Max: 38,
    h2Base: 22,       h2Max: 28,
    h3Base: 18,       h3Max: 22,
  },
  standard: {
    heroBase: 48,     heroMax: 72,     // Balanced (current default)
    h1Base: 32,       h1Max: 56,
    h2Base: 24,       h2Max: 36,
    h3Base: 20,       h3Max: 28,
  },
  expressive: {
    heroBase: 56,     heroMax: 84,     // Creative/lifestyle
    h1Base: 38,       h1Max: 64,
    h2Base: 28,       h2Max: 42,
    h3Base: 22,       h3Max: 32,
  },
  dramatic: {
    heroBase: 64,     heroMax: 96,     // Bold/statement
    h1Base: 44,       h1Max: 72,
    h2Base: 32,       h2Max: 48,
    h3Base: 24,       h3Max: 36,
  },
};

/**
 * Text Typography Scales  
 * Controls body text, descriptions, UI - optimized for readability
 */
export const TEXT_SCALES: Record<string, TextScale> = {
  compact: {
    body: { base: 14, max: 16 },
    subtitle: { base: 16, max: 18 },
    small: { base: 12, max: 14 },
  },
  standard: {
    body: { base: 16, max: 18 },     // Current default
    subtitle: { base: 18, max: 22 },
    small: { base: 14, max: 16 },
  },
  comfortable: {
    body: { base: 17, max: 19 },     // Easier reading
    subtitle: { base: 19, max: 24 },
    small: { base: 15, max: 17 },
  },
};

/**
 * Typography Override Multipliers
 * Used for section-level typography overrides
 */
export const TYPOGRAPHY_MULTIPLIERS = {
  displayScale: {
    compact: 0.85,
    standard: 1,
    expressive: 1.15,
    dramatic: 1.3,
  },
  textScale: {
    compact: 0.9,
    standard: 1,
    comfortable: 1.1,
  },
} as const;

/**
 * Generates CSS variables for typography configuration
 */
export function generateTypographyVariables(config: TypographyConfig): Record<string, string> {
  const displayScale = config.displayScale || 'standard';
  const textScale = config.textScale || 'standard';
  const adaptiveTitles = config.adaptiveTitles !== false; // Default true
  
  const displayConfig = DISPLAY_SCALES[displayScale] || DISPLAY_SCALES.standard;
  const textConfig = TEXT_SCALES[textScale] || TEXT_SCALES.standard;
  
  return {
    // Display Typography (titles, headings, hero)
    '--sb-fs-hero': `clamp(${displayConfig.heroBase}px, 8vw, ${displayConfig.heroMax}px)`,
    '--sb-fs-h1': `clamp(${displayConfig.h1Base}px, 6vw, ${displayConfig.h1Max}px)`,
    '--sb-fs-h2': `clamp(${displayConfig.h2Base}px, 5vw, ${displayConfig.h2Max}px)`,
    '--sb-fs-h3': `clamp(${displayConfig.h3Base}px, 4.5vw, ${displayConfig.h3Max}px)`,
    
    // Text Typography (body, descriptions, UI)
    '--sb-fs-body': `clamp(${textConfig.body.base}px, 3.5vw, ${textConfig.body.max}px)`,
    '--sb-fs-subtitle': `clamp(${textConfig.subtitle.base}px, 4vw, ${textConfig.subtitle.max}px)`,
    '--sb-fs-small': `clamp(${textConfig.small.base}px, 3vw, ${textConfig.small.max}px)`,
    
    // Scale identifiers for JS access
    '--sb-display-scale': displayScale,
    '--sb-text-scale': textScale,
    
    // Adaptive titles flag
    '--sb-adaptive-titles': adaptiveTitles ? '1' : '0',
  };
}

/**
 * Generates CSS font imports for the selected preset
 */
export function generateFontImport(preset: string): string {
  // This function is now deprecated and will return an empty string.
  // Font imports are handled globally in index.css.
  return '';
}

/**
 * Generates font family CSS variables for the selected preset
 */
export function generateFontFamilyVariables(preset: string): Record<string, string> {
  const fontPreset = FONT_PRESETS[preset] || FONT_PRESETS.system;
  
  return {
    '--sb-font-heading': fontPreset.heading,
    '--sb-font-body': fontPreset.body,
  };
}

/**
 * Adaptive Title Scaling - Character-length based multipliers
 * Prevents very long titles from being too large and very short titles from being too small
 */
export function getAdaptiveTitleMultiplier(text: string, enabled: boolean): number {
  if (!enabled || !text) return 1;
  
  const length = text.length;
  
  // Very long titles get smaller to fit better
  if (length > 80) return 0.8;
  
  // Long titles get slightly smaller
  if (length > 50) return 0.9;
  
  // Short titles can be bigger for impact
  if (length < 15) return 1.1;
  
  // Standard length titles use base size
  return 1;
}

/**
 * Applies typography override to an existing variables object
 * Used in section-level typography overrides
 */
export function applyTypographyOverride(
  vars: Record<string, string>,
  override?: {
    displayScale?: string;
    textScale?: string;
    fontPreset?: string;
    disableAdaptiveTitles?: boolean;
    customScaling?: {
      title?: number;
      subtitle?: number;
      body?: number;
    };
  }
): Record<string, string> {
  if (!override) return vars;
  
  // Apply display scale multiplier
  if (override.displayScale) {
    const multiplier = TYPOGRAPHY_MULTIPLIERS.displayScale[override.displayScale as keyof typeof TYPOGRAPHY_MULTIPLIERS.displayScale];
    if (multiplier) {
      vars['--sb-title-mult'] = String(multiplier);
    }
  }
  
  // Apply text scale multiplier
  if (override.textScale) {
    const multiplier = TYPOGRAPHY_MULTIPLIERS.textScale[override.textScale as keyof typeof TYPOGRAPHY_MULTIPLIERS.textScale];
    if (multiplier) {
      vars['--sb-text-mult'] = String(multiplier);
    }
  }
  
  // Apply custom scaling
  if (override.customScaling) {
    if (override.customScaling.title) {
      vars['--sb-title-mult'] = String(override.customScaling.title);
    }
    if (override.customScaling.subtitle) {
      vars['--sb-subtitle-mult'] = String(override.customScaling.subtitle);
    }
    if (override.customScaling.body) {
      vars['--sb-body-mult'] = String(override.customScaling.body);
    }
  }
  
  // Disable adaptive titles if requested
  if (override.disableAdaptiveTitles) {
    vars['--sb-adaptive-titles'] = '0';
  }
  
  return vars;
}

/**
 * Legacy font scale support for backward compatibility
 * @deprecated Use DISPLAY_SCALES and TEXT_SCALES instead
 */
export const LEGACY_FONT_SCALES = {
  standard: {
    '--sb-font-size-xl': 'clamp(20px, 3.2vw, 28px)',
    '--sb-font-size-xxl': 'clamp(32px, 6vw, 64px)',
  },
  large: {
    '--sb-font-size-xl': 'clamp(24px, 4vw, 36px)',
    '--sb-font-size-xxl': 'clamp(40px, 7.5vw, 80px)',
  },
} as const;
