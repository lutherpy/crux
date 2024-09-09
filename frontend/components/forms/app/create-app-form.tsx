'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import { Servidor } from '@/types/servidor';
import { ServidorService } from '@/service/ServidorService';
import { toast } from '@/components/ui/use-toast';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  descricao: z.string().optional(),
  departamento: z.string().min(3, { message: 'Departamento é obrigatório.' }),
  servidor: z.string().min(1, { message: 'Servidor is required.' }) // servidor precisa ser selecionado
});

type FormValues = z.infer<typeof FormSchema>;

export default function CreateAppForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [servidores, setServidores] = useState<Servidor[]>([]);

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
    console.log('Lista de servers: ' + servidores);
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const appService = new AppService();
      await appService.inserir(data);
      toast({
        title: 'Sucesso!',
        description: 'A aplicação foi adicionada com sucesso.'
      });
      router.push('/dashboard/app');
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'An unknown error occurred.';
      toast({
        title: 'Erro ao adicionar aplicação.',
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Criar Aplicação</h1>
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
                  <Input
                    placeholder="Descrição da aplicação"
                    type="text"
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
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Departamento"
                    type="text"
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

          <Button
            variant={'outline'}
            disabled={loading}
            className="ml-5"
            onClick={() => router.back()}
          >
            {loading ? '...' : 'Cancelar'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
