import { cache } from 'react';
import { supabaseServer } from './supabase';

export const getCompanies = cache(async () => {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('profiles')
    .select('id, slug, company_name, sector, company_type, city, country, website, tagline')
    .not('slug', 'is', null)
    .order('company_name', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
});

export const getCompanyBySlug = cache(async (slug) => {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('profiles')
    .select('id, slug, company_name, sector, company_type, city, country, address, website, tagline, description, company_size, founded_year, expertise, updated_at')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
});
