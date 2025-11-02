/**
 * Dynamic Text Scaling Utilities - Enhanced for Display/Text Hierarchy v1.1
 * 
 * Automatically adjusts font sizes and line heights based on text length
 * to prevent overflow and maintain readability across different content lengths.
 * 
 * Now supports the new Display/Text hierarchy system with scale-aware configurations.
 * 
 * @version 1.1 - Enhanced for Display/Text typography hierarchy
 */

import { getVisibleCharacterCount } from './textRendering';

export interface TextScalingConfig {
  baseSize: number;
  minSize: number;
  maxLength: number;
  breakpoints: ReadonlyArray<{ length: number; scale: number; lineHeight: number }>;
}

export interface ScalingResult {
  fontSize: string;
  lineHeight: number;
  warning?: 'approaching_limit' | 'at_limit' | 'over_limit';
}

/**
 * Enhanced scaling configuration that adapts to Display/Text hierarchy scales
 */
export interface ScaleAwareConfig {
  displayScale: 'compact' | 'standard' | 'expressive' | 'dramatic';
  textScale: 'compact' | 'standard' | 'comfortable';
  maxLength: number;
  breakpoints: ReadonlyArray<{ length: number; scale: number; lineHeight: number }>;
}

/**
 * Display Typography Scales for base size calculation
 */
const DISPLAY_SCALE_BASES = {
  compact: { hero: 56, h1: 38, h2: 28, h3: 22 },
  standard: { hero: 72, h1: 56, h2: 36, h3: 28 },
  expressive: { hero: 84, h1: 64, h2: 42, h3: 32 },
  dramatic: { hero: 96, h1: 72, h2: 48, h3: 36 }
} as const;

/**
 * Text Typography Scales for base size calculation
 */
const TEXT_SCALE_BASES = {
  compact: { subtitle: 18, body: 16, small: 14 },
  standard: { subtitle: 22, body: 18, small: 16 },
  comfortable: { subtitle: 24, body: 19, small: 17 }
} as const;

/**
 * Legacy scaling presets - maintained for backward compatibility
 * @deprecated Use the new scale-aware functions instead
 */
export const TEXT_SCALING_PRESETS = {
  heroTitle: {
    baseSize: 72,
    minSize: 32,
    maxLength: 80,
    breakpoints: [
      { length: 20, scale: 1.0, lineHeight: 1.05 },
      { length: 40, scale: 0.9, lineHeight: 1.1 },
      { length: 60, scale: 0.8, lineHeight: 1.15 },
      { length: 80, scale: 0.7, lineHeight: 1.2 }
    ]
  },
  heroSubtitle: {
    baseSize: 24,
    minSize: 18,
    maxLength: 160,
    breakpoints: [
      { length: 50, scale: 1.0, lineHeight: 1.4 },
      { length: 100, scale: 0.95, lineHeight: 1.45 },
      { length: 140, scale: 0.9, lineHeight: 1.5 },
      { length: 160, scale: 0.85, lineHeight: 1.55 }
    ]
  },
  contentTitle: {
    baseSize: 36,
    minSize: 24,
    maxLength: 100,
    breakpoints: [
      { length: 30, scale: 1.0, lineHeight: 1.2 },
      { length: 50, scale: 0.95, lineHeight: 1.25 },
      { length: 80, scale: 0.9, lineHeight: 1.3 },
      { length: 100, scale: 0.85, lineHeight: 1.35 }
    ]
  },
  contentBody: {
    baseSize: 18,
    minSize: 16,
    maxLength: 600,
    breakpoints: [
      { length: 200, scale: 1.0, lineHeight: 1.6 },
      { length: 400, scale: 0.98, lineHeight: 1.65 },
      { length: 500, scale: 0.96, lineHeight: 1.7 },
      { length: 600, scale: 0.94, lineHeight: 1.75 }
    ]
  }
} as const;

/**
 * Enhanced scaling presets that adapt to Display/Text hierarchy scales
 */
export const ENHANCED_SCALING_PRESETS = {
  // Display Typography (titles, headings)
  heroTitle: {
    maxLength: 80,
    breakpoints: [
      { length: 15, scale: 1.0, lineHeight: 1.05 },
      { length: 30, scale: 0.9, lineHeight: 1.1 },
      { length: 50, scale: 0.8, lineHeight: 1.15 },
      { length: 70, scale: 0.7, lineHeight: 1.2 }
    ]
  },
  sectionTitle: {
    maxLength: 100,
    breakpoints: [
      { length: 20, scale: 1.0, lineHeight: 1.1 },
      { length: 40, scale: 0.95, lineHeight: 1.15 },
      { length: 60, scale: 0.85, lineHeight: 1.2 },
      { length: 80, scale: 0.75, lineHeight: 1.25 }
    ]
  },
  
  // Text Typography (body content)
  subtitle: {
    maxLength: 160,
    breakpoints: [
      { length: 50, scale: 1.0, lineHeight: 1.4 },
      { length: 100, scale: 0.95, lineHeight: 1.45 },
      { length: 140, scale: 0.9, lineHeight: 1.5 }
    ]
  },
  body: {
    maxLength: 600,
    breakpoints: [
      { length: 300, scale: 1.0, lineHeight: 1.6 },
      { length: 500, scale: 0.98, lineHeight: 1.65 },
      { length: 600, scale: 0.96, lineHeight: 1.7 }
    ]
  }
} as const;

/**
 * Calculate dynamic font size and line height based on text length
 */
export function calculateTextScaling(
  text: string,
  config: TextScalingConfig
): ScalingResult {
  // Use visible character count (excluding line breaks) for scaling calculations
  const length = getVisibleCharacterCount(text);
  
  // Find the appropriate breakpoint
  let scale = 1.0;
  let lineHeight = 1.4;
  
  for (const breakpoint of config.breakpoints) {
    if (length <= breakpoint.length) {
      scale = breakpoint.scale;
      lineHeight = breakpoint.lineHeight;
      break;
    }
  }
  
  // Calculate final font size
  const calculatedSize = Math.max(config.minSize, config.baseSize * scale);
  
  // Determine warning level
  let warning: ScalingResult['warning'];
  if (length > config.maxLength) {
    warning = 'over_limit';
  } else if (length > config.maxLength * 0.9) {
    warning = 'at_limit';
  } else if (length > config.maxLength * 0.75) {
    warning = 'approaching_limit';
  }
  
  return {
    fontSize: `${calculatedSize}px`,
    lineHeight,
    warning
  };
}

/**
 * Generate CSS custom properties for dynamic text scaling
 */
export function generateTextScalingCSS(
  text: string,
  preset: keyof typeof TEXT_SCALING_PRESETS
): Record<string, string> {
  const config = TEXT_SCALING_PRESETS[preset];
  const result = calculateTextScaling(text, config);
  
  const cssVars: Record<string, string> = {};
  
  switch (preset) {
    case 'heroTitle':
      cssVars['--fs-hero-dynamic'] = result.fontSize;
      cssVars['--lh-hero-dynamic'] = result.lineHeight.toString();
      break;
    case 'heroSubtitle':
      cssVars['--fs-sub-dynamic'] = result.fontSize;
      cssVars['--lh-sub-dynamic'] = result.lineHeight.toString();
      break;
    case 'contentTitle':
      cssVars['--fs-h2-dynamic'] = result.fontSize;
      cssVars['--lh-h2-dynamic'] = result.lineHeight.toString();
      break;
    case 'contentBody':
      cssVars['--fs-body-dynamic'] = result.fontSize;
      cssVars['--lh-body-dynamic'] = result.lineHeight.toString();
      break;
  }
  
  return cssVars;
}

/**
 * Enhanced scale-aware text scaling functions for v1.1 Display/Text hierarchy
 */

/**
 * Calculate text scaling for Display Typography (titles, headings)
 */
export function calculateDisplayScaling(
  text: string,
  elementType: 'hero' | 'h1' | 'h2' | 'h3',
  displayScale: 'compact' | 'standard' | 'expressive' | 'dramatic' = 'standard'
): ScalingResult {
  const baseSize = DISPLAY_SCALE_BASES[displayScale][elementType];
  const minSize = Math.round(baseSize * 0.4); // 40% of base as minimum
  
  let preset: keyof typeof ENHANCED_SCALING_PRESETS;
  if (elementType === 'hero') {
    preset = 'heroTitle';
  } else {
    preset = 'sectionTitle';
  }
  
  const config = ENHANCED_SCALING_PRESETS[preset];
  const length = getVisibleCharacterCount(text);
  
  // Find appropriate breakpoint
  let scale = 1.0;
  let lineHeight = elementType === 'hero' ? 1.05 : 1.1;
  
  for (const breakpoint of config.breakpoints) {
    if (length <= breakpoint.length) {
      scale = breakpoint.scale;
      lineHeight = breakpoint.lineHeight;
      break;
    }
  }
  
  const calculatedSize = Math.max(minSize, baseSize * scale);
  
  // Warning levels
  let warning: ScalingResult['warning'];
  if (length > config.maxLength) {
    warning = 'over_limit';
  } else if (length > config.maxLength * 0.9) {
    warning = 'at_limit';
  } else if (length > config.maxLength * 0.75) {
    warning = 'approaching_limit';
  }
  
  return {
    fontSize: `${calculatedSize}px`,
    lineHeight,
    warning
  };
}

/**
 * Calculate text scaling for Text Typography (body, subtitles)
 */
export function calculateTextScaling_v2(
  text: string,
  elementType: 'subtitle' | 'body' | 'small',
  textScale: 'compact' | 'standard' | 'comfortable' = 'standard'
): ScalingResult {
  const baseSize = TEXT_SCALE_BASES[textScale][elementType];
  const minSize = Math.round(baseSize * 0.85); // 85% of base as minimum for readability
  
  const preset = elementType === 'subtitle' ? 'subtitle' : 'body';
  const config = ENHANCED_SCALING_PRESETS[preset];
  const length = getVisibleCharacterCount(text);
  
  // Find appropriate breakpoint
  let scale = 1.0;
  let lineHeight = elementType === 'subtitle' ? 1.4 : 1.6;
  
  for (const breakpoint of config.breakpoints) {
    if (length <= breakpoint.length) {
      scale = breakpoint.scale;
      lineHeight = breakpoint.lineHeight;
      break;
    }
  }
  
  const calculatedSize = Math.max(minSize, baseSize * scale);
  
  // Warning levels
  let warning: ScalingResult['warning'];
  if (length > config.maxLength) {
    warning = 'over_limit';
  } else if (length > config.maxLength * 0.9) {
    warning = 'at_limit';
  } else if (length > config.maxLength * 0.75) {
    warning = 'approaching_limit';
  }
  
  return {
    fontSize: `${calculatedSize}px`,
    lineHeight,
    warning
  };
}

/**
 * Generate enhanced CSS custom properties for Display/Text hierarchy
 */
export function generateEnhancedScalingCSS(
  text: string,
  elementType: 'heroTitle' | 'heroSubtitle' | 'sectionTitle' | 'body',
  displayScale: 'compact' | 'standard' | 'expressive' | 'dramatic' = 'standard',
  textScale: 'compact' | 'standard' | 'comfortable' = 'standard'
): Record<string, string> {
  const cssVars: Record<string, string> = {};
  
  switch (elementType) {
    case 'heroTitle': {
      const result = calculateDisplayScaling(text, 'hero', displayScale);
      cssVars['--fs-hero-dynamic'] = result.fontSize;
      cssVars['--lh-hero-dynamic'] = result.lineHeight.toString();
      break;
    }
    case 'heroSubtitle': {
      const result = calculateTextScaling_v2(text, 'subtitle', textScale);
      cssVars['--fs-sub-dynamic'] = result.fontSize;
      cssVars['--lh-sub-dynamic'] = result.lineHeight.toString();
      break;
    }
    case 'sectionTitle': {
      const result = calculateDisplayScaling(text, 'h2', displayScale);
      cssVars['--fs-h2-dynamic'] = result.fontSize;
      cssVars['--lh-h2-dynamic'] = result.lineHeight.toString();
      break;
    }
    case 'body': {
      const result = calculateTextScaling_v2(text, 'body', textScale);
      cssVars['--fs-body-dynamic'] = result.fontSize;
      cssVars['--lh-body-dynamic'] = result.lineHeight.toString();
      break;
    }
  }
  
  return cssVars;
}

/**
 * Character count utilities
 */
export function getCharacterStatus(
  text: string,
  maxLength: number
): {
  count: number;
  remaining: number;
  percentage: number;
  status: 'good' | 'warning' | 'danger' | 'over';
} {
  // Use visible character count (excluding line breaks) for character limits
  const count = getVisibleCharacterCount(text);
  const remaining = maxLength - count;
  const percentage = (count / maxLength) * 100;
  
  let status: 'good' | 'warning' | 'danger' | 'over';
  if (count > maxLength) {
    status = 'over';
  } else if (percentage >= 95) {
    status = 'danger';
  } else if (percentage >= 75) {
    status = 'warning';
  } else {
    status = 'good';
  }
  
  return {
    count,
    remaining,
    percentage: Math.round(percentage),
    status
  };
}

/**
 * Text truncation utilities
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Smart word wrapping - breaks at word boundaries when possible
 */
export function smartWrap(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxLength) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word is longer than maxLength, force break
        lines.push(word.slice(0, maxLength));
        currentLine = word.slice(maxLength);
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
