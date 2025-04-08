
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, FileText, ChevronRight, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ESICProcesso } from '@/types/esic';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import NovoProcessoButton from './NovoProcessoButton';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ProcessoListProps {
  viewMode: 'list' | 'cards';
  searchTerm: string;
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProcessoList: React.FC<ProcessoListProps> = ({
  viewMode,
  searchTerm,
  filterOpen,
  setFilterOpen
}) => {
  const [processos, setProcessos] = useState<ESICProcesso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProcessoId, setSelectedProcessoId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProcessos();
  }, []);

  const fetchProcessos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('esic_processos')
        .select(`
          *,
          autor:autor_id(nome_completo)
        `)
        .order('data_processo', { ascending: false });

      if (error) throw error;

      // Safely cast the data to ensure proper type handling
      const typedData = (data || []).map(item => ({
        ...item,
        situacao: item.situacao as ESICProcesso['situacao'],
        status: item.status as ESICProcesso['status'],
        autor: item.autor as ESICProcesso['autor']
      })) as ESICProcesso[];

      setProcessos(typedData);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
      toast({
        title: 'Erro ao carregar processos',
        description: 'Não foi possível carregar a lista de processos. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedProcessoId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProcessoId) return;

    try {
      const { error } = await supabase
        .from('esic_processos')
        .delete()
        .eq('id', selectedProcessoId);

      if (error) throw error;

      setProcessos(processos.filter(p => p.id !== selectedProcessoId));
      toast({
        title: 'Processo excluído',
        description: 'O processo foi excluído com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir processo:', error);
      toast({
        title: 'Erro ao excluir processo',
        description: 'Não foi possível excluir o processo. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedProcessoId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-600">Pendente</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">Em andamento</Badge>;
      case 'respondido':
        return <Badge variant="outline" className="bg-green-50 border-green-200 text-green-600">Respondido</Badge>;
      case 'arquivado':
        return <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-600">Arquivado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter processos based on search term if provided
  const filteredProcessos = processos.filter(processo => {
    if (!searchTerm) return true;
    return processo.texto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           processo.autor?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Processos e-SIC
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie processos e pedidos de acesso à informação
          </p>
        </div>
        <NovoProcessoButton onSuccess={fetchProcessos} />
      </div>

      <Separator className="my-4" />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : filteredProcessos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Nenhum processo cadastrado</h3>
          <p className="text-sm text-gray-500 mb-6">
            Comece cadastrando um novo processo e-SIC
          </p>
          <NovoProcessoButton buttonText="Cadastrar primeiro processo" variant="default" onSuccess={fetchProcessos} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Processo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Justificativas</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProcessos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell className="font-medium">
                  {processo.data_processo ? format(new Date(processo.data_processo), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <div className="font-medium line-clamp-1">{processo.texto?.substring(0, 100)}</div>
                    <div className="text-sm text-gray-500">{processo.autor?.nome_completo || 'Usuário'}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(processo.status)}</TableCell>
                <TableCell>
                  {processo.justificativas_count ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600">
                      {processo.justificativas_count} justificativa(s)
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-sm">Nenhuma</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`/esic/processos/${processo.id}`}>
                      <Button variant="outline" size="sm" className="h-8">
                        <ChevronRight className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteClick(processo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir processo"
        description="Tem certeza que deseja excluir este processo? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ProcessoList;
