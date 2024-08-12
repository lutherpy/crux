// `RootLayout.tsx`
import { redirect } from 'next/navigation';
import { Inter } from 'next/font/google';
import Providers from '@/components/layout/providers';
import { auth } from '@/auth/auth';
import '@uploadthing/react/styles.css';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CRUX',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Verificar a sessão no lado do servidor
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden`}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
