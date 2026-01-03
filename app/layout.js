import './globals.css';

export const metadata = {
  title: 'BTrustOn',
  description: 'BTrustOn — trust-first business partner network.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0 18px' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(143,94,255,0.8), rgba(56,189,248,0.35))',
                border: '1px solid rgba(255,255,255,0.14)'
              }} />
              <div>
                <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>BTrustOn</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Professional web + SEO</div>
              </div>
            </a>

            <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a className="btn" href="/app">App</a>
              <a className="btn" href="/sitemap.xml" target="_blank" rel="noreferrer">Sitemap</a>
            </nav>
          </header>

          {children}

          <footer className="muted" style={{ padding: '28px 0 10px', fontSize: 12 }}>
            © {new Date().getFullYear()} BTrustOn • Directory & company pages are server-rendered.
          </footer>
        </div>
      </body>
    </html>
  );
}
