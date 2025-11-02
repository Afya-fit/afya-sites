/**
 * SpecialOffers Section Component - One-Path Styling Framework
 * 
 * Minimal implementation that displays special offers in a responsive card grid.
 * Refactored to use SectionBox + CSS modules instead of inline styles.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React from 'react';
import type { SpecialOffersSection, SpecialOffer } from '../../../types';
import { SectionBox } from '../../SectionBox';
import { varsForSpecialOffers } from '../../../utils/mapSectionVars';
import { TextWithLineBreaks } from '../../../utils/textRendering';

export interface SpecialOffersProps {
  section: SpecialOffersSection;
}

/**
 * Single Offer Card Component
 */
function OfferCard({ offer }: { offer: SpecialOffer }) {
  const { title, description, price, ctaLabel, ctaHref } = offer;

  return (
    <article className="sb-special-offers-card">
      {/* Offer Title */}
      <h3 className="sb-special-offers-card-title">
        {title}
      </h3>

      {/* Offer Description */}
      {description && (
        <TextWithLineBreaks
          as="p"
          className="sb-special-offers-card-description"
        >
          {description}
        </TextWithLineBreaks>
      )}

      {/* Offer Price */}
      {price && (
        <p className="sb-special-offers-card-price">
          {price}
        </p>
      )}

      {/* CTA Button */}
      {ctaHref && ctaLabel && (
        <a
          href={ctaHref}
          className="sb-special-offers-cta-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          {ctaLabel}
        </a>
      )}
    </article>
  );
}

/**
 * SpecialOffers Component
 */
export function SpecialOffers({ section }: SpecialOffersProps) {
  const { title, offers = [] } = section;

  // Generate section variables using the mapper
  const sectionVars = varsForSpecialOffers(section);

  return (
    <SectionBox
      id={section.id}
      slug={(section as any).slug}
      type="special_offers"
      vars={sectionVars}
      className="sb-special-offers-section"
      aria-label={title ? `Special Offers: ${title}` : 'Special offers'}
    >
      <div className="sb-special-offers-container">
        {/* Section Title */}
        {title && (
          <TextWithLineBreaks
            as="h2"
            className="sb-special-offers-title"
          >
            {title}
          </TextWithLineBreaks>
        )}

        {/* Offers Grid */}
        {offers.length > 0 ? (
          <div className="sb-special-offers-grid">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="sb-special-offers-empty-state">
            <p>No special offers available at this time.</p>
          </div>
        )}
      </div>
    </SectionBox>
  );
}

// Mark as using the new framework
export const usesFramework = true;

export default SpecialOffers;
