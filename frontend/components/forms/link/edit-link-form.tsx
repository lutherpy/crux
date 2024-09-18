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
import { LinkService } from '@/service/LinkService';
import { toast } from '@/components/ui/use-toast';
import { Departamento_Geral_Service } from '@/service/Departamento_Geral_Service';
import { Departamento } from '@/types/departamento';
import Link from 'next/link';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  servico: z.string().optional(),
  link: z.string().min(1, { message: 'Link é obrigatório.' }),
  departamento: z.string().optional() // Departamento precisa ser selecionado
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditLinkForm() {
  const router = useRouter();
  const { linkId } = useParams();
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
    } catch (err) {
      toast({
        title: 'Erro ao carregar departamentos.',
        description: 'Não foi possível carregar a lista de departamentos.'
      });
    }
  };

  // Executa a busca ao montar o componente
  useEffect(() => {
    fetchDeps();
  }, []);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        setLoading(true);
        const linkService = new LinkService();
        const response = await linkService.buscarPorId(Number(linkId));
        const link = response; // Verifique se a estrutura do retorno é correta
        form.reset({
          name: link.name,
          servico: link.servico || '',
          link: link.link,
          departamento: link.departamento?.toString() || '' // Converta para string
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred.';
        toast({
          title: 'Failed to load link data.',
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };

    if (linkId) {
      fetchLink();
    }
  }, [linkId, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const linkService = new LinkService();

      if (linkId) {
        const updatedLink = { ...data, id: Number(linkId) };
        await linkService.alterar(updatedLink);
        toast({
          title: 'Link updated successfully!',
          description: 'The link has been updated successfully.'
        });
      } else {
        await linkService.inserir(data);
        toast({
          title: 'Link added successfully!',
          description: 'The link has been created successfully.'
        });
      }

      router.push('/dashboard/link');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        title: linkId ? 'Failed to update link.' : 'Failed to add link.',
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
      <h1 className="mb-4 text-2xl font-bold">Editar Link</h1>
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
                    placeholder="Nome do link"
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
                    placeholder="https://endereco-do-link.com"
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
                    placeholder="Nome do serviço"
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
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {deps.length > 0 ? (
                        deps.map((departamento) => (
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

          <Button type="submit" disabled={loading}>
            {loading ? 'A atualizar...' : 'Atualizar'}
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
