import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
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
import { auth } from '@/auth/auth';
import SessionTimer from '@/components/SessionTimer';
import { AppWindow, Link, User2, Workflow } from 'lucide-react';

export default async function DashboardBlockLP() {
  const session = await auth();

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Olá {session?.user?.name}! Bem-vindo 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            {/* Adiciona o timer de sessão */}
          </div>
          <div className="hidden items-center space-x-2 md:flex">
            {/* <CalendarDateRangePicker /> */}
            {/* <Button>Download</Button> */}
            <SessionTimer />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="Sample">Sample</TabsTrigger>
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
                  <div className="text-2xl font-bold">$45,231.89</div>
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
                  <div className="text-2xl font-bold">+2350</div>
                </CardContent>
              </Card>
              <Card className=" transform cursor-pointer transition-transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Links</CardTitle>
                  <Link />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
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
                  <div className="text-2xl font-bold">+573</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Sample" className="space-y-4">
            Hello World!
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
