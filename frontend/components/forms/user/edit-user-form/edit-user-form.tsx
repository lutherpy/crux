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
import { DepartamentoService } from '@/service/DepartamentoService';
import { ProfileService } from '@/service/ProfileService';
import { Departamento } from '@/types/departamento';
import { Perfil } from '@/types/perfil';
import { toast } from '@/components/ui/use-toast';

import Link from 'next/link';

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().optional(),
  perfil: z.string().min(1, { message: 'Profile is required.' }),
  departamento: z.string().min(1, { message: 'Departamento is required.' })
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditUserForm() {
  const router = useRouter();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      perfil: '',
      departamento: ''
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userService = new UserService();
        const response = await userService.buscarPorId(Number(userId));
        const user = response;
        form.reset({
          name: user.name,
          username: user.username,
          email: user.email,
          perfil: user.perfil,
          departamento: user.departamento
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

  // Função para buscar departamentos
  const fetchDepartamentos = async () => {
    try {
      const departamentoservice = new DepartamentoService();
      const departamentosList = await departamentoservice.listarTodos(); // Presumindo que esse método já funciona
      setDepartamentos(departamentosList);
      console.log('Departamentos:', departamentosList); // Adicionado para depuração
    } catch (err) {
      toast({
        title: 'Erro ao carregar departamentos.',
        description: 'Não foi possível carregar a lista de departamentos.'
      });
    }
  };

  // Executa a busca ao montar o componente
  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchPerfis = async () => {
    try {
      const profileService = new ProfileService();
      const profilesList = await profileService.listarTodos(); // Presumindo que esse método já funciona
      setPerfis(profilesList);
      console.log('Departamentos:', profilesList); // Adicionado para depuração
    } catch (err) {
      toast({
        title: 'Erro ao carregar perfis.',
        description: 'Não foi possível carregar a lista de perfis.'
      });
    }
  };

  // Executa a busca ao montar o componente
  useEffect(() => {
    fetchPerfis();
  }, []);

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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••"
                    type="password"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.length > 0 ? (
                        departamentos.map((departamento) => (
                          <SelectItem
                            key={departamento.id}
                            value={departamento.id.toString()}
                          >
                            {departamento.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="">
                          Nenhum departamento encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="perfil"
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
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {perfis.length > 0 ? (
                        perfis.map((perfil) => (
                          <SelectItem
                            key={perfil.id}
                            value={perfil.id.toString()}
                          >
                            {perfil.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="">
                          Nenhum perfil encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Adicionando...' : 'Adicionar Utilizador'}
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
