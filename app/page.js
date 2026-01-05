import CompanyDirectoryClient from '@/components/CompanyDirectoryClient';
import { getCompanies } from '@/lib/data';

export const revalidate = 300;

export default async function Page() {
  const companies = await getCompanies();

  return (
    <main className="grid" style={{ gap: 14 }}>
      <div className="card">
        <div style={{ fontSize: 28, fontWeight: 850, lineHeight: 1.1 }}>
          Grow with the right business partners.
        </div>
        <div className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
          This page is <b>server-rendered</b> for SEO and investor confidence.
          The full product experience remains in the SPA at <b>/app</b>.
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a className="btn primary" href="/app">Launch BTrustOn</a>
        </div>
      </div>

      <CompanyDirectoryClient companies={companies} />
    </main>
  );
}
