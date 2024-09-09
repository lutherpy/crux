// app/add-app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  descricao: z.string().optional(),
  departamento: z.string().min(3, { message: 'Departamento é obrigatório.' }),
  servidor: z.string().min(3, { message: 'Servidor is required.' })
});

type FormValues = z.infer<typeof FormSchema>;

export default function CreateAppForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      descricao: '',
      departamento: '',
      servidor: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const appService = new AppService();
      await appService.inserir(data);
      toast({
        title: 'Sucesso!',
        description: 'O utilizador foi adicionado com sucesso.'
      });
      router.push('/dashboard/app');
    } catch (err) {
      // Checa se err é um objeto e se possui as propriedades esperadas
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
          title: 'Erro ao adicionar o utilizador.',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Erro: {backendErrorMessage}</code>
            </pre>
          )
        });
      } else {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'An unknown error occurred.';
        toast({
          title: 'Failed to add app.',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">Erro: {errorMessage}</code>
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
      <h1 className="mb-4 text-2xl font-bold">Criar Utilizador</h1>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appname</FormLabel>
                <FormControl>
                  <Input placeholder="john_doe" {...field} disabled={loading} />
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
                <FormLabel>Descricao</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="DSI"
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
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Servidor 1</SelectItem>
                      <SelectItem value="2">Servidor 2</SelectItem>
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
