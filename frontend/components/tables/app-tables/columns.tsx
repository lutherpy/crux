import { ColumnDef } from '@tanstack/react-table';
import { App } from '@/types/app';
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
import { Checkbox } from '@/components/ui/checkbox';

interface AppColumnsProps {
  onDelete: (appId: number) => void;
  onEdit: (appId: number) => void;
}

export const columns = ({
  onDelete,
  onEdit
}: AppColumnsProps): ColumnDef<App>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Nome da Aplicação'
  },

  {
    accessorKey: 'descricao',
    header: 'Descrição'
  },
  {
    accessorKey: 'servidor_name',
    header: 'Servidor'
  },
  {
    accessorKey: 'departamento_name',
    header: 'Divisão'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const app = row.original;
      const [open, setOpen] = useState(false);

      const handleDelete = () => {
        setOpen(false);
        onDelete(app.id);
      };

      return (
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(app.id)}>
            <Pencil className="h-4 w-4" />
          </Button>

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
                  This action cannot be undone. This will permanently delete the
                  app.
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
        </div>
      );
    }
  }
];
