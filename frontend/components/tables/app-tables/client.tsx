'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AppService } from '@/service/AppService';
import { App } from '@/types/app';
import { Plus, Loader2 } from 'lucide-react'; // Importa o ícone de carregamento
import { useRouter } from 'next/navigation';
import { columns } from '@/components/tables/app-tables/columns';
import { toast } from '@/components/ui/use-toast';

interface AppClientProps {
  data?: App[]; // Data will now be fetched dynamically
}

export const AppClient: React.FC<AppClientProps> = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch apps from the backend
    const fetchApps = async () => {
      try {
        const appService = new AppService();
        const response = await appService.listarTodos();
        setApps(response);
      } catch (error) {
        toast({
          title: 'Error fetching apps',
          description: 'Could not retrieve apps from the server.',
          variant: 'destructive'
        });
      }
    };

    fetchApps();
  }, []);

  const handleDeleteApp = async (appId: number) => {
    try {
      const appService = new AppService();
      await appService.excluir(appId);
      setApps(apps.filter((app) => app.id !== appId));
      toast({
        title: 'Aplicação eliminada.',
        description: 'A Aplicação foi eliminada com sucesso.'
      });
    } catch (error) {
      toast({
        title: 'Error deleting app',
        description: 'Could not delete the app. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEditApp = async (appId: number) => {
    setLoading(true);
    router.push(`/dashboard/apps/${appId}/edit`);
    setLoading(false);
  };

  const handleAddNewApp = async () => {
    setLoading(true);
    // Redireciona com um pequeno atraso para mostrar o carregamento
    setTimeout(() => {
      router.push(`/dashboard/apps/new`);
      setLoading(false);
    }, 300); // Ajuste o atraso conforme necessário
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Apps (${apps.length})`}
          description="Manage apps (Client side table functionalities.)"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={handleAddNewApp}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {loading ? 'A adicionar...' : 'Adicionar'}
        </Button>
      </div>
      <Separator className="mt-24" />
      <DataTable
        searchKey="name"
        columns={columns({
          onDelete: handleDeleteApp,
          onEdit: handleEditApp
        })}
        data={apps}
      />
    </>
  );
};
