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
      </head>
      <body>{children}</body>
    </html>
  );
}
