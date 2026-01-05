import { supabaseServer } from './supabase';

// NOTE: Do NOT wrap these in React cache() – we want newly added companies to
// appear in /sitemap.xml and /company pages without requiring a redeploy.

export async function getCompanies() {
  const sb = supabaseServer();

  // Attempt a “nice” minimal select first.
  let { data, error } = await sb
    .from('profiles')
    .select('id, slug, company_name, sector, company_type, city, country, website, tagline, logo_url')
    .not('slug', 'is', null)
    .order('company_name', { ascending: true });

  // Some installs may not have all optional columns. If the select fails,
  // fall back to a minimal schema that should exist everywhere.
  if (error) {
    ({ data, error } = await sb
      .from('profiles')
      .select('id, slug, company_name')
      .not('slug', 'is', null)
      .order('company_name', { ascending: true }));
  }

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCompanyBySlug(slug) {
  const sb = supabaseServer();

  // We use * for maximum compatibility across schema versions.
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
