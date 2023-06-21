import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata = {
  title: 'Actordle',
  description: 'Can you guess the actor with his picture ?',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='manifest' href='./manifest.json'></link>
        <link
          rel='apple-touch-startup-image'
          href='./android-chrome-512x512.png'
        />
      </head>
      <body className='bg-zinc-100'>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
