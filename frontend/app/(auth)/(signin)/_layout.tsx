// `RootLayout.tsx`
import { Inter } from 'next/font/google';
import '@uploadthing/react/styles.css';
import '@/app/globals.css';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';

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
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden`}
        suppressHydrationWarning={true}
      >
        Ola mundo
        <NextTopLoader showSpinner={false} />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
