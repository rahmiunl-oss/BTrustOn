import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

function isVerified(company) {
  const status = String(company?.verification_status || '').toLowerCase();
  return Boolean(company?.verified || company?.blue_tick) || status === 'verified' || status === 'approved';
}

function safeText(v, fallback = '') {
  const s = String(v || '').trim();
  return s || fallback;
}

export async function GET(_req, { params }) {
  const slug = params?.slug;
  const siteUrl = (process.env.SITE_URL || 'https://btruston.com').replace(/\/$/, '');

  let company = null;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (url && key && slug) {
      const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data } = await sb.from('profiles').select('*').eq('slug', slug).maybeSingle();
      company = data || null;
    }
  } catch {
    company = null;
  }

  const name = safeText(company?.company_name, slug ? slug.replace(/-/g, ' ') : 'BTrustOn');
  const tagline = safeText(company?.tagline, 'Company profile on BTrustOn');
  const logo = safeText(company?.logo_url, `${siteUrl}/android-chrome-512x512.png`);
  const verified = isVerified(company);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          background: '#070b14',
          color: 'white',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
        }}
      >
        {/* background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(900px 500px at 20% 20%, rgba(99,102,241,0.40), rgba(0,0,0,0)), radial-gradient(900px 500px at 80% 30%, rgba(34,197,94,0.18), rgba(0,0,0,0)), radial-gradient(900px 500px at 50% 120%, rgba(56,189,248,0.18), rgba(0,0,0,0))',
          }}
        />
        {/* subtle logo glow */}
        <img
          src={logo}
          style={{
            position: 'absolute',
            right: -80,
            top: -60,
            width: 520,
            height: 520,
            objectFit: 'cover',
            opacity: 0.12,
            filter: 'blur(10px)',
            borderRadius: 120,
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 36,
            borderRadius: 36,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            padding: 70,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 24,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 18, opacity: 0.85 }}>BTrustOn • Company profile</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.05 }}>{name}</div>
                {verified ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.16)',
                      background: 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(56,189,248,0.10))',
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: 'rgba(34,197,94,0.9)' }} />
                    Verified
                  </div>
                ) : null}
              </div>
              <div style={{ fontSize: 24, opacity: 0.9, maxWidth: 920 }}>{tagline}</div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 12, opacity: 0.85, fontSize: 18 }}>
            <div style={{ padding: '10px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)' }}>
              btruston.com/company/{slug}
            </div>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
              }}
            >
              Open full profile in app →
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
