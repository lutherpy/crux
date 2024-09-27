import { Metadata } from 'next';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import router, { useRouter } from 'next/router';
import Link from 'next/link';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { checkIsAuthenticated } from '@/auth/checkIsAuthenticated';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default async function AuthenticationPage() {
  const isAuthenticated = await checkIsAuthenticated();

  if (isAuthenticated) {
    redirect('/dashboard');
  }
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
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
          SIRIUS V2
        </div>
        <div className="relative z-10 mt-auto">
          <Image
            src="/login.png" // Caminho da sua imagem
            alt="Descrição da Imagem"
            layout="intrinsic" // Mantém a imagem no tamanho real
            width={700} // Substitua com a largura real da imagem
            height={700} // Substitua com a altura real da imagem
            className="rounded-lg" // Estilo opcional
            priority // Carrega a imagem com prioridade
          />
          <blockquote className="space-y-2">
            <p className=" text-lg">
              O Sirius V2 é uma solução abrangente que centraliza e organiza as
              aplicações e links do Departamento.
            </p>
            <footer className="text-sm">DSIC</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Fazer Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Insira as suas credenciais para fazer Login.
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
