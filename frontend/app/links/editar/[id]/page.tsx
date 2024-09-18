// app/links/editar/[id]/page.tsx
'use client'; // Força o componente a ser renderizado no lado do cliente

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Para navegar e pegar parâmetros
import { LinkService } from '@/service/LinkService';
import { Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';

const EditLinkPage = () => {
  const { id } = useParams(); // Pega o ID da URL
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLink = async () => {
      setLoading(true);
      const linkService = new LinkService();

      try {
        const data = await linkService.buscarPorId(Number(id));
        setLink(data);
      } catch (error) {
        console.error('Erro ao buscar o link:', error);
        setError('Erro ao carregar os dados do link.');
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLink((prevLink: any) => ({ ...prevLink, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const linkService = new LinkService();

    try {
      await linkService.alterar(link); // Envia os dados atualizados para o backend
      router.push('/links'); // Redireciona para a lista de links após o sucesso
    } catch (error) {
      console.error('Erro ao salvar o link:', error);
      setError('Erro ao salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Editar Link</h1>
      {link && (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Nome</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={link.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="url">URL</Label>
            <Input
              type="url"
              name="url"
              id="url"
              value={link.url}
              onChange={handleChange}
              required
            />
          </FormGroup>
          {saving ? (
            <Spinner color="primary" />
          ) : (
            <Button color="primary" type="submit">
              Salvar Alterações
            </Button>
          )}
          <Button color="secondary" onClick={() => router.push('/links')}>
            Cancelar
          </Button>
        </Form>
      )}
    </div>
  );
};

export default EditLinkPage;
