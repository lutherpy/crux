// components/LogoutConfirmDialog.tsx

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button'; // Ajuste o caminho conforme necessário
import { signOut } from 'next-auth/react'; // Ajuste o caminho se necessário

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void; // Adiciona uma nova prop para gerenciar a ação de logout
}

export function LogoutConfirmDialog({
  isOpen,
  onClose,
  onLogout
}: LogoutConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to log out? You will be redirected to the login
          page.
        </AlertDialogDescription>
        <div className="mt-4 flex gap-2">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onLogout(); // Chama a função de logout passada como prop
              onClose();
            }}
          >
            Confirm
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
