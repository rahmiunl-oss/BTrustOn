import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCompanyBySlug } from '@/lib/data';
import VerifiedBadge, { isCompanyVerified } from '@/components/VerifiedBadge';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

function clean(s) {
  return String(s || '').trim();
}

function normalizeList(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).map((x) => x.trim()).filter(Boolean);
  return String(v)
    .split(/[;,\n]+/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const company = await getCompanyBySlug(slug);
  const siteUrl = (process.env.SITE_URL || 'https://btruston.com').replace(/\/$/, '');

  if (!company) {
    return {
      title: 'Company not found | BTrustOn',
      robots: { index: false, follow: false },
    };
  }

  const title = `${company.company_name} | BTrustOn`;
  const description =
    clean(company.tagline) ||
    clean(company.description) ||
    `${company.company_name} company profile on BTrustOn.`;

  const ogImage = `${siteUrl}/og/company/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/company/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/company/${slug}`,
      siteName: 'BTrustOn',
      type: 'profile',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${company.company_name} — BTrustOn`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CompanyPage({ params }) {
  const slug = params.slug;
  const company = await getCompanyBySlug(slug);
  if (!company) return notFound();

  const city = clean(company.city);
  const country = clean(company.country);
  const hq = [city, country].filter(Boolean).join(', ');

  const industry = clean(company.sector) || clean(company.company_type);
  const founded = clean(company.founded_year);
  const size = clean(company.company_size);

  const services = normalizeList(company.services || company.expertise);
  const projects = normalizeList(company.projects);
  const certificates = normalizeList(company.certificates);
  const assets = normalizeList(company.assets);

  const website = clean(company.website);
  const websiteUrl = website
    ? website.startsWith('http')
      ? website
      : `https://${website}`
    : '';

  const appUrl = `https://www.btruston.com/app#company=${company.id}`;

  const isVerified = isCompanyVerified(company);
  const logoUrl = clean(company.logo_url);

  return (
    <main className="page">
      <div className="topbar">
        <div className="brand">
          <div>
            <div className="brandName">BTrustOn</div>
            <div className="brandSub">Professional web + SEO</div>
          </div>
        </div>
        <div className="topActions">
          <Link className="btn ghost" href="/app" aria-label="Discover the B2B network in BTrustOn">
            Discover B2B Network
          </Link>
          {/* Sitemap link intentionally removed from UI (still accessible at /sitemap.xml) */}
        </div>
      </div>

      <section className="companyHero">
        <div className="companyHeroBg" aria-hidden>
          <div className="coverLogoBg">
            {logoUrl ? <img src={logoUrl} alt="" /> : null}
          </div>
        </div>
        <div className="companyHeroInner">
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="companyHeroLogoWrap">
              <div className="companyLogo" aria-hidden>
                {logoUrl ? (
                  <img src={logoUrl} alt="" />
                ) : (
                  <div className="fallback">{clean(company.company_name)[0] || 'C'}</div>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <h1 className="companyH" style={{ marginBottom: 6 }}>
                  {company.company_name}
                </h1>
                <div className="companyTagline" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span>{clean(company.tagline) || 'Company profile on BTrustOn.'}</span>
                  {isVerified ? <VerifiedBadge company={company} /> : null}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {country ? <span className="pill">🌐 {country}</span> : null}
              {city ? <span className="pill">📍 {city}</span> : null}
              {industry ? <span className="pill">🏷️ {industry}</span> : null}
              {clean(company.company_type) ? <span className="pill">🏢 {company.company_type}</span> : null}
              {founded ? <span className="pill">⏳ Founded {founded}</span> : null}
            </div>

            <div className="actions">
              <a className="btn primary" href={appUrl} rel="nofollow">
                Open Full Profile
              </a>
              {websiteUrl ? (
                <a className="btn ghost" href={websiteUrl} target="_blank" rel="noreferrer">
                  Visit website
                </a>
              ) : null}
              <Link className="btn ghost" href="/">
                Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="companyLayout">
        <section className="companyCard">
          <h2 className="companyCardTitle">Overview</h2>
          <ul className="companyList">
            {size ? (
              <li>
                <span>Company size</span>
                <strong>{size}</strong>
              </li>
            ) : null}
            {hq ? (
              <li>
                <span>HQ</span>
                <strong>{hq}</strong>
              </li>
            ) : null}
            {clean(company.address) ? (
              <li>
                <span>Address</span>
                <strong>{company.address}</strong>
              </li>
            ) : null}
            {clean(company.registration_no) ? (
              <li>
                <span>Registration</span>
                <strong>{company.registration_no}</strong>
              </li>
            ) : null}
          </ul>
          <p className="companyFooter">
            For messaging, quotes, and partner requests, use the full experience in the app.
          </p>
        </section>

        <aside className="companyCard">
          <h2 className="companyCardTitle">Key facts</h2>
          <div className="factsGrid">
            <div className="fact">
              <div className="factLabel">Industry</div>
              <div className="factValue">{industry || '—'}</div>
            </div>
            <div className="fact">
              <div className="factLabel">HQ</div>
              <div className="factValue">{hq || '—'}</div>
            </div>
            <div className="fact">
              <div className="factLabel">Founded</div>
              <div className="factValue">{founded || '—'}</div>
            </div>
            <div className="fact">
              <div className="factLabel">Size</div>
              <div className="factValue">{size || '—'}</div>
            </div>
          </div>
          {isVerified ? (
            <div style={{ marginTop: 12 }}>
              <VerifiedBadge company={company} />
            </div>
          ) : null}
        </aside>
      </div>

      {clean(company.description) ? (
        <section className="companyCard" style={{ marginTop: 20 }}>
          <h2 className="companyCardTitle">About</h2>
          <div style={{ color: 'rgba(234,240,255,0.78)', lineHeight: 1.6 }}>
            {company.description}
          </div>
        </section>
      ) : null}

      {services.length ? (
        <section className="companyCard" style={{ marginTop: 20 }}>
          <h2 className="companyCardTitle">Services</h2>
          <div className="companyTags">
            {services.slice(0, 40).map((x) => (
              <span key={x} className="pill">
                {x}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {projects.length ? (
        <section className="companyCard" style={{ marginTop: 20 }}>
          <h2 className="companyCardTitle">Projects</h2>
          <div className="companyTags">
            {projects.slice(0, 40).map((x) => (
              <span key={x} className="pill">
                {x}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {certificates.length ? (
        <section className="companyCard" style={{ marginTop: 20 }}>
          <h2 className="companyCardTitle">Certificates</h2>
          <div className="companyTags">
            {certificates.slice(0, 40).map((x) => (
              <span key={x} className="pill">
                {x}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {assets.length ? (
        <section className="companyCard" style={{ marginTop: 20 }}>
          <h2 className="companyCardTitle">Assets</h2>
          <div className="companyTags">
            {assets.slice(0, 40).map((x) => (
              <span key={x} className="pill">
                {x}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="footer">
        © {new Date().getFullYear()} BTrustOn • Directory & company pages are server-rendered.
      </footer>
    </main>
  );
}
