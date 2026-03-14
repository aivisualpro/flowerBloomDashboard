import React from 'react';
import Script from 'next/script';
import '../globals.css';
import '../app.css';

// Project imports - adjust paths if necessary
import { ConfigProvider } from '../contexts/ConfigContext';
import Providers from './providers';

export const metadata = {
  title: 'Flower Bloom Control Center',
  description: 'Admin Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0FB4BB" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Dancing+Script:wght@400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lobster&family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
        <Script
          id="unregister-sw"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ConfigProvider>
          <Providers>
            {children}
          </Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
