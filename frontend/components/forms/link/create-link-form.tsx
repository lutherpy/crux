'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { LinkService } from '@/service/LinkService';
import { Departamento } from '@/types/departamento';
import { Departamento_Geral_Service } from '@/service/Departamento_Geral_Service';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  servico: z.string().optional(),
  link: z.string().min(1, { message: 'Link é obrigatório.' }),
  departamento: z.string().optional() // servidor precisa ser selecionado
});

type FormValues = z.infer<typeof FormSchema>;

export default function CreateLinkForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deps, setDeps] = useState<Departamento[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      servico: '',
      link: '',
      departamento: ''
    }
  });

  // Função para buscar departamentos gerais - deps
  const fetchDeps = async () => {
    try {
      const depsService = new Departamento_Geral_Service();
      const depsList = await depsService.listarTodos(); // Presumindo que esse método já funciona
      setDeps(depsList);
      console.log('Deps:', depsList); // Adicionado para depuração
    } catch (err) {
      toast({
        title: 'Erro ao carregar servidores.',
        description: 'Não foi possível carregar a lista de servidores.'
      });
    }
  };

  // Executa a busca ao montar o componente
  useEffect(() => {
    fetchDeps();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const linkService = new LinkService();
      await linkService.inserir(data);
      toast({
        title: 'Sucesso!',
        description: 'O Link foi adicionado com sucesso.'
      });
      router.push('/dashboard/link');
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response === 'object' &&
        (err as any).response !== null &&
        'data' in (err as any).response &&
        typeof (err as any).response.data === 'object' &&
        (err as any).response.data !== null &&
        'error' in (err as any).response.data
      ) {
        const backendErrorMessage = (err as any).response.data.error;
        toast({
          title: 'Erro ao adicionar o link.',
          description: (
            <pre>
              <code>Erro: {backendErrorMessage}</code>
            </pre>
          )
        });
      } else {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'An unknown error occurred.';
        toast({
          title: 'Failed to add link.',
          description: (
            <pre>
              <code>Erro: {errorMessage}</code>
            </pre>
          )
        });
      }
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
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://endereco-da-aplicacao.cmc.ao"
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
            name="servico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviço</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Power Bi, MS Forms, etc"
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
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {deps.length > 0 ? (
                        deps.map((departamento_geral) => (
                          <SelectItem
                            key={departamento_geral.id}
                            value={departamento_geral.id.toString()}
                          >
                            {departamento_geral.name}
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

          <Button type="submit" disabled={loading}>
            {loading ? 'Adicionando...' : 'Adicionar'}
          </Button>
          <Link href="/dashboard/link" passHref>
            <Button variant={'outline'} disabled={loading} className="ml-5">
              Cancelar
            </Button>
          </Link>
        </form>
      </Form>
    </div>
  );
}
