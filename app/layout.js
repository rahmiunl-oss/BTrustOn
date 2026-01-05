import './globals.css';

const SITE_URL = (process.env.SITE_URL || 'https://btruston.com').replace(/\/$/, '');

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BTrustOn',
    template: '%s | BTrustOn',
  },
  description: 'Grow with the right business partners. Verified company profiles and directories.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'BTrustOn',
    title: 'BTrustOn',
    description: 'Grow with the right business partners. Verified company profiles and directories.',
    images: [{
      url: '/og-default.png',
      width: 1200,
      height: 630,
      alt: 'BTrustOn',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BTrustOn',
    description: 'Grow with the right business partners. Verified company profiles and directories.',
    images: ['/og-default.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
