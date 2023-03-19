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
      <body>{children}</body>
    </html>
  );
}
