// components/DashboardData.tsx (Server Component)
import { UserService } from '@/service/UserService';
import { AppService } from '@/service/AppService';
import { LinkService } from '@/service/LinkService';
import { DepartamentoService } from '@/service/DepartamentoService';
import { auth } from '@/auth/auth'; // Supondo que você tenha configurado o NextAuth

export default async function DashboardData() {
  const userService = new UserService();
  const appService = new AppService();
  const linkService = new LinkService();
  const departmentService = new DepartamentoService();

  const session = await auth(); // Autenticação do usuário

  // Busca os dados do servidor
  const users = await userService.listarTodos();
  const applications = await appService.listarTodos();
  const links = await linkService.listarTodos();
  const departments = await departmentService.listarTodos();

  return {
    totalUsers: users.length,
    totalApplications: applications.length,
    totalLinks: links.length,
    totalDepartments: departments.length,
    session // Retorna a sessão do usuário
  };
}
