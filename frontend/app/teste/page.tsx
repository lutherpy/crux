'use client';

import PageContainer from '@/components/layout/page-container';
import CardLp from '@/components/custom/card-lp';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import CreateUserForm from '@/components/forms/create-user-form/create-user-form';
export default function Component() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        Bem vindo.
        <div className="mt-5">
          <CardLp />
        </div>
        <AlertDialog>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogDescription>
                <CreateUserForm />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageContainer>
  );
}
