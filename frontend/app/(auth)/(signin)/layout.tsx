import { Toaster } from '@/components/ui/toaster';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="">
      <div className="">
        <Toaster />
        {children}
      </div>
    </div>
  );
}
