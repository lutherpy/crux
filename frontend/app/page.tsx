import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona para a página /dashboard
  redirect('/dashboard');
}
