'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { UserService } from '@/service/UserService';
import { User } from '@/types/user';
import { Plus, Loader2 } from 'lucide-react'; // Importa o ícone de carregamento
import { useRouter } from 'next/navigation';
import { columns } from '@/components/tables/user-tables/columns';
import { toast } from '@/components/ui/use-toast';

interface UserClientProps {
  data?: User[]; // Data will now be fetched dynamically
}

export const UserClient: React.FC<UserClientProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch users from the backend
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
        title: 'User deleted',
        description: 'The user has been deleted successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error deleting user',
        description: 'Could not delete the user. Please try again.',
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
    // Redireciona com um pequeno atraso para mostrar o carregamento
    setTimeout(() => {
      router.push(`/dashboard/user/new`);
      setLoading(false);
    }, 300); // Ajuste o atraso conforme necessário
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Users (${users.length})`}
          description="Manage users (Client side table functionalities.)"
        />
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
          {loading ? 'Adding...' : 'Adicionar Utilizador'}
        </Button>
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
