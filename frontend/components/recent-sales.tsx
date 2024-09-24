import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserService } from '@/service/UserService'; // Importa o UserService

export function RecentSales() {
  const [users, setUsers] = useState<any[]>([]); // Estado para armazenar os utilizadores

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userService = new UserService();
        const userList = await userService.listarTodos(); // Chama o serviço de utilizadores
        setUsers(userList); // Define os utilizadores no estado
      } catch (error) {
        console.error('Erro ao buscar utilizadores:', error);
      }
    };

    fetchUsers(); // Chama a função para buscar os utilizadores
  }, []);

  return (
    <div className="space-y-8">
      {users.slice(0, 5).map(
        (
          user,
          index // Renderiza os primeiros 5 utilizadores
        ) => (
          <div key={index} className="flex items-center">
            <Avatar className="h-9 w-9">
              {/* Placeholder de imagem (ou imagem dinâmica se disponível) */}
              <AvatarImage
                src={`/avatars/${index + 1}.png`}
                alt={`Avatar ${user.nome}`}
              />
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>{' '}
              {/* Nome e sobrenome */}
              <p className="text-sm text-muted-foreground">{user.email}</p>{' '}
              {/* Email */}
            </div>

            {/* Valor aleatório para simular transações */}
          </div>
        )
      )}
    </div>
  );
}
