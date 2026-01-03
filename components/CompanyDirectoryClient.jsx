'use client';

import { useMemo, useState } from 'react';

function normalize(s) { return (s || '').toString().toLowerCase(); }

export default function CompanyDirectoryClient({ companies = [] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const qq = normalize(q).trim();
    if (!qq) return companies;
    return companies.filter((c) => {
      const hay = [c.company_name, c.slug, c.sector, c.company_type, c.city, c.country]
        .map(normalize).join(' | ');
      return hay.includes(qq);
    });
  }, [companies, q]);

  return (
    <>
      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Company Directory</div>
          <div className="muted" style={{ marginTop: 4 }}>SSR directory for SEO + investors. Full app remains at <b>/app</b>.</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a className="btn primary" href="/app">Open the app</a>
          <a className="btn" href="/sitemap.xml" target="_blank" rel="noreferrer">Sitemap</a>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span className="pill">🔎 Search</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Company, sector, country…"
          style={{
            flex: 1,
            minWidth: 220,
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(0,0,0,0.2)',
            color: '#EAF0FF'
          }}
        />
        <span className="muted" style={{ fontSize: 12 }}>{filtered.length}/{companies.length}</span>
      </div>

      <div style={{ height: 14 }} />

      <div className="grid cols3">
        {filtered.map((c) => (
          <div key={c.id} className="card">
            <div style={{ fontWeight: 750, fontSize: 16, lineHeight: 1.2 }}>
              {c.company_name || '—'}
          
            </div>

            <div className="muted" style={{ marginTop: 8, minHeight: 36 }}>
              {c.tagline || [c.sector, c.company_type].filter(Boolean).join(' • ') || '—'}
            </div>

            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {c.country ? <span className="pill">🌍 {c.country}</span> : null}
              {c.city ? <span className="pill">📍 {c.city}</span> : null}
              {c.sector ? <span className="pill">🏷️ {c.sector}</span> : null}
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a className="btn primary" href={`/company/${encodeURIComponent(c.slug)}`}>View company page</a>
              <a className="btn" href={`/app/#company=${encodeURIComponent(c.id)}`}>Open in app</a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
