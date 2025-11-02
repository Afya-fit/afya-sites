/**
 * BusinessData Section Component - One-Path Styling Framework
 * 
 * Minimal implementation that displays business information from platform data.
 * Refactored to use SectionBox + CSS modules instead of inline styles.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React from 'react';
import type { BusinessDataSection } from '../../../types';
import { SectionBox } from '../../SectionBox';
import { varsForBusinessData } from '../../../utils/mapSectionVars';
import { TextWithLineBreaks } from '../../../utils/textRendering';
import Icon from '../../../utils/Icon';

export interface BusinessDataProps {
  section: BusinessDataSection;
  data?: any; // Platform data containing business info, programs, products, etc.
}

/**
 * Business Info Item Component
 */
function BusinessInfoItem({ 
  label, 
  value 
}: { 
  label: string; 
  value: string | null | undefined; 
}) {
  if (!value || value === '-') {
    return null; // Don't render empty values
  }

  return (
    <li className="sb-business-data-info-item">
      <span className="sb-business-data-info-label">{label}:</span>
      <span className="sb-business-data-info-value">{value}</span>
    </li>
  );
}

/**
 * Data List Component (for programs, products, etc.)
 */
function DataList({ 
  title, 
  items, 
  maxItems = 6 
}: { 
  title: string; 
  items: any[]; 
  maxItems?: number; 
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="sb-business-data-section-item">
      <h3 className="sb-business-data-section-title">{title}</h3>
      <ul className="sb-business-data-list">
        {items.slice(0, maxItems).map((item, index) => (
          <li key={item.id || index} className="sb-business-data-list-item">
            {item.name || item.title || `${title.slice(0, -1)} ${index + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * BusinessData Component
 */
export function BusinessData({ section, data }: BusinessDataProps) {
  const { title, fields = ['business_info'] } = section;

  // Extract platform data
  const info = data?.platform_data?.business_info || {};
  const programs = data?.platform_data?.programs || [];
  const products = data?.platform_data?.products || [];
  const schedule = data?.platform_data?.schedule || [];

  // Generate section variables using the mapper
  const sectionVars = varsForBusinessData(section);

  // Check if we have any data to display
  const hasBusinessInfo = fields.includes('business_info') && Object.keys(info).length > 0;
  const hasPrograms = fields.includes('programs') && programs.length > 0;
  const hasProducts = fields.includes('products') && products.length > 0;
  const hasSchedule = fields.includes('schedule') && schedule.length > 0;
  const hasLocation = (section as any).location && fields.includes('location');
  const hasAnyData = hasBusinessInfo || hasPrograms || hasProducts || hasSchedule || hasLocation;

  return (
    <SectionBox
      id={section.id}
      slug={(section as any).slug}
      type="business_data"
      vars={sectionVars}
      className="sb-business-data-section"
      aria-label={title ? `Business Data: ${title}` : 'Business information'}
    >
      <div className="sb-business-data-container">
        {/* Section Title */}
        {title && (
          <TextWithLineBreaks
            as="h2"
            className="sb-business-data-title"
          >
            {title}
          </TextWithLineBreaks>
        )}

        {/* Content Grid */}
        {hasAnyData ? (
          <div className="sb-business-data-content-grid">
            {/* Business Information */}
            {hasBusinessInfo && (
              <div className="sb-business-data-info">
                <h3 className="sb-business-data-info-title">Business Information</h3>
                <ul className="sb-business-data-info-list">
                  <BusinessInfoItem label="Name" value={info.name} />
                  <BusinessInfoItem label="Phone" value={info.phone} />
                  <BusinessInfoItem label="Email" value={info.email} />
                  <BusinessInfoItem label="Address" value={info.address} />
                  <BusinessInfoItem label="Timezone" value={info.timezone} />
                  <BusinessInfoItem label="Website" value={info.website} />
                  <BusinessInfoItem label="Description" value={info.description} />
                </ul>
              </div>
            )}

            {/* Programs */}
            {hasPrograms && (
              <DataList title="Programs" items={programs} />
            )}

            {/* Products */}
            {hasProducts && (
              <DataList title="Products" items={products} />
            )}

            {/* Schedule Summary */}
            {hasSchedule && (
              <DataList title="Schedule" items={schedule} maxItems={3} />
            )}

            {/* Location (MVP) */}
            {fields.includes('location') && section.location && (
              <div className="sb-business-data-info">
                <h3 className="sb-business-data-info-title">Location</h3>
                <ul className="sb-business-data-info-list">
                  {Array.isArray(section.location.addressLines) && section.location.addressLines.length > 0 && (
                    <li className="sb-business-data-info-item">
                      <span className="sb-business-data-info-label">Address:</span>
                      <span className="sb-business-data-info-value">
                        {section.location.addressLines.map((l, i) => (
                          <React.Fragment key={i}>{l}{i < section.location!.addressLines!.length - 1 ? <br/> : null}</React.Fragment>
                        ))}
                      </span>
                    </li>
                  )}
                </ul>
                <div className="sb-business-actions" style={{ marginTop: 8 }}>
                  {section.location.actions?.showDirections !== false && (
                    <a
                      href={buildDirectionsUrl(section)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sb-business-action"
                    >
                      <span className="sb-business-action-icon" aria-hidden><Icon name="directions" /></span>
                      <span>Directions</span>
                    </a>
                  )}
                  {section.location.actions?.showCall && section.location.phone && (
                    <a href={`tel:${section.location.phone}`} className="sb-business-action">
                      <span className="sb-business-action-icon" aria-hidden><Icon name="phone" /></span>
                      <span>Call</span>
                    </a>
                  )}
                  {section.location.actions?.showCopyAddress && Array.isArray(section.location.addressLines) && (
                    <button type="button" className="sb-business-action" onClick={() => copyAddress(section.location!.addressLines!)}>
                      <span className="sb-business-action-icon" aria-hidden><Icon name="copy" /></span>
                      <span>Copy Address</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="sb-business-data-empty-state">
            <p>No business data available to display.</p>
          </div>
        )}
      </div>
    </SectionBox>
  );
}

// Mark as using the new framework
export const usesFramework = true;

export default BusinessData;

function buildDirectionsUrl(section: BusinessDataSection): string {
  const provider = section.location?.mapProvider || 'auto'
  const q = Array.isArray(section.location?.addressLines) ? encodeURIComponent(section.location!.addressLines!.join(', ')) : ''
  const lat = section.location?.lat
  const lng = section.location?.lng
  const hasGeo = typeof lat === 'number' && typeof lng === 'number'
  const platformIsIOS = typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const resolved = provider === 'auto' ? (platformIsIOS ? 'apple' : 'google') : provider
  if (resolved === 'apple') {
    if (hasGeo) return `https://maps.apple.com/?ll=${lat},${lng}`
    return `https://maps.apple.com/?q=${q}`
  }
  if (resolved === 'waze') {
    if (hasGeo) return `https://www.waze.com/ul?ll=${lat}%2C${lng}&navigate=yes`
    return `https://www.waze.com/ul?q=${q}&navigate=yes`
  }
  // default google
  if (hasGeo) return `https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

async function copyAddress(lines: string[]) {
  // Skip during SSR - no navigator/clipboard exists
  if (typeof navigator === 'undefined' || !navigator.clipboard) return;
  
  try {
    await navigator.clipboard.writeText(lines.join('\n'))
  } catch {}
}
