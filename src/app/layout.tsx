import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Betech Boutique - Tecnología, diseño y productos elegidos para vos',
  description:
    'Betech Boutique. Elegimos tecnología para disfrutarla todos los días. Productos premium, asesoramiento real, personas reales.',
  keywords: [
    'tecnología',
    'boutique',
    'productos',
    'diseño',
    'electrónica',
    'celulares',
    'audio',
    'cocina',
    'home',
  ],
  authors: [{ name: 'Betech Boutique' }],
  creator: 'Betech Boutique',
  formatDetection: {
    email: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fafaf8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
