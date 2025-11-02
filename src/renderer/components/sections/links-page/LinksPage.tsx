/**
 * LinksPage Section Component - One-Path Styling Framework
 * 
 * Minimal implementation that displays a centered grid of links.
 * Refactored to use SectionBox + CSS modules instead of inline styles.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React from 'react';
import type { LinksPageSection, LinkItem } from '../../../types';
import { SectionBox } from '../../SectionBox';
import { varsForLinksPage } from '../../../utils/mapSectionVars';
import { TextWithLineBreaks } from '../../../utils/textRendering';
import Icon from '../../../utils/Icon';

export interface LinksPageProps {
  section: LinksPageSection;
}

/**
 * Single Link Component
 */
function guessBrandIcon(href: string): string | undefined {
  try {
    const u = new URL(href, 'https://example.com')
    const h = u.hostname || ''
    if (h.includes('instagram')) return 'instagram'
    if (h.includes('tiktok')) return 'tiktok'
    if (h.includes('facebook')) return 'facebook'
    if (h.includes('youtube')) return 'youtube'
    if (h.includes('linkedin')) return 'linkedin'
    if (h.includes('twitter') || h.includes('x.com')) return 'x'
    if (h.includes('whatsapp')) return 'whatsapp'
    if (h.includes('maps.apple')) return 'apple'
    if (h.includes('google.com/maps')) return 'google'
    if (h.includes('waze')) return 'waze'
  } catch {}
  return undefined
}

function Link({ 
  link, 
  brandEmphasis = false,
  showIcon = false,
  iconPosition = 'left'
}: { 
  link: LinkItem; 
  brandEmphasis?: boolean;
  showIcon?: boolean;
  iconPosition?: 'left'|'top';
}) {
  const href = link.href || '#';
  const isAnchor = href.startsWith('#') || href.startsWith('/#');
  const target = isAnchor ? undefined : '_blank';
  const rel = isAnchor ? undefined : 'noopener noreferrer';
  const iconName = link.iconName || (!isAnchor ? guessBrandIcon(href) : undefined)
  return (
    <a
      href={href}
      className="sb-links-page-link"
      data-brand-emphasis={brandEmphasis}
      target={target}
      rel={rel}
    >
      {showIcon && iconName && iconPosition==='left' && (
        <span className="sb-links-page-link-icon" aria-hidden>
          <Icon name={iconName} />
        </span>
      )}
      {showIcon && iconName && iconPosition==='top' && (
        <span className="sb-links-page-link-icon-top" aria-hidden>
          <Icon name={iconName} />
        </span>
      )}
      <span className="sb-links-page-link-label">{link.label}</span>
    </a>
  );
}

/**
 * LinksPage Component
 */
export function LinksPage({ section }: LinksPageProps) {
  const { title, links = [] } = section;

  // Generate section variables using the mapper
  const sectionVars = varsForLinksPage(section);

  return (
    <SectionBox
      id={section.id}
      slug={section.slug}
      type="links_page"
      vars={sectionVars}
      className="sb-links-page-section"
      aria-label={title ? `Links: ${title}` : 'Links page'}
    >
      <div
        className="sb-links-page-container"
        data-variant={section.variant || 'pill'}
        data-align={section.align || 'center'}
        data-size={section.size || 'md'}
        data-columns={section.columnsDesktop || 'auto'}
        data-emphasize-first={section.emphasizeFirst ? 'true' : undefined}
        data-color-mode={section.colorMode || 'neutral'}
        data-hover={section.hoverStyle || 'tint'}
        data-truncate={section.truncateLines || undefined}
      >
        {/* Section Title */}
        {title && (
          <TextWithLineBreaks
            as="h2"
            className="sb-links-page-title"
          >
            {title}
          </TextWithLineBreaks>
        )}

        {/* Links Grid */}
        {links.length > 0 ? (
          <div className="sb-links-page-grid" role="list">
            {links.map((link, index) => (
              <div key={link.id || index} role="listitem">
                <Link
                  link={link}
                  brandEmphasis={!!section.emphasizeFirst && index === 0}
                  showIcon={!!section.showIcon}
                  iconPosition={section.iconPosition || 'left'}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="sb-links-page-empty-state">
            <p>No links available to display.</p>
          </div>
        )}
      </div>
    </SectionBox>
  );
}

// Mark as using the new framework
export const usesFramework = true;

export default LinksPage;
