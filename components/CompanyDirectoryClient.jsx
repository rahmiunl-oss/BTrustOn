'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import VerifiedBadge from '@/components/VerifiedBadge';

function clean(s) {
  return String(s || '').trim();
}

function getInitials(name) {
  const n = clean(name);
  if (!n) return 'B';
  const parts = n.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || 'B').toUpperCase();
}

function pill(label) {
  const v = clean(label);
  if (!v) return null;
  return <span className="pill">{v}</span>;
}

export default function CompanyDirectoryClient({ companies = [] }) {
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('');
  const [sector, setSector] = useState('');

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    return companies.filter((c) => {
      const name = (c.company_name || '').toLowerCase();
      const sec = (c.sector || '').toLowerCase();
      const typ = (c.company_type || '').toLowerCase();
      const ctry = (c.country || '').toLowerCase();
      const city = (c.city || '').toLowerCase();

      const matchesQuery = !query || [name, sec, typ, ctry, city].some((x) => x.includes(query));
      const matchesCountry = !country || clean(c.country) === country;
      const matchesSector = !sector || clean(c.sector) === sector;
      return matchesQuery && matchesCountry && matchesSector;
    });
  }, [companies, q, country, sector]);

  // Iterative filters: derive available options from CURRENT filtered set
  const { countries, sectors } = useMemo(() => {
    const setCountries = new Set();
    const setSectors = new Set();
    for (const c of filtered) {
      const cc = clean(c.country);
      const ss = clean(c.sector);
      if (cc) setCountries.add(cc);
      if (ss) setSectors.add(ss);
    }
    return {
      countries: Array.from(setCountries).sort((a, b) => a.localeCompare(b)),
      sectors: Array.from(setSectors).sort((a, b) => a.localeCompare(b)),
    };
  }, [filtered]);

  return (
    <div className="page">
      <div className="topRow">
        <div className="searchWrap">
          <input
            className="search"
            placeholder="Search company, sector, country..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="count">{filtered.length}/{companies.length}</span>
        </div>

        <div className="filters">
          <select className="select" value={sector} onChange={(e) => setSector(e.target.value)}>
            <option value="">All sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid">
        {filtered.map((c) => {
          const name = clean(c.company_name) || 'Company';
          const loc = [clean(c.city), clean(c.country)].filter(Boolean).join(', ');
          const industry = clean(c.sector) || clean(c.company_type);

          return (
            <div className="card" key={c.id}>
              <div className="cardHeader">
                <div className="mark">
                  {c.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="markImg" src={c.logo_url} alt={name} loading="lazy" />
                  ) : (
                    <span className="markText">{getInitials(name)}</span>
                  )}
                </div>

                <div className="cardTitleWrap">
                  <div className="cardTitleRow">
                    <div className="cardTitle">{name}</div>
                    <VerifiedBadge company={c} />
                  </div>
                  {clean(c.tagline) ? <div className="cardSubtitle">{c.tagline}</div> : null}
                </div>
              </div>

              <div className="pillRow">
                {industry ? pill(industry) : null}
                {loc ? pill(loc) : null}
                {clean(c.company_size) ? pill(`${c.company_size}`) : null}
                {clean(c.founded_year) ? pill(`Founded ${c.founded_year}`) : null}
              </div>

              <div className="actions">
                <Link className="btn" href={`/company/${c.slug}`}>
                  View company page
                </Link>
                <Link className="btnSecondary" href={`/app#company=${encodeURIComponent(c.id)}`}>
                  Open in app
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
