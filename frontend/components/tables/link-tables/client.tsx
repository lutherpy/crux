'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { LinkService } from '@/service/LinkService';
import { Link } from '@/types/link';
import { Plus, Loader2 } from 'lucide-react'; // Importa o ícone de carregamento
import { useRouter } from 'next/navigation';
import { columns } from '@/components/tables/link-tables/columns';
import { toast } from '@/components/ui/use-toast';

interface LinkClientProps {
  data?: Link[]; // Data will now be fetched dynamically
}

export const LinkClient: React.FC<LinkClientProps> = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch links from the backend
    const fetchLinks = async () => {
      try {
        const linkService = new LinkService();
        const response = await linkService.listarTodos();
        setLinks(response);
      } catch (error) {
        toast({
          title: 'Error fetching links',
          description: 'Could not retrieve links from the server.',
          variant: 'destructive'
        });
      }
    };

    fetchLinks();
  }, []);

  const handleDeleteLink = async (linkId: number) => {
    try {
      const linkService = new LinkService();
      await linkService.excluir(linkId);
      setLinks(links.filter((link) => link.id !== linkId));
      toast({
        title: 'Link deleted',
        description: 'The link has been deleted successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error deleting link',
        description: 'Could not delete the link. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEditLink = async (linkId: number) => {
    setLoading(true);
    router.push(`/dashboard/link/${linkId}/edit`);
    setLoading(false);
  };

  const handleAddNewLink = async () => {
    setLoading(true);
    // Redireciona com um pequeno atraso para mostrar o carregamento
    setTimeout(() => {
      router.push(`/dashboard/link/new`);
      setLoading(false);
    }, 300); // Ajuste o atraso conforme necessário
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Links (${links.length})`}
          description="Manage links (Client side table functionalities.)"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={handleAddNewLink}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {loading ? 'A adicionar...' : 'Adicionar'}
        </Button>
      </div>
      <Separator className="mt-24" />
      <DataTable
        searchKey="name"
        columns={columns({
          onDelete: handleDeleteLink,
          onEdit: handleEditLink
        })}
        data={links}
      />
    </>
  );
};
