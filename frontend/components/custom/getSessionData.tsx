import { auth } from '@/auth/auth';
export default async function GetSessionData() {
  const session = await auth();
  return <div>Olá {session?.user?.name}! Bem-vindo 👋</div>;
}
