import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexLogicLab | Next-Gen Intelligent Solutions',
  description: 'Software engineering, neural networks, advanced R&D, and technology solutions from NexLogicLab.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}