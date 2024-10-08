import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface UserColumnsProps {
  onDelete: (userId: number) => void;
  onEdit: (userId: number) => void;
}

export const columns = ({
  onDelete,
  onEdit
}: UserColumnsProps): ColumnDef<User>[] => {
  const { data: session } = useSession();
  const userProfile = session?.user?.perfil
    ? parseInt(session.user.perfil, 10)
    : null; // Faz o parse para número

  return [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'username',
      header: 'Username'
    },
    {
      accessorKey: 'departamento',
      header: 'Divisão'
    },
    {
      accessorKey: 'perfil',
      header: 'Perfil'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        const [open, setOpen] = useState(false);

        const handleDelete = () => {
          setOpen(false);
          onDelete(user.id);
        };

        return (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onEdit(user.id)}>
              <Pencil className="h-4 w-4" />
            </Button>

            {userProfile === 1 && ( // Exibe o botão de deletar apenas para admins
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the user.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      }
    }
  ];
};
