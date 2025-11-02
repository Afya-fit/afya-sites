/**
 * Character limits for text fields
 */
export const CHARACTER_LIMITS = {
  HERO_TITLE: 80,
  HERO_SUBTITLE: 160,
  CONTENT_TITLE: 100,
  CONTENT_BODY: 600,
} as const;

/**
 * Typography Override Configuration
 * 
 * Allows sections to override global typography settings for specific styling needs.
 * This enables fine-grained control while maintaining global consistency.
 * 
 * @since Theme v1.1 - Display/Text hierarchy system
 */
export interface TypographyOverride {
  /** Override display scaling for this section's titles/headings */
  displayScale?: 'compact' | 'standard' | 'expressive' | 'dramatic';
  
  /** Override text scaling for this section's body text */
  textScale?: 'compact' | 'standard' | 'comfortable';
  
  /** Override font preset for this section */
  fontPreset?: 'modern' | 'classic' | 'minimal' | 'energetic' | 'friendly' | 'system';
  
  /** Disable adaptive title scaling for this section */
  disableAdaptiveTitles?: boolean;
  
  /** Custom font size multipliers for specific elements */
  customScaling?: {
    title?: number;     // Multiplier for section title (e.g., 1.2 = 20% larger)
    subtitle?: number;  // Multiplier for section subtitle
    body?: number;      // Multiplier for section body text
  };
}

export type HeroSection = {
  id: string;
  type: 'hero';
  /** Optional human-readable anchor id used for in-page links (must be unique) */
  slug?: string;
  title?: string; // Max: 80 characters (CHARACTER_LIMITS.HERO_TITLE)
  subtitle?: string; // Max: 160 characters (CHARACTER_LIMITS.HERO_SUBTITLE)
  backgroundImageUrl?: string;
  /** Background image sizing behavior */
  backgroundSize?: 'cover' | 'contain';
  backgroundFocal?: {
    desktop?: { xPct: number; yPct: number };
    mobile?: { xPct: number; yPct: number };
  };
  
  // Enhanced image overlay system
  imageOverlay?: {
    type?: 'none' | 'dark' | 'light' | 'gradient' | 'blur' | 'brand';
    intensity?: 'light' | 'medium' | 'heavy';
    gradientDirection?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  };
  
  contentImageUrl?: string;
  contentImageAlt?: string;
  contentImageRatio?: '1x1'|'4x3'|'16x9'|'3x4'|'21x9'|'5x3';
  contentImageFit?: 'cover'|'contain';
  contentImageSize?: 'XS'|'S'|'M'|'L';
  /** Layout for arranging media vs text similar to ContentBlock */
  layout?: 'media_left' | 'media_right' | 'media_top' | 'media_bottom' | 'text_only';
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'center' | 'bottom';
  brandEmphasis?: boolean;
  textColorMode?: 'neutral' | 'brand' | 'auto';
  
  /** Section-level typography overrides for fine-grained control */
  typographyOverride?: TypographyOverride;
};

export type MediaItem = {
  url: string;
  alt: string;
  ratio?: '1x1' | '4x3' | '16x9' | '3x4' | '21x9' | '5x3'; // MediaFrame compatible ratios
  fit?: 'cover' | 'contain'; // MediaFrame compatible fits
  // Text overlay for media items in ContentBlock
  textOverlay?: {
    text: string;
    overlay?: {
      type?: 'none' | 'dark' | 'light' | 'gradient' | 'brand';
      intensity?: 'light' | 'medium' | 'heavy';
    };
  };
};

export type ContentBlockSection = {
  id: string;
  type: 'content_block';
  /** Optional human-readable anchor id used for in-page links (must be unique) */
  slug?: string;
  title?: string; // Max: 100 characters (CHARACTER_LIMITS.CONTENT_TITLE)
  body?: string; // Max: 600 characters (CHARACTER_LIMITS.CONTENT_BODY)
  layout?: 'media_left' | 'media_right' | 'media_top' | 'text_only';
  background?: 'surface' | 'alt' | 'inverse';
  brandEmphasis?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  media?: MediaItem[]; // 0–3 items
  figureSize?: 'S'|'M'|'L';
  
  /** Section-level typography overrides for fine-grained control */
  typographyOverride?: TypographyOverride;
};

export type BusinessDataSection = {
  id: string;
  type: 'business_data';
  /** Optional human-readable anchor id used for in-page links (must be unique) */
  slug?: string;
  title?: string;
  fields?: string[];
  /** Optional location block (MVP) */
  location?: {
    addressLines?: string[]; // e.g., ["123 Main St", "City, ST 12345"]
    lat?: number;
    lng?: number;
    mapProvider?: 'auto' | 'google' | 'apple' | 'waze';
    showStaticMap?: boolean; // placeholder thumbnail (no external fetch)
    zoom?: number; // reserved for future map
    actions?: {
      showCall?: boolean;
      showDirections?: boolean;
      showCopyAddress?: boolean;
    };
    phone?: string;
  };
  
  /** Section-level typography overrides for fine-grained control */
  typographyOverride?: TypographyOverride;
};

export type SpecialOffer = {
  id: string;
  title: string;
  description?: string;
  price?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type SpecialOffersSection = {
  id: string;
  type: 'special_offers';
  /** Optional human-readable anchor id used for in-page links (must be unique) */
  slug?: string;
  title?: string;
  offers: SpecialOffer[];
  
  /** Section-level typography overrides for fine-grained control */
  typographyOverride?: TypographyOverride;
};

export type LinkItem = {
  id: string;
  label: string;
  href: string;
  iconName?: string; // optional per-link icon override
};

export type LinksPageSection = {
  id: string;
  type: 'links_page';
  /** Optional human-readable anchor id used for in-page links (must be unique) */
  slug?: string;
  title?: string;
  links: LinkItem[];
  // Simple layout and style configs
  variant?: 'pill' | 'list';
  align?: 'center' | 'left';
  size?: 'sm' | 'md' | 'lg';
  columnsDesktop?: 'auto' | 'two';
  emphasizeFirst?: boolean;
  colorMode?: 'neutral' | 'brand';
  hoverStyle?: 'tint' | 'underline';
  truncateLines?: 1 | 2;
  showIcon?: boolean;
  iconPosition?: 'left' | 'top';
  
  /** Section-level typography overrides for fine-grained control */
  typographyOverride?: TypographyOverride;
};

export type ScheduleSection = {
  id: string;
  type: 'schedule';
  /** Optional human-readable anchor id used for in-page links (must be unique) */
  slug?: string;
  title?: string;
  windowDays?: number; // default 7
  viewMode?: 'stacked' | 'single_day'; // default 'stacked'
  
  /** Section-level typography overrides for fine-grained control */
  typographyOverride?: TypographyOverride;
};

export type SectionUnion =
  | HeroSection
  | ContentBlockSection
  | BusinessDataSection
  | SpecialOffersSection
  | LinksPageSection
  | ScheduleSection;

/**
 * Site Theme Configuration
 * 
 * Enhanced with Display/Text typography hierarchy for professional control over visual hierarchy.
 * Theme versioning enables independent evolution of styling without breaking existing sites.
 * See docs/THEME_VERSIONING.md for complete documentation.
 * 
 * @version 1.1 - Enhanced Display/Text typography hierarchy system
 */
export type SiteTheme = {
  /** Theme version for compatibility and migration. Defaults to '1.1' */
  theme_version?: string; // '1.1' - Enhanced Display/Text typography hierarchy system
  
  /** Overall color scheme - affects all color tokens */
  mode?: 'light' | 'dark';
  
  /** Primary brand color palette - controls CTAs, accents, and brand elements */
  accent?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'neutral' | string; // expanded palette
  
  /** Enhanced Typography configuration with Display/Text hierarchy */
  typography?: {
    /** Font family combinations for headings and body text */
    preset?: 'modern' | 'classic' | 'minimal' | 'energetic' | 'friendly' | 'system';
    
    /** Display typography scaling - for titles, headings, hero text (attention-grabbing) */
    displayScale?: 'compact' | 'standard' | 'expressive' | 'dramatic';
    
    /** Text typography scaling - for body text, descriptions, UI elements (reading-optimized) */
    textScale?: 'compact' | 'standard' | 'comfortable';
    
    /** Enable dynamic title scaling based on content length for better readability */
    adaptiveTitles?: boolean; // Default: true
    
    /** @deprecated Legacy size scale - use displayScale/textScale instead */
    sizeScale?: 'standard' | 'large';
  };
  
  // businessType removed - will be used as AI input variable instead
};

export type SiteConfig = {
  version: string;
  business_id: string;
  theme?: SiteTheme;
  sections: SectionUnion[];
  meta?: Record<string, unknown>;
};

export type PublicSitePayload = {
  site_config: SiteConfig;
  platform_data?: Record<string, unknown>;
};


