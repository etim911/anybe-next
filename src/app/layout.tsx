import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Anybe Night',
  description: 'An immersive experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-cream font-serif antialiased">
        <div className="noise-overlay"></div>
        {children}
      </body>
    </html>
  );
}
