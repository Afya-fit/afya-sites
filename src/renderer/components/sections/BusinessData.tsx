import React from 'react';
import type { BusinessDataSection } from '../../types';

type Props = { section: BusinessDataSection; data?: any };

export default function BusinessData({ section, data }: Props) {
  const info = data?.platform_data?.business_info || {};
  const programs = data?.platform_data?.programs || [];
  const products = data?.platform_data?.products || [];
  const schedule = data?.platform_data?.schedule || [];
  return (
    <section style={{ padding: '40px 16px', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {section.title ? <h2 style={{ marginTop: 0 }}>{section.title}</h2> : null}
        <div style={{ display: 'grid', gap: 16 }}>
          {(section.fields?.includes('business_info') ?? true) && (
            <ul style={{ paddingLeft: 16 }}>
              <li><strong>Name:</strong> {info.name || '-'}</li>
              <li><strong>Phone:</strong> {info.phone || '-'}</li>
              <li><strong>Email:</strong> {info.email || '-'}</li>
              <li><strong>Address:</strong> {info.address || '-'}</li>
              <li><strong>Timezone:</strong> {info.timezone || '-'}</li>
            </ul>
          )}
          {(section.fields?.includes('programs')) && programs.length > 0 && (
            <div>
              <strong>Programs</strong>
              <ul style={{ paddingLeft: 16 }}>
                {programs.slice(0, 6).map((p: any, i: number) => (
                  <li key={i}>{p.name || p.title || 'Program'}</li>
                ))}
              </ul>
            </div>
          )}
          {(section.fields?.includes('products')) && products.length > 0 && (
            <div>
              <strong>Products</strong>
              <ul style={{ paddingLeft: 16 }}>
                {products.slice(0, 6).map((p: any, i: number) => (
                  <li key={i}>{p.name || p.title || 'Product'}</li>
                ))}
              </ul>
            </div>
          )}
          {(section.fields?.includes('schedule')) && (
            <div>
              <strong>Schedule (next)</strong>
              {schedule.length > 0 ? (
                <ul style={{ paddingLeft: 16 }}>
                  {schedule.slice(0, 5).map((s: any, i: number) => {
                    const d = s.starts_at ? new Date(s.starts_at) : null
                    const day = d ? d.toLocaleDateString(undefined, { weekday: 'short' }) : '-'
                    const date = d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'
                    const time = d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '-'
                    return (
                      <li key={i}>
                        <strong>{s.title || 'Class'}</strong> — {day}, {date} at {time}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div style={{ opacity: .7 }}>No upcoming sessions.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


