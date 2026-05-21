import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoarX Intelligence',
  description: 'AI-powered Excel reasoning and analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
