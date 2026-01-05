import { getCompanies } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

export default async function sitemap() {
  const siteUrl = (process.env.SITE_URL || 'https://btruston.com').replace(/\/$/, '');
  const companies = await getCompanies();
  const now = new Date();

  return [
    // Home now redirects to /app, so we treat /app as the primary entry
    { url: `${siteUrl}/app`, lastModified: now, changeFrequency: 'daily', priority: 1 },

    // Company pages (SEO)
    ...companies.map((c) => ({
      url: `${siteUrl}/company/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ];
}
