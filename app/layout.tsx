import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
  description: 'MogTerminal Base | EXPERTS ONLY | THIS IS AN EXPERIMENT | where YOU the community control the Agents wallet | Direct influence over Agents actions | Have fun degen',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
