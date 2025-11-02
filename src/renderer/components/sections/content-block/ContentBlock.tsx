/**
 * ContentBlock Section Component - One-Path Styling Framework
 * 
 * Refactored to use SectionBox + CSS modules instead of inline styles.
 * All styling controlled via CSS custom properties.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React from 'react';
import type { ContentBlockSection, MediaItem } from '../../../types';
import { SectionBox } from '../../SectionBox';
import { varsForContentBlock } from '../../../utils/mapSectionVars';
import MediaFrame from '../../../utils/MediaFrame';
import { TextWithLineBreaks } from '../../../utils/textRendering';
import { generateOverlayCSS, getRecommendedTextColor } from '../../../utils/imageOverlays';

export interface ContentBlockProps {
  section: ContentBlockSection;
}

/**
 * Single Media Item Component
 */
function SingleMediaItem({ media, className }: { media: MediaItem; className?: string }) {
  const hasTextOverlay = media.textOverlay?.text;
  const overlayConfig = media.textOverlay?.overlay || { type: 'dark', intensity: 'medium' };
  const overlayStyles = hasTextOverlay ? generateOverlayCSS(overlayConfig) : {};
  const textColor = hasTextOverlay ? getRecommendedTextColor(overlayConfig) : '#ffffff';

  if (!hasTextOverlay) {
    return (
      <figure className={`sb-content-block-media-figure ${className || ''}`}>
        <MediaFrame 
          src={media.url} 
          alt={media.alt} 
          ratio={media.ratio || '4x3'} 
          fit={media.fit || 'contain'} 
        />
      </figure>
    );
  }

  return (
    <figure className={`sb-content-block-media-figure sb-content-block-media-with-overlay ${className || ''}`}>
      <MediaFrame 
        src={media.url} 
        alt={media.alt} 
        ratio={media.ratio || '4x3'} 
        fit={media.fit || 'contain'} 
      />
      <div 
        className="sb-content-block-media-overlay"
        style={{
          '--sb-media-overlay': overlayStyles.background || 'rgba(0,0,0,0.5)',
          '--sb-overlay-text-color': textColor,
        } as React.CSSProperties}
      >
        <TextWithLineBreaks as="p" className="sb-content-block-overlay-text">
          {media.textOverlay!.text}
        </TextWithLineBreaks>
      </div>
    </figure>
  );
}

/**
 * Media Container Component
 */
function MediaContainer({ media }: { media: MediaItem[] }) {
  if (media.length === 0) return null;
  
  if (media.length === 1) {
    return (
      <div className="sb-content-block-single-media">
        <SingleMediaItem media={media[0]} />
      </div>
    );
  }

  // Multi-media grid (2-3 items)
  const mediaCount = Math.min(media.length, 3);
  
  return (
    <div className="sb-content-block-media-grid" data-count={mediaCount}>
      {media.slice(0, 3).map((item, index) => (
        <SingleMediaItem key={index} media={item} />
      ))}
    </div>
  );
}

/**
 * ContentBlock Component
 */
export function ContentBlock({ section }: ContentBlockProps) {
  const { 
    title, 
    body, 
    media = [], 
    layout = 'media_top', 
    textAlign = 'left', 
    background = 'surface', 
    brandEmphasis,
    figureSize
  } = section;

  // Generate section variables using the mapper
  const sectionVars = varsForContentBlock(section);

  // Check if media should be displayed
  const hasMedia = media.length > 0 && layout !== 'text_only';

  return (
    <SectionBox
      id={section.id}
      slug={section.slug}
      type="content_block"
      vars={sectionVars}
      className="sb-content-block"
      data-background={background}
      aria-label={title ? `Content: ${title}` : 'Content section'}
    >
      <div className="sb-content-block-container">
        <div className="sb-content-block-layout" data-layout={layout}>
          {/* Media Container */}
          {hasMedia && (
            <div className="sb-content-block-media">
              <MediaContainer media={media} />
            </div>
          )}

          {/* Text Container */}
          {(title || body) && (
            <div className="sb-content-block-text-container">
              <div className="sb-content-block-text" data-align={textAlign}>
                {title && (
                  <TextWithLineBreaks
                    as="h2"
                    className="sb-content-block-title"
                    data-brand-emphasis={brandEmphasis}
                  >
                    {title}
                  </TextWithLineBreaks>
                )}

                {body && (
                  <TextWithLineBreaks
                    as="div"
                    className="sb-content-block-body"
                  >
                    {body}
                  </TextWithLineBreaks>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionBox>
  );
}

// Mark as using the new framework
export const usesFramework = true;

export default ContentBlock;
