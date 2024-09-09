// components/Sidebar.tsx

'use client';

import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/components/layout/sidebar-menu';
import { cn } from '@/lib/utils';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { LogoutConfirmDialog } from '../custom/logout-modal';
import { signOut } from 'next-auth/react';
import { Separator } from '../ui/separator';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggle = () => {
    toggle();
  };

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: '/' // Redireciona para a página inicial após o logout
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link href={'https://github.com/lutherpy/crux'} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
        <div className="absolute bottom-4 w-full px-3">
          <LogoutConfirmDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onLogout={handleLogout} // Passa a função de logout como prop
          />
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex w-full items-center justify-center rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" /> {/* Ícone de Logout */}
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
