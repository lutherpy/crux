'use client';

import { useEffect, useState } from 'react';
import { Servidor } from '@/types/servidor';
import { ServidorService } from '@/service/ServidorService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function ServerListPage() {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchServidores = async () => {
    try {
      const servidorService = new ServidorService();
      const servidoresList = await servidorService.listarTodos(); // Supondo que este método lista servidores
      console.log('Servidores:', servidoresList); // Adicionado para depuração
      setServidores(servidoresList);
    } catch (err) {
      toast({
        title: 'Erro ao carregar servidores.',
        description: 'Não foi possível carregar a lista de servidores.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServidores();
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Lista de Servidores</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Sistema Operacional</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servidores.map((servidor) => (
              <TableRow key={servidor.servidor_id}>
                <TableCell>{servidor.servidor_id}</TableCell>
                <TableCell>{servidor.servidor_name}</TableCell>
                <TableCell>{servidor.servidor_ip}</TableCell>
                <TableCell>{servidor.servidor_sop}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Button onClick={() => router.back()} className="mt-4">
        Voltar
      </Button>
    </div>
  );
}
