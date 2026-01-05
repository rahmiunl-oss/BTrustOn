import { getCompanies } from '@/lib/data';

export const dynamic = 'force-dynamic';
// Refresh sitemap periodically so newly added companies show up quickly.
export const revalidate = 300; // 5 minutes

export default async function sitemap() {
  const siteUrl = (process.env.SITE_URL || 'https://btruston.com').replace(/\/$/, '');
  const companies = await getCompanies();
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/app`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    ...companies.map((c) => ({
      url: `${siteUrl}/company/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ];
}
