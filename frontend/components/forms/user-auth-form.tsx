'use client';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import GithubSignInButton from '../github-auth-button';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username é obrigatório' }),
  password: z
    .string()
    .min(3, { message: 'A senha deve ter no mínimo 6 caracteres' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const [loading, setLoading] = useState(false);
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false, // Não redirecionar automaticamente
        callbackUrl
      });

      if (res?.error) {
        toast({
          title: 'Erro ao fazer login',
          //description: res.error + ' ' + 'Credenciais inválidas',
          description: 'Credenciais inválidas',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Login bem-sucedido',
          description: 'Redirecionando...'
        });
        window.location.href = callbackUrl; // Redireciona manualmente
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao tentar fazer login.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Insira o username..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Insira a palavra-passe..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Form>
    </>
  );
}
