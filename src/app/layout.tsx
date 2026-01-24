import React from 'react';
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Dancing+Script:wght@400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lobster&family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
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
