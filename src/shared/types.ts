export type HeroSection = {
  type: 'hero';
  title?: string;
  subtitle?: string;
  backgroundImageUrl?: string;
  backgroundFocal?: {
    desktop?: { xPct: number; yPct: number };
    mobile?: { xPct: number; yPct: number };
  };
  contentImageUrl?: string;
  contentImageAlt?: string;
  contentImageRatio?: '1x1'|'4x3'|'16x9'|'3x4'|'21x9'|'5x3';
  contentImageFit?: 'cover'|'contain';
  contentImageSize?: 'S'|'M'|'L';
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'center' | 'bottom';
  brandEmphasis?: boolean;
};

export type MediaItem = {
  url: string;
  alt: string;
};

export type ContentBlockSection = {
  type: 'content_block';
  title?: string;
  body?: string;
  layout?: 'media_left' | 'media_right' | 'media_top' | 'text_only';
  background?: 'surface' | 'alt' | 'inverse';
  brandEmphasis?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  media?: MediaItem[]; // 0–3 items
  figureSize?: 'S'|'M'|'L';
};

export type BusinessDataSection = {
  type: 'business_data';
  title?: string;
  fields?: string[];
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
  type: 'special_offers';
  title?: string;
  offers: SpecialOffer[];
};

export type LinkItem = {
  id: string;
  label: string;
  href: string;
};

export type LinksPageSection = {
  type: 'links_page';
  title?: string;
  links: LinkItem[];
};

export type ScheduleSection = {
  type: 'schedule';
  title?: string;
  windowDays?: number; // default 7
  viewMode?: 'stacked' | 'single_day'; // default 'stacked'
};

export type SectionUnion =
  | HeroSection
  | ContentBlockSection
  | BusinessDataSection
  | SpecialOffersSection
  | LinksPageSection
  | ScheduleSection;

export type SiteTheme = {
  mode?: 'light' | 'dark';
  accent?: 'clean' | 'brand' | string;
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


