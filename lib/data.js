import { supabaseServer } from './supabase';

// NOTE: Do NOT wrap these in React cache() – we want newly added companies to
// appear in /sitemap.xml and /company pages without requiring a redeploy.

export async function getCompanies() {
  const sb = supabaseServer();

  // Tier 1: richer directory cards (logo + verification + key facts).
  let { data, error } = await sb
    .from('profiles')
    .select('id, slug, company_name, sector, company_type, city, country, website, tagline, logo_url, founded_year, company_size, verification_status, verified, blue_tick')
    .not('slug', 'is', null)
    .order('company_name', { ascending: true });

  // Tier 2: fall back to the original minimal list if some optional columns
  // are missing in this project's schema.
  if (error) {
    ({ data, error } = await sb
      .from('profiles')
      .select('id, slug, company_name, sector, company_type, city, country, website, tagline, logo_url')
      .not('slug', 'is', null)
      .order('company_name', { ascending: true }));
  }

  // Tier 3: absolute minimum (should exist everywhere).
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
