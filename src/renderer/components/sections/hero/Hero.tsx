/**
 * Hero Section Component
 * 
 * Displays a prominent hero section with title, subtitle, and background image.
 * Uses the One-Path Styling Framework for consistent theming.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React from 'react';
import type { HeroSection } from '../../../types';
import { SectionBox } from '../../SectionBox';
import { varsForHero } from '../../../utils/mapSectionVars';
import MediaFrame from '../../../utils/MediaFrame';
import { TextWithLineBreaks } from '../../../utils/textRendering';


export interface HeroProps {
  section: HeroSection;
}

export function Hero({ section }: HeroProps) {

  const {
    title = '',
    subtitle = '',
    align = 'center',
    valign = 'center',
    layout = 'media_top',
    backgroundImageUrl,
    backgroundSize,
    backgroundFocal,
    contentImageUrl,
    contentImageFit,
    contentImageSize,
    contentImageRatio,
  } = section;

  // Convert size to pixel height for MediaFrame
  const getSizeHeight = (size: string | undefined): number | undefined => {
    switch (size) {
      case 'XS': return 100;
      case 'S': return 150;
      case 'M': return 200;
      case 'L': return 300;
      case 'XL': return 400;
      default: return undefined;
    }
  };

  // Generate section-specific CSS variables
  const allVars = {
    ...varsForHero(section),
    // Add background image as CSS variable
    ...(backgroundImageUrl && { 
      '--sb-hero-bg-image': `url(${backgroundImageUrl})`,
      '--sb-hero-bg-size': backgroundSize || 'cover'
    }),
    // Add background focal point positioning
    ...(backgroundFocal && {
      '--sb-hero-bg-position': `${backgroundFocal.desktop?.xPct || 50}% ${backgroundFocal.desktop?.yPct || 50}%`,
      '--sb-hero-bg-position-mobile': `${backgroundFocal.mobile?.xPct || 50}% ${backgroundFocal.mobile?.yPct || 50}%`
    })
  };



  const ContentImage = contentImageUrl ? (
    <div className="sb-hero-content-image">
      <MediaFrame
        className="sb-hero-content-image-frame"
        src={contentImageUrl}
        fit={contentImageFit}
        ratio={contentImageRatio}
        heightPx={getSizeHeight(contentImageSize)}
        alt={subtitle || 'Hero content image'}
      />
    </div>
  ) : null;

  const TextBlock = (
    <div className="sb-hero-text-content">
      {title && (
        <TextWithLineBreaks as="h1" className="sb-hero-title">
          {title}
        </TextWithLineBreaks>
      )}
      {subtitle && (
        <TextWithLineBreaks as="p" className="sb-hero-subtitle">
          {subtitle}
        </TextWithLineBreaks>
      )}
    </div>
  );

  let contentOrder: React.ReactNode[] = [];
  switch (layout) {
    case 'media_left':
      contentOrder = [ContentImage, TextBlock];
      break;
    case 'media_right':
      contentOrder = [TextBlock, ContentImage];
      break;
    case 'media_bottom':
      contentOrder = [TextBlock, ContentImage];
      break;
    case 'text_only':
      contentOrder = [TextBlock];
      break;
    case 'media_top':
    default:
      contentOrder = [ContentImage, TextBlock];
      break;
  }

  return (
    <SectionBox
      id={section.id}
      slug={section.slug}
      type="hero"
      vars={allVars}
      className="sb-hero-section"
      data-align={align}
      data-valign={valign}
      data-layout={layout}
      aria-label={title ? `Hero: ${title}` : 'Hero section'}
      data-has-overlay={(section.imageOverlay && section.imageOverlay.type && section.imageOverlay.type !== 'none') ? 'true' : undefined}
      data-text-mode={section.textColorMode}
    >

      {/* Content Container */}
      <div className="sb-hero-content-container" data-align={align}>
        {contentOrder.map((node, idx) => (
          <React.Fragment key={idx}>{node}</React.Fragment>
        ))}
      </div>
    </SectionBox>
  );
}

// Mark as using the new framework
export const usesFramework = true;

export default Hero;