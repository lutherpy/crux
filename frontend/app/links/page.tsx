// pages/links/index.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LinkService } from '@/service/LinkService';

import { Button, Table, Spinner } from 'reactstrap'; // Usar componentes de UI, opcionalmente

const LinksPage = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      const linkService = new LinkService();

      try {
        const data = await linkService.listarTodos();
        setLinks(data);
      } catch (error) {
        console.error('Erro ao carregar links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleEdit = (id: number) => {
    // Redireciona para a página de edição com o ID do link
    router.push(`/links/editar/${id}`);
  };

  return (
    <div>
      <h1>Lista de Links</h1>

      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>URL</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td>{link.id}</td>
                <td>{link.name}</td>
                <td>{link.url}</td>
                <td>
                  <Button color="warning" onClick={() => handleEdit(link.id)}>
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default LinksPage;
