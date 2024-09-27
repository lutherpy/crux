'use client'; // Certifica-se de que este é um Client Component

import { useState, useEffect } from 'react';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from '@/components/recent-sales';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionTimer from '@/components/SessionTimer';
import { AppWindow, Link, User2, Workflow } from 'lucide-react';
import { UserService } from '@/service/UserService';
import { AppService } from '@/service/AppService'; // Importa o AppService
import { LinkService } from '@/service/LinkService'; // Importa o LinkService
import { DepartamentoService } from '@/service/DepartamentoService'; // Importa o DepartmentService

export default function DashboardBlockLP() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0); // Estado para os departamentos

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userService = new UserService();
        const appService = new AppService();
        const linkService = new LinkService(); // Instancia o LinkService
        const departmentService = new DepartamentoService(); // Instancia o DepartmentService

        // Chama o serviço de usuários
        const users = await userService.listarTodos();
        setTotalUsers(users.length);

        // Chama o serviço de aplicações
        const applications = await appService.listarTodos();
        setTotalApplications(applications.length);

        // Chama o serviço de links
        const links = await linkService.listarTodos(); // Chamada para buscar links
        setTotalLinks(links.length); // Atualiza o estado com o total de links

        // Chama o serviço de departamentos
        const departments = await departmentService.listarTodos(); // Chamada para buscar departamentos
        setTotalDepartments(departments.length); // Atualiza o estado com o total de departamentos
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData(); // Chama a função de busca dos dados
  }, []);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Olá, bem-vindo 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <SessionTimer />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className=" transform cursor-pointer transition-transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Utilizadores
                  </CardTitle>
                  <User2 />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                </CardContent>
              </Card>
              <Card className=" transform cursor-pointer transition-transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Aplicações
                  </CardTitle>
                  <AppWindow />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalApplications}</div>
                </CardContent>
              </Card>
              <Card className=" transform cursor-pointer transition-transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Links</CardTitle>
                  <Link />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLinks}</div>{' '}
                  {/* Exibe o total de links */}
                </CardContent>
              </Card>
              <Card className=" transform cursor-pointer transition-transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Divisões
                  </CardTitle>
                  <Workflow />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDepartments}</div>{' '}
                  {/* Exibe o total de departamentos */}
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <PieGraph />
              </Card>
              {/* <Card className="col-span-4 md:col-span-3"></Card>{' '} */}
              {/* <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent><RecentSales /></CardContent>
              </Card> */}
            </div>
          </TabsContent>
          <TabsContent value="sobre" className="space-y-4">
            O Sirius V2 é uma solução abrangente que centraliza e organiza as
            aplicações e links do Departamento.
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
