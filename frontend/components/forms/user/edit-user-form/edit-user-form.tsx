'use client';

import { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UserService } from '@/service/UserService';
import { toast } from '@/components/ui/use-toast';

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),

  profile_id: z.string().min(1, { message: 'Profile is required.' })
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditUserForm() {
  const router = useRouter();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<
    { id: string; description: string }[]
  >([
    { id: '1', description: 'Administrador' },
    { id: '2', description: 'Utilizador' }
  ]);
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      profile_id: '1'
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userService = new UserService();
        const response = await userService.buscarPorId(Number(userId));
        const user = response.data;
        form.reset({
          name: user.name,
          username: user.username,
          email: user.email,
          profile_id: String(user.profile_id)
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        toast({
          title: 'Failed to load user data.',
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const userService = new UserService();

      if (userId) {
        const updatedUser = { ...data, id: Number(userId) };
        await userService.alterar(updatedUser);
        toast({
          title: 'User updated successfully!',
          description: 'The user has been updated successfully.'
        });
      } else {
        await userService.inserir(data);
        toast({
          title: 'User added successfully!',
          description: 'The user has been created successfully.'
        });
      }

      router.push('/dashboard/user');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        title: userId ? 'Failed to update user.' : 'Failed to add user.',
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
      <h1 className="mb-4 text-2xl font-bold">Editar Utilizador</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="john_doe" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select profile"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Administrador</SelectItem>
                      <SelectItem value="2">Utilizador</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar Utilizador'}
          </Button>
          <Button
            variant={'outline'}
            disabled={loading}
            className="ml-5"
            onClick={() => router.push('/dashboard/user')}
          >
            {loading ? '...' : 'Cancelar'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
