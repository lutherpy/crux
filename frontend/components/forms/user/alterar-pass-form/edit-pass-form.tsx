'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserService } from '@/service/UserService';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

const FormSchema = z.object({
  password: z
    .string()
    .min(3, { message: 'Password must be at least 6 characters.' })
});

type FormValues = z.infer<typeof FormSchema>;

export default function AlterarPassForm() {
  const router = useRouter();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const userService = new UserService();

      if (userId) {
        // Chamar o serviço para alterar a senha
        await userService.alterarPass({
          id: Number(userId),
          password: data.password
        });

        toast({
          title: 'Password updated successfully!',
          description: 'The password has been changed successfully.'
        });

        router.push('/dashboard/user');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        title: 'Failed to update password.',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">Error: {errorMessage}</code>
          </pre>
        )
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Alterar Senha</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••"
                    type="password"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Alterar Senha'}
          </Button>

          <Link href="/dashboard/user" passHref>
            <Button variant={'outline'} disabled={loading} className="ml-5">
              Cancelar
            </Button>
          </Link>
        </form>
      </Form>
    </div>
  );
}
