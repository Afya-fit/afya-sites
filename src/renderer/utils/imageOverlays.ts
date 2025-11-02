/**
 * Image Overlay Utilities
 * 
 * Generates CSS for various image overlay effects to improve text readability
 * and visual appeal. Inspired by modern web design practices.
 */

export interface OverlayConfig {
  type?: 'none' | 'dark' | 'light' | 'gradient' | 'blur' | 'brand';
  intensity?: 'light' | 'medium' | 'heavy';
  gradientDirection?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface OverlayResult {
  background?: string;
  backdropFilter?: string;
  opacity?: number;
  mixBlendMode?: 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | 'normal';
}

/**
 * Intensity mappings for different overlay types
 */
const INTENSITY_VALUES = {
  dark: {
    light: 0.2,
    medium: 0.4,
    heavy: 0.6
  },
  light: {
    light: 0.15,
    medium: 0.3,
    heavy: 0.5
  },
  brand: {
    light: 0.2,
    medium: 0.35,
    heavy: 0.5
  },
  blur: {
    light: 2,
    medium: 4,
    heavy: 8
  }
} as const;

/**
 * Generate CSS properties for image overlays
 */
export function generateOverlayCSS(config: OverlayConfig, brandColor: string = '#3b82f6'): OverlayResult {
  const { type = 'none', intensity = 'medium', gradientDirection = 'center' } = config;
  
  switch (type) {
    case 'none':
      return {};
      
    case 'dark':
      return {
        background: `rgba(0, 0, 0, ${INTENSITY_VALUES.dark[intensity]})`
      };
      
    case 'light':
      return {
        background: `rgba(255, 255, 255, ${INTENSITY_VALUES.light[intensity]})`
      };
      
    case 'gradient':
      return {
        background: generateGradientOverlay(intensity, gradientDirection)
      };
      
    case 'blur':
      return {
        backdropFilter: `blur(${INTENSITY_VALUES.blur[intensity]}px)`,
        background: `rgba(255, 255, 255, ${intensity === 'light' ? 0.1 : intensity === 'medium' ? 0.2 : 0.3})`
      };
      
    case 'brand':
      const brandAlpha = INTENSITY_VALUES.brand[intensity];
      // Convert hex to rgba
      const hex = brandColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      return {
        background: `rgba(${r}, ${g}, ${b}, ${brandAlpha})`,
        mixBlendMode: 'multiply'
      };
      
    default:
      return {};
  }
}

/**
 * Generate gradient overlay based on direction
 */
function generateGradientOverlay(intensity: 'light' | 'medium' | 'heavy', direction: string): string {
  const alpha = intensity === 'light' ? 0.3 : intensity === 'medium' ? 0.5 : 0.7;
  
  switch (direction) {
    case 'top':
      return `linear-gradient(180deg, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,0) 60%)`;
    case 'bottom':
      return `linear-gradient(0deg, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,0) 60%)`;
    case 'left':
      return `linear-gradient(90deg, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,0) 60%)`;
    case 'right':
      return `linear-gradient(270deg, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,0) 60%)`;
    case 'center':
    default:
      return `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,${alpha}) 100%)`;
  }
}

/**
 * Get recommended text color based on overlay type
 */
export function getRecommendedTextColor(config: OverlayConfig): string {
  const { type = 'none', intensity = 'medium' } = config;
  
  switch (type) {
    case 'dark':
    case 'gradient':
      return '#ffffff';
    case 'light':
      return intensity === 'heavy' ? '#111111' : '#333333';
    case 'blur':
      return '#333333';
    case 'brand':
      return '#ffffff';
    case 'none':
    default:
      return 'inherit';
  }
}

/**
 * Check if an overlay provides sufficient contrast for text readability
 */
export function hasGoodContrast(config: OverlayConfig): boolean {
  const { type = 'none', intensity = 'medium' } = config;
  
  switch (type) {
    case 'dark':
      return intensity !== 'light';
    case 'light':
      return intensity === 'heavy';
    case 'gradient':
    case 'brand':
      return intensity !== 'light';
    case 'blur':
      return true; // Blur generally helps with contrast
    case 'none':
    default:
      return false;
  }
}

/**
 * Get preset overlay configurations for quick selection
 */
export const OVERLAY_PRESETS = {
  none: {
    type: 'none' as const,
    intensity: 'medium' as const,
    label: 'No Overlay',
    description: 'Let the image show through completely'
  },
  subtle: {
    type: 'dark' as const,
    intensity: 'light' as const,
    label: 'Subtle Dark',
    description: 'Light darkening for better text readability'
  },
  classic: {
    type: 'dark' as const,
    intensity: 'medium' as const,
    label: 'Classic Dark',
    description: 'Standard dark overlay for good contrast'
  },
  dramatic: {
    type: 'dark' as const,
    intensity: 'heavy' as const,
    label: 'Dramatic Dark',
    description: 'Heavy overlay for maximum text contrast'
  },
  gradient: {
    type: 'gradient' as const,
    intensity: 'medium' as const,
    gradientDirection: 'bottom' as const,
    label: 'Bottom Gradient',
    description: 'Gradient overlay from bottom for natural shadowing'
  },
  modern: {
    type: 'blur' as const,
    intensity: 'medium' as const,
    label: 'Modern Blur',
    description: 'Frosted glass effect for contemporary look'
  },
  brand: {
    type: 'brand' as const,
    intensity: 'medium' as const,
    label: 'Brand Tint',
    description: 'Subtle brand color overlay for cohesive theming'
  }
} as const;

/**
 * Generate default overlay based on image characteristics (future enhancement)
 */
export function getRecommendedOverlay(hasText: boolean, textLength: number): OverlayConfig {
  if (!hasText) {
    return OVERLAY_PRESETS.none;
  }
  
  if (textLength > 100) {
    // Long text needs good contrast
    return OVERLAY_PRESETS.classic;
  }
  
  // Short text can work with subtle overlay
  return OVERLAY_PRESETS.subtle;
}

/**
 * CSS class names for overlay types (for potential CSS-based implementation)
 */
export const OVERLAY_CLASSES = {
  'none': '',
  'dark-light': 'overlay-dark overlay-light',
  'dark-medium': 'overlay-dark overlay-medium',
  'dark-heavy': 'overlay-dark overlay-heavy',
  'light-light': 'overlay-light overlay-light',
  'light-medium': 'overlay-light overlay-medium',
  'light-heavy': 'overlay-light overlay-heavy',
  'gradient-top': 'overlay-gradient overlay-top',
  'gradient-bottom': 'overlay-gradient overlay-bottom',
  'gradient-center': 'overlay-gradient overlay-center',
  'blur-light': 'overlay-blur overlay-light',
  'blur-medium': 'overlay-blur overlay-medium',
  'blur-heavy': 'overlay-blur overlay-heavy',
  'brand-light': 'overlay-brand overlay-light',
  'brand-medium': 'overlay-brand overlay-medium',
  'brand-heavy': 'overlay-brand overlay-heavy',
} as const;
