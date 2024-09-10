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
import { AppService } from '@/service/AppService';
import { toast } from '@/components/ui/use-toast';
import { DepartamentoService } from '@/service/DepartamentoService';
import { ServidorService } from '@/service/ServidorService';
import { Servidor } from '@/types/servidor';
import { Departamento } from '@/types/departamento';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  descricao: z.string().optional(),
  departamento: z.string().min(1, { message: 'Departamento é obrigatório.' }),
  servidor: z.string().min(1, { message: 'Servidor is required.' }) // servidor precisa ser selecionado
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditAppForm() {
  const router = useRouter();
  const { appId } = useParams();
  const [loading, setLoading] = useState(false);
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      descricao: '',
      departamento: '',
      servidor: ''
    }
  });

  // Função para buscar servidores
  const fetchServidores = async () => {
    try {
      const servidorService = new ServidorService();
      const servidoresList = await servidorService.listarTodos(); // Presumindo que esse método já funciona
      setServidores(servidoresList);
      console.log('Servidores:', servidoresList); // Adicionado para depuração
    } catch (err) {
      toast({
        title: 'Erro ao carregar servidores.',
        description: 'Não foi possível carregar a lista de servidores.'
      });
    }
  };

  // Executa a busca ao montar o componente
  useEffect(() => {
    fetchServidores();
  }, []);

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

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        const appService = new AppService();
        const response = await appService.buscarPorId(Number(appId));
        const app = response.data;
        form.reset({
          name: app.name,
          descricao: app.descricao,
          departamento: app.departamento,
          servidor: app.servidor
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        toast({
          title: 'Failed to load app data.',
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };

    if (appId) {
      fetchApp();
    }
  }, [appId, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const appService = new AppService();

      if (appId) {
        const updatedApp = { ...data, id: Number(appId) };
        await appService.alterar(updatedApp);
        toast({
          title: 'App updated successfully!',
          description: 'The app has been updated successfully.'
        });
      } else {
        await appService.inserir(data);
        toast({
          title: 'App added successfully!',
          description: 'The app has been created successfully.'
        });
      }

      router.push('/dashboard/apps');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        title: appId ? 'Failed to update app.' : 'Failed to add app.',
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
      <h1 className="mb-4 text-2xl font-bold">Editar Aplicação</h1>
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
                  <Input
                    placeholder="Nome da aplicação"
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
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
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
            name="servidor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servidor</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o servidor" />
                    </SelectTrigger>
                    <SelectContent>
                      {servidores.length > 0 ? (
                        servidores.map((servidor) => (
                          <SelectItem
                            key={servidor.servidor_id}
                            value={servidor.servidor_id.toString()}
                          >
                            {servidor.servidor_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="">
                          Nenhum servidor encontrado
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
            {loading ? 'Adicionando...' : 'Adicionar Aplicação'}
          </Button>
          <Link href="/dashboard/apps" passHref>
            <Button variant={'outline'} disabled={loading} className="ml-5">
              Cancelar
            </Button>
          </Link>
        </form>
      </Form>
    </div>
  );
}
