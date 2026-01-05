import { notFound } from 'next/navigation';
import { getCompanyBySlug } from '@/lib/data';

export const revalidate = 600; // 10 minutes

const SITE_NAME = 'BTrustOn';
const SITE_URL = 'https://btruston.com';

function cleanWebsite(url) {
  if (!url) return null;
  const u = String(url).trim();
  if (!u) return null;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return `https://${u}`;
}

function splitTags(raw) {
  if (!raw) return [];
  const s = String(raw);
  return s
    .split(/[,;\n\t|]+/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 24);
}

function isVerifiedCompany(company) {
  const status = String(company?.verification_status || '').toLowerCase();
  return Boolean(
    company?.verified ||
      company?.is_verified ||
      company?.blue_tick ||
      status === 'verified' ||
      status === 'approved'
  );
}

export async function generateMetadata({ params }) {
  const company = await getCompanyBySlug(params.slug);
  if (!company) return {};

  const title = `${company.company_name || 'Company'} | ${SITE_NAME}`;
  const description =
    company.tagline ||
    company.description ||
    `View ${company.company_name || 'this company'} on ${SITE_NAME}.`;

  const ogImage = company.logo_url ? [company.logo_url] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/company/${company.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/company/${company.slug}`,
      siteName: SITE_NAME,
      type: 'website',
      images: ogImage,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: ogImage,
    },
  };
}

export default async function CompanyPublicPage({ params }) {
  const company = await getCompanyBySlug(params.slug);
  if (!company) notFound();

  const website = cleanWebsite(company.website);
  const tags = splitTags(company.services || company.expertise || company.capabilities);
  const verified = isVerifiedCompany(company);

  const city = company.city ? String(company.city).trim() : '';
  const country = company.country ? String(company.country).trim() : '';
  const location = [city, country].filter(Boolean).join(', ');

  const appHref = `/app/#company=${encodeURIComponent(company.id)}`;

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.company_name || undefined,
    url: `${SITE_URL}/company/${company.slug}`,
    logo: company.logo_url || undefined,
    description: company.description || company.tagline || undefined,
    sameAs: website ? [website] : undefined,
    address: location
      ? {
          '@type': 'PostalAddress',
          addressLocality: city || undefined,
          addressCountry: country || undefined,
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Companies',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: company.company_name || company.slug,
        item: `${SITE_URL}/company/${company.slug}`,
      },
    ],
  };

  return (
    <main className="wrap">
      {/* Global header lives in app/layout.js */}

      <section className="companyHero">
        <div className="companyHeroLeft">
          <div className="avatar">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_url} alt={`${company.company_name || 'Company'} logo`} />
            ) : (
              <span className="avatarFallback" aria-hidden="true">
                {(company.company_name || 'C').slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>

          <div className="companyTitle">
            <h1>
              {company.company_name || 'Company'}
              {verified ? <span className="verified">Verified</span> : null}
            </h1>
            {company.tagline ? <p className="tagline">{company.tagline}</p> : null}

            <div className="metaRow">
              {company.sector ? <span className="pill">{company.sector}</span> : null}
              {company.company_type ? <span className="pill">{company.company_type}</span> : null}
              {location ? <span className="pill">{location}</span> : null}
              {company.founded_year ? <span className="pill">Founded {company.founded_year}</span> : null}
            </div>

            <div className="ctaRow">
              <a className="btn" href={appHref}>
                Open full profile in BTrustOn
              </a>
              {website ? (
                <a className="btn ghost" href={website} target="_blank" rel="noreferrer">
                  Visit website
                </a>
              ) : null}
              <a className="btn ghost" href="/">
                Back to directory
              </a>
            </div>
          </div>
        </div>

        <aside className="companyHeroRight">
          <div className="card">
            <h3>Key details</h3>
            <ul className="facts">
              {company.sector ? (
                <li>
                  <span>Sector</span>
                  <strong>{company.sector}</strong>
                </li>
              ) : null}
              {company.company_type ? (
                <li>
                  <span>Type</span>
                  <strong>{company.company_type}</strong>
                </li>
              ) : null}
              {company.company_size ? (
                <li>
                  <span>Company size</span>
                  <strong>{company.company_size}</strong>
                </li>
              ) : null}
              {company.city || company.country ? (
                <li>
                  <span>Location</span>
                  <strong>{location || '-'}</strong>
                </li>
              ) : null}
              {company.founded_year ? (
                <li>
                  <span>Founded</span>
                  <strong>{company.founded_year}</strong>
                </li>
              ) : null}
              {company.address ? (
                <li>
                  <span>Address</span>
                  <strong className="muted">{company.address}</strong>
                </li>
              ) : null}
            </ul>

            <div className="subtle">
              For messaging, RFQs and partner requests, open the full profile in BTrustOn.
            </div>
          </div>
        </aside>
      </section>

      <section className="grid">
        <article className="card">
          <h2>About</h2>
          <p className="about">
            {company.description
              ? company.description
              : company.tagline
              ? company.tagline
              : 'This company has not added a public description yet.'}
          </p>
        </article>

        <article className="card">
          <h2>Services</h2>
          {tags.length ? (
            <div className="tagGrid">
              {tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="muted">No services listed yet.</p>
          )}
        </article>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {SITE_NAME}</span>
        <span className="dot" aria-hidden="true">•</span>
        <a className="footerLink" href={appHref}>
          Open in app
        </a>
      </footer>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
