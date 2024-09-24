'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { UserService } from '@/service/UserService';
import { User } from '@/types/user';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from '@/components/tables/user-tables/columns';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

export const UserClient: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const userProfile = session?.user?.perfil
    ? parseInt(session.user.perfil, 10)
    : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userService = new UserService();
        const response = await userService.listarTodos();
        setUsers(response);
      } catch (error) {
        toast({
          title: 'Error fetching users',
          description: 'Could not retrieve users from the server.',
          variant: 'destructive'
        });
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    try {
      const userService = new UserService();
      await userService.excluir(userId);
      setUsers(users.filter((user) => user.id !== userId));
      toast({
        title: 'Utilizador Eliminado.',
        description: 'O Utilizador foi eliminado com sucesso.'
      });
    } catch (error) {
      toast({
        title: 'Erro ao eliminar o Utilizador.',
        description:
          'Não foi possível eliminar o Utilizador. Por favor, tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleEditUser = async (userId: number) => {
    setLoading(true);
    router.push(`/dashboard/user/${userId}/edit`);
    setLoading(false);
  };

  const handleAddNewUser = async () => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/dashboard/user/new`);
      setLoading(false);
    }, 300);
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Utilizadores (${users.length})`}
          description="Gestão de Utilizadores"
        />
        {userProfile === 1 && ( // Verifica se o usuário é admin
          <Button
            className="text-xs md:text-sm"
            onClick={handleAddNewUser}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {loading ? 'A adicionar...' : 'Adicionar'}
          </Button>
        )}
      </div>
      <Separator className="mt-24" />

      <DataTable
        searchKey="name"
        columns={columns({
          onDelete: handleDeleteUser,
          onEdit: handleEditUser
        })}
        data={users}
      />
    </>
  );
};
