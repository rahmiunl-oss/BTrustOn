import { notFound } from 'next/navigation';
import { getCompanyBySlug } from '@/lib/data';

export const revalidate = 3600;

function cleanText(s, max = 160) {
  const t = (s || '').toString().replace(/\s+/g, ' ').trim();
  if (!t) return '';
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

export async function generateMetadata({ params }) {
  const company = await getCompanyBySlug(params.slug);
  if (!company) return { title: 'Company not found — BTrustOn' };

  const title = `BTrustOn — ${company.company_name || company.slug}`;
  const description =
    cleanText(company.tagline, 160) ||
    cleanText(company.description, 160) ||
    `Company profile for ${company.company_name || company.slug} on BTrustOn.`;

  const siteUrl = process.env.SITE_URL || '';
  const url = siteUrl ? `${siteUrl.replace(/\/$/, '')}/company/${company.slug}` : undefined;

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: { title, description, type: 'website', url },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CompanyPage({ params }) {
  const company = await getCompanyBySlug(params.slug);
  if (!company) notFound();

  const siteUrl = process.env.SITE_URL || '';
  const canonical = siteUrl ? `${siteUrl.replace(/\/$/, '')}/company/${company.slug}` : '';

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.company_name || company.slug,
    url: company.website || canonical || undefined,
    description: company.tagline || company.description || undefined,
    address: company.country || company.city || company.address ? {
      '@type': 'PostalAddress',
      addressCountry: company.country || undefined,
      addressLocality: company.city || undefined,
      streetAddress: company.address || undefined,
    } : undefined,
  };

  const tags = (company.expertise || '')
    .split(/[,;|]/g)
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 12);

  return (
    <main className="grid" style={{ gap: 14 }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 260 }}>
            <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.15 }}>
              {company.company_name || '—'}
              
            </div>

            <div className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
              {company.tagline || company.description || 'Company landing page (SSR) for Google visibility.'}
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {company.country ? <span className="pill">🌍 {company.country}</span> : null}
              {company.city ? <span className="pill">📍 {company.city}</span> : null}
              {company.sector ? <span className="pill">🏷️ {company.sector}</span> : null}
              {company.company_type ? <span className="pill">🏢 {company.company_type}</span> : null}
              {company.founded_year ? <span className="pill">⏳ Founded {company.founded_year}</span> : null}
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a className="btn primary" href={`/app/#company=${encodeURIComponent(company.id)}`}>Open full profile in app</a>
              {company.website ? (
                <a className="btn" href={company.website} target="_blank" rel="noreferrer">Visit website</a>
              ) : null}
            </div>
          </div>

          <div className="card" style={{ flex: 1, minWidth: 260, background: 'rgba(0,0,0,0.18)' }}>
            <div style={{ fontWeight: 800 }}>Highlights</div>
            <div className="muted" style={{ marginTop: 8, lineHeight: 1.65 }}>
              Server-rendered for Google visibility. Interactive experience lives at <b>/app</b>.
            </div>

            {tags.length ? (
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tags.map((t) => <span key={t} className="pill">⚡ {t}</span>)}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
    </main>
  );
}
