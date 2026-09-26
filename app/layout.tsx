import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexLogicLab | Next-Gen Intelligent Solutions',
  description: 'Software engineering, neural networks, advanced R&D, and technology solutions from NexLogicLab.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico'
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}