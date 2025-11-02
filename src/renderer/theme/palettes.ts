/**
 * Brand Color Palettes - Theme Layer Support
 * 
 * Defines brand color palettes for different accent colors and modes.
 * Used by BrandThemeProvider to resolve theme.accent into concrete CSS variables.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

export interface ColorPalette {
  /** Primary brand color */
  brand: string;
  /** Brand color on hover/focus */
  brandHover: string;
  /** Text color that contrasts with brand */
  brandContrast: string;
  /** Secondary accent color */
  accent: string;
  /** Neutral color for less important elements */
  neutral: string;
}

export interface ThemePalette {
  light: ColorPalette;
  dark: ColorPalette;
}

/**
 * Pre-defined brand color palettes
 * Each palette works in both light and dark modes
 */
export const BRAND_PALETTES: Record<string, ThemePalette> = {
  blue: {
    light: {
      brand: '#2563eb',
      brandHover: '#1d4ed8',
      brandContrast: '#ffffff',
      accent: '#3b82f6',
      neutral: '#6b7280',
    },
    dark: {
      brand: '#3b82f6',
      brandHover: '#60a5fa',
      brandContrast: '#ffffff',
      accent: '#2563eb',
      neutral: '#9ca3af',
    },
  },
  
  green: {
    light: {
      brand: '#059669',
      brandHover: '#047857',
      brandContrast: '#ffffff',
      accent: '#10b981',
      neutral: '#6b7280',
    },
    dark: {
      brand: '#10b981',
      brandHover: '#34d399',
      brandContrast: '#ffffff',
      accent: '#059669',
      neutral: '#9ca3af',
    },
  },
  
  purple: {
    light: {
      brand: '#7c3aed',
      brandHover: '#6d28d9',
      brandContrast: '#ffffff',
      accent: '#8b5cf6',
      neutral: '#6b7280',
    },
    dark: {
      brand: '#8b5cf6',
      brandHover: '#a78bfa',
      brandContrast: '#ffffff',
      accent: '#7c3aed',
      neutral: '#9ca3af',
    },
  },
  
  orange: {
    light: {
      brand: '#ea580c',
      brandHover: '#dc2626',
      brandContrast: '#ffffff',
      accent: '#f97316',
      neutral: '#6b7280',
    },
    dark: {
      brand: '#f97316',
      brandHover: '#fb923c',
      brandContrast: '#ffffff',
      accent: '#ea580c',
      neutral: '#9ca3af',
    },
  },
  
  red: {
    light: {
      brand: '#dc2626',
      brandHover: '#b91c1c',
      brandContrast: '#ffffff',
      accent: '#ef4444',
      neutral: '#6b7280',
    },
    dark: {
      brand: '#ef4444',
      brandHover: '#f87171',
      brandContrast: '#ffffff',
      accent: '#dc2626',
      neutral: '#9ca3af',
    },
  },
  
  neutral: {
    light: {
      brand: '#374151',
      brandHover: '#1f2937',
      brandContrast: '#ffffff',
      accent: '#6b7280',
      neutral: '#9ca3af',
    },
    dark: {
      brand: '#9ca3af',
      brandHover: '#d1d5db',
      brandContrast: '#000000',
      accent: '#6b7280',
      neutral: '#4b5563',
    },
  },
};

/**
 * Surface colors for light and dark modes
 */
export const SURFACE_COLORS = {
  light: {
    surface: '#ffffff',
    surfaceAlt: '#f7f7f8',
    text: '#1f2937',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    bgAlt: '#f6f7f9',
  },
  dark: {
    surface: '#0f1115',
    surfaceAlt: '#11131a',
    text: '#eaeaea',
    textMuted: '#9ca3af',
    border: '#22262e',
    bgAlt: '#1a1d24',
  },
} as const;

/**
 * Resolves an accent color string to a complete color palette
 * Supports both predefined palette names and custom hex colors
 */
export function resolveAccentPalette(
  accent: string,
  mode: 'light' | 'dark' = 'light'
): ColorPalette {
  // Check if it's a predefined palette
  if (accent in BRAND_PALETTES) {
    return BRAND_PALETTES[accent][mode];
  }
  
  // Handle custom hex colors
  if (accent.startsWith('#') && isValidHexColor(accent)) {
    return generateCustomPalette(accent, mode);
  }
  
  // Fallback to blue palette
  console.warn(`[SB] Unknown accent color "${accent}", falling back to blue`);
  return BRAND_PALETTES.blue[mode];
}

/**
 * Generates a custom palette from a hex color
 */
function generateCustomPalette(hexColor: string, mode: 'light' | 'dark'): ColorPalette {
  const brandColor = hexColor;
  const brandHover = adjustColorLightness(hexColor, mode === 'light' ? -0.1 : 0.1);
  const accent = adjustColorLightness(hexColor, mode === 'light' ? 0.1 : -0.1);
  
  return {
    brand: brandColor,
    brandHover: brandHover,
    brandContrast: getContrastColor(brandColor),
    accent: accent,
    neutral: mode === 'light' ? '#6b7280' : '#9ca3af',
  };
}

/**
 * Validates if a string is a valid hex color
 */
function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Adjusts the lightness of a hex color
 */
function adjustColorLightness(hex: string, amount: number): string {
  // Convert hex to RGB
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  // Adjust lightness
  const adjusted = {
    r: Math.max(0, Math.min(255, rgb.r + (rgb.r * amount))),
    g: Math.max(0, Math.min(255, rgb.g + (rgb.g * amount))),
    b: Math.max(0, Math.min(255, rgb.b + (rgb.b * amount))),
  };
  
  // Convert back to hex
  return rgbToHex(adjusted.r, adjusted.g, adjusted.b);
}

/**
 * Gets appropriate contrast color (black or white) for a background
 */
function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Converts hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Converts RGB values to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
