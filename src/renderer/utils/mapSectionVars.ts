/**
 * Section Variables Mapping - Props to CSS Variables
 * 
 * This module handles the conversion of section props to CSS custom properties.
 * It provides the mapping layer between component props and the styling framework.
 * 
 * CRITICAL RULES:
 * - All functions must return objects with keys starting with "--sb-"
 * - No direct property styles (fontSize, color, etc.) should be generated
 * - Unknown props should trigger warnings but not break functionality
 * - Legacy props should be mapped to new variables with deprecation warnings
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import type { 
  HeroSection, 
  ContentBlockSection, 
  BusinessDataSection,
  SpecialOffersSection,
  LinksPageSection,
  ScheduleSection,
  TypographyOverride,
  MediaItem,
} from '../types';
import { 
  applyTypographyOverride, 
  getAdaptiveTitleMultiplier,
  TYPOGRAPHY_MULTIPLIERS,
} from '../theme/typography';

/**
 * Common section variable mapping utilities
 */

/**
 * Maps image overlay configuration to CSS variables
 */
function mapImageOverlay(overlay?: {
  type?: 'none' | 'dark' | 'light' | 'gradient' | 'blur' | 'brand';
  intensity?: 'light' | 'medium' | 'heavy';
  gradientDirection?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}): Record<string, string> {
  if (!overlay || overlay.type === 'none') {
    return { '--sb-overlay': 'transparent' };
  }
  
  const intensityMap = { 
    light: 0.2, 
    medium: 0.4, 
    heavy: 0.6 
  };
  const alpha = intensityMap[overlay.intensity || 'medium'];
  
  switch (overlay.type) {
    case 'dark':
      return { '--sb-overlay': `rgba(0, 0, 0, ${alpha})` };
      
    case 'light':
      return { '--sb-overlay': `rgba(255, 255, 255, ${alpha})` };
      
    case 'gradient': {
      const direction = overlay.gradientDirection || 'bottom';
      const directionMap = {
        top: 'to top',
        bottom: 'to bottom', 
        left: 'to left',
        right: 'to right',
        center: 'radial',
      };
      
      if (direction === 'center') {
        return { '--sb-overlay': `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,${alpha}) 100%)` };
      } else {
        return { '--sb-overlay': `linear-gradient(${directionMap[direction]}, rgba(0,0,0,0), rgba(0,0,0,${alpha}))` };
      }
    }
    
    case 'blur':
      // Blur overlay using backdrop-filter (fallback to dark)
      return { '--sb-overlay': `rgba(0, 0, 0, ${alpha})` };
      
    case 'brand':
      // Brand color overlay using CSS variable
      return { '--sb-overlay': `color-mix(in srgb, var(--sb-color-brand) ${Math.round(alpha * 100)}%, transparent)` };
      
    default:
      console.warn(`[SB] Unknown overlay type "${overlay.type}", falling back to dark`);
      return { '--sb-overlay': `rgba(0, 0, 0, ${alpha})` };
  }
}

/**
 * Maps alignment props to CSS variables
 */
function mapAlignment(
  align?: 'left' | 'center' | 'right',
  valign?: 'top' | 'center' | 'bottom'
): Record<string, string> {
  const vars: Record<string, string> = {};
  
  if (align) {
    const alignMap = { 
      left: 'flex-start', 
      center: 'center', 
      right: 'flex-end' 
    };
    vars['--sb-justify-content'] = alignMap[align];
    vars['--sb-text-align'] = align;
  }
  
  if (valign) {
    const valignMap = { 
      top: 'flex-start', 
      center: 'center', 
      bottom: 'flex-end' 
    };
    vars['--sb-align-items'] = valignMap[valign];
  }
  
  return vars;
}

/**
 * Maps background configuration to CSS variables
 */
function mapBackground(background?: 'surface' | 'alt' | 'inverse'): Record<string, string> {
  switch (background) {
    case 'alt':
      return {
        '--sb-bg-color': 'var(--sb-color-surface-alt)',
        '--sb-text-color': 'var(--sb-color-text)',
      };
    case 'inverse':
      return {
        '--sb-bg-color': 'var(--sb-color-text)',
        '--sb-text-color': 'var(--sb-color-surface)',
      };
    case 'surface':
    default:
      return {
        '--sb-bg-color': 'var(--sb-color-surface)',
        '--sb-text-color': 'var(--sb-color-text)',
      };
  }
}

/**
 * Legacy prop migration with warnings
 */
function migrateLegacyProps(props: any, sectionType: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const warnings: string[] = [];
  
  // Example legacy prop migration
  if ('oldPropName' in props) {
    vars['--sb-new-property'] = String(props.oldPropName);
    warnings.push(`"oldPropName" is deprecated, use "newPropName" instead`);
  }
  
  // Log warnings for deprecated usage
  if (warnings.length > 0) {
    console.warn(`[SB] Deprecated props in ${sectionType}:`, warnings);
  }
  
  return vars;
}

/**
 * HERO SECTION MAPPING
 */
export function varsForHero(section: HeroSection): Record<string, string> {
  const vars: Record<string, string> = {};
  
  // Text alignment
  Object.assign(vars, mapAlignment(section.align, section.valign));
  
  // Background image
  if (section.backgroundImageUrl) {
    vars['--sb-hero-bg-image'] = `url("${section.backgroundImageUrl}")`;
    
    // Background focal point
    if (section.backgroundFocal?.desktop) {
      const { xPct, yPct } = section.backgroundFocal.desktop;
      vars['--sb-hero-bg-position'] = `${xPct}% ${yPct}%`;
    }
    
    // Mobile focal point
    if (section.backgroundFocal?.mobile) {
      const { xPct, yPct } = section.backgroundFocal.mobile;
      vars['--sb-hero-bg-position-mobile'] = `${xPct}% ${yPct}%`;
    }
  }
  
  // Image overlay
  if (section.imageOverlay) {
    const overlayVars = mapImageOverlay(section.imageOverlay);
    Object.keys(overlayVars).forEach(key => {
      vars[`--sb-hero-${key.replace('--sb-', '')}`] = overlayVars[key];
    });

    // Auto text color mapping when textColorMode is 'auto'
    if (section.textColorMode === 'auto') {
      const type = section.imageOverlay.type || 'dark';
      switch (type) {
        case 'light':
          vars['--sb-hero-auto-text-color'] = 'var(--sb-color-text)'; // darker text on light overlay
          break;
        case 'brand':
          vars['--sb-hero-auto-text-color'] = 'var(--sb-color-on-brand, #fff)';
          break;
        case 'gradient':
        case 'blur':
        case 'dark':
        default:
          vars['--sb-hero-auto-text-color'] = 'var(--sb-color-surface)'; // light text on dark overlay
          break;
      }
    }
  }
  
  // Content image
  if (section.contentImageUrl) {
    vars['--sb-hero-content-image'] = `url("${section.contentImageUrl}")`;
    
    if (section.contentImageRatio) {
      const ratioMap = {
        '1x1': '1 / 1',
        '4x3': '4 / 3', 
        '16x9': '16 / 9',
        '3x4': '3 / 4',
        '21x9': '21 / 9',
        '5x3': '5 / 3',
      };
      vars['--sb-hero-content-aspect'] = ratioMap[section.contentImageRatio] || '1 / 1';
    }
    
    if (section.contentImageFit) {
      vars['--sb-hero-content-fit'] = section.contentImageFit;
    }
    
    if (section.contentImageSize) {
      const sizeMap: Record<'XS'|'S'|'M'|'L', string> = { XS: '100px', S: '150px', M: '200px', L: '300px' };
      vars['--sb-hero-content-size'] = sizeMap[section.contentImageSize as 'XS'|'S'|'M'|'L'] || '200px';
    }
  }
  
  // Brand emphasis
  if (section.brandEmphasis) {
    vars['--sb-hero-title-color'] = 'var(--sb-color-brand)';
  }
  
  // Text color mode
  if (section.textColorMode) {
    switch (section.textColorMode) {
      case 'brand':
        vars['--sb-hero-text-color'] = 'var(--sb-color-brand)';
        break;
      case 'neutral':
        vars['--sb-hero-text-color'] = 'var(--sb-color-neutral)';
        break;
      case 'auto':
      default:
        // Let CSS handle auto color based on background
        break;
    }
  }
  
  // Adaptive title scaling
  if (section.title) {
    const adaptiveMultiplier = getAdaptiveTitleMultiplier(section.title, true);
    if (adaptiveMultiplier !== 1) {
      vars['--sb-hero-title-adaptive'] = String(adaptiveMultiplier);
    }
  }
  
  // Typography override
  if (section.typographyOverride) {
    applyTypographyOverride(vars, section.typographyOverride);
  }
  
  // Legacy prop migration
  Object.assign(vars, migrateLegacyProps(section, 'hero'));
  
  return vars;
}

/**
 * CONTENT BLOCK SECTION MAPPING
 */
export function varsForContentBlock(section: ContentBlockSection): Record<string, string> {
  const vars: Record<string, string> = {};
  
  // Layout
  if (section.layout) {
    vars['--sb-cb-layout'] = section.layout;
    
    // Set grid template based on layout
    switch (section.layout) {
      case 'media_left':
        vars['--sb-cb-grid'] = '1fr 1fr';
        vars['--sb-cb-media-order'] = '1';
        vars['--sb-cb-text-order'] = '2';
        break;
      case 'media_right':
        vars['--sb-cb-grid'] = '1fr 1fr';
        vars['--sb-cb-media-order'] = '2';
        vars['--sb-cb-text-order'] = '1';
        break;
      case 'media_top':
        vars['--sb-cb-grid'] = '1fr';
        vars['--sb-cb-media-order'] = '1';
        vars['--sb-cb-text-order'] = '2';
        break;
      case 'text_only':
        vars['--sb-cb-grid'] = '1fr';
        vars['--sb-cb-media-display'] = 'none';
        break;
    }
  }
  
  // Background
  Object.assign(vars, mapBackground(section.background));
  
  // Text alignment
  if (section.textAlign) {
    vars['--sb-cb-text-align'] = section.textAlign;
  }
  
  // Brand emphasis
  if (section.brandEmphasis) {
    vars['--sb-cb-title-color'] = 'var(--sb-color-brand)';
  }
  
  // Figure size
  if (section.figureSize) {
    const sizeMap = { 
      S: '300px', 
      M: '500px', 
      L: '700px' 
    };
    vars['--sb-cb-figure-max-width'] = sizeMap[section.figureSize] || '500px';
  }
  
  // Multi-image grid
  if (section.media && section.media.length > 0) {
    const mediaCount = Math.min(section.media.length, 3);
    vars['--sb-cb-media-count'] = String(mediaCount);
    
    if (mediaCount > 1) {
      vars['--sb-cb-media-grid'] = mediaCount === 2 ? '1fr 1fr' : '1fr 1fr 1fr';
      vars['--sb-cb-media-gap'] = '8px';
    }
  }
  
  // Adaptive text scaling
  if (section.title) {
    const adaptiveMultiplier = getAdaptiveTitleMultiplier(section.title, true);
    if (adaptiveMultiplier !== 1) {
      vars['--sb-cb-title-adaptive'] = String(adaptiveMultiplier);
    }
  }
  
  // Typography override
  if (section.typographyOverride) {
    applyTypographyOverride(vars, section.typographyOverride);
  }
  
  // Legacy prop migration
  Object.assign(vars, migrateLegacyProps(section, 'content_block'));
  
  return vars;
}

/**
 * BUSINESS DATA SECTION MAPPING (Stub)
 */
export function varsForBusinessData(section: BusinessDataSection): Record<string, string> {
  const vars: Record<string, string> = {};
  
  // Basic background and spacing
  Object.assign(vars, mapBackground('surface'));
  vars['--sb-bd-padding'] = 'var(--sb-space-section)';
  
  // Typography override
  if (section.typographyOverride) {
    applyTypographyOverride(vars, section.typographyOverride);
  }
  
  return vars;
}

/**
 * SPECIAL OFFERS SECTION MAPPING (Stub)
 */
export function varsForSpecialOffers(section: SpecialOffersSection): Record<string, string> {
  const vars: Record<string, string> = {};
  
  // Basic background and spacing
  Object.assign(vars, mapBackground('surface'));
  vars['--sb-so-padding'] = 'var(--sb-space-section)';
  
  // Grid layout for offers
  if (section.offers && section.offers.length > 0) {
    const offerCount = Math.min(section.offers.length, 3);
    vars['--sb-so-grid-cols'] = String(offerCount);
  }
  
  // Typography override
  if (section.typographyOverride) {
    applyTypographyOverride(vars, section.typographyOverride);
  }
  
  return vars;
}

/**
 * LINKS PAGE SECTION MAPPING (Stub)
 */
export function varsForLinksPage(section: LinksPageSection): Record<string, string> {
  const vars: Record<string, string> = {};
  
  // Basic background and spacing
  Object.assign(vars, mapBackground('surface'));
  vars['--sb-lp-padding'] = 'var(--sb-space-section)';
  vars['--sb-lp-max-width'] = '600px';

  // Layout/style configs mapped to CSS variables/data-attrs
  if (section.variant) vars['--sb-lp-variant'] = section.variant;
  if (section.align) vars['--sb-lp-align'] = section.align;
  if (section.size) vars['--sb-lp-size'] = section.size;
  if (section.columnsDesktop) vars['--sb-lp-columns'] = section.columnsDesktop;
  if (section.colorMode) vars['--sb-lp-color-mode'] = section.colorMode;
  if (section.hoverStyle) vars['--sb-lp-hover'] = section.hoverStyle;
  if (section.truncateLines) vars['--sb-lp-truncate'] = String(section.truncateLines);
  if (section.emphasizeFirst) vars['--sb-lp-emphasize-first'] = '1';
  
  // Typography override
  if (section.typographyOverride) {
    applyTypographyOverride(vars, section.typographyOverride);
  }
  
  return vars;
}

/**
 * SCHEDULE SECTION MAPPING (Stub)
 */
export function varsForSchedule(section: ScheduleSection): Record<string, string> {
  const vars: Record<string, string> = {};
  
  // Basic background and spacing
  Object.assign(vars, mapBackground('surface'));
  vars['--sb-sc-padding'] = 'var(--sb-space-section)';
  
  // View mode
  if (section.viewMode) {
    vars['--sb-sc-view-mode'] = section.viewMode;
  }
  
  // Typography override
  if (section.typographyOverride) {
    applyTypographyOverride(vars, section.typographyOverride);
  }
  
  return vars;
}

/**
 * DEVELOPMENT HELPERS
 */

/**
 * Validates section variables and logs warnings for development
 */
export function validateAndLogSectionVars(
  sectionType: string, 
  vars: Record<string, string>
): Record<string, string> {
  if (process.env.NODE_ENV === 'development') {
    const invalidVars = Object.keys(vars).filter(key => !key.startsWith('--sb-'));
    
    if (invalidVars.length > 0) {
      console.warn(
        `[SB] Invalid CSS variables in ${sectionType}:`, 
        invalidVars,
        'All variables must start with "--sb-"'
      );
    }
    
    // Log applied variables for debugging
    if (Object.keys(vars).length > 0) {
      console.debug(`[SB] Variables applied to ${sectionType}:`, vars);
    }
  }
  
  return vars;
}

/**
 * Generic section mapper that delegates to specific mappers
 */
export function mapSectionVars(section: any): Record<string, string> {
  try {
    let vars: Record<string, string> = {};
    
    switch (section.type) {
      case 'hero':
        vars = varsForHero(section as HeroSection);
        break;
      case 'content_block':
        vars = varsForContentBlock(section as ContentBlockSection);
        break;
      case 'business_data':
        vars = varsForBusinessData(section as BusinessDataSection);
        break;
      case 'special_offers':
        vars = varsForSpecialOffers(section as SpecialOffersSection);
        break;
      case 'links_page':
        vars = varsForLinksPage(section as LinksPageSection);
        break;
      case 'schedule':
        vars = varsForSchedule(section as ScheduleSection);
        break;
      default:
        console.warn(`[SB] Unknown section type "${section.type}", using default variables`);
        vars = { '--sb-padding': 'var(--sb-space-section)' };
    }
    
    return validateAndLogSectionVars(section?.type || 'unknown', vars);
    
  } catch (error) {
    console.error(`[SB] Error mapping variables for section ${section?.type || 'unknown'}:`, error);
    return { '--sb-padding': 'var(--sb-space-section)' }; // Safe fallback
  }
}
