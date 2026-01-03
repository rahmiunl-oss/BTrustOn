export default function robots() {
  const siteUrl = (process.env.SITE_URL || 'https://btruston.com').replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
