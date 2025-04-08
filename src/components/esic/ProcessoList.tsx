
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, ChevronRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from '@/components/ui/confirm-dialog';
import NovoProcessoButton from './NovoProcessoButton';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ESICProcesso } from '@/types/esic';

interface ProcessoWithAutor extends Omit<ESICProcesso, 'autor'> {
  autor: {
    nome_completo: string;
  } | null;
}

const ProcessoList = () => {
  const [processos, setProcessos] = useState<ProcessoWithAutor[]>([]);
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

      // Safely cast the data to the appropriate type
      const typedData = (data || []).map(item => ({
        ...item,
        situacao: item.situacao as ESICProcesso['situacao'],
        status: item.status as ESICProcesso['status'],
        autor: item.autor as ProcessoWithAutor['autor']
      }));

      setProcessos(typedData);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
      toast({
        title: 'Erro ao carregar processos',
        description: 'Não foi possível carregar a lista de processos. Tente novamente mais tarde.',
        variant: 'destructive'
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
        description: 'O processo foi excluído com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao excluir processo:', error);
      toast({
        title: 'Erro ao excluir processo',
        description: 'Não foi possível excluir o processo. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedProcessoId(null);
    }
  };

  const getStatusBadge = (status: ESICProcesso['status']) => {
    switch (status) {
      case 'novo_processo':
        return <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-600">Novo Processo</Badge>;
      case 'aguardando_justificativa':
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">Aguardando Justificativa</Badge>;
      case 'aguardando_aprovacao':
        return <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-600">Aguardando Aprovação</Badge>;
      case 'concluido':
        return <Badge variant="outline" className="bg-green-50 border-green-200 text-green-600">Concluído</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
      ) : processos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Nenhum processo cadastrado</h3>
          <p className="text-sm text-gray-500 mb-6">Comece cadastrando um novo processo e-SIC</p>
          
          <NovoProcessoButton 
            buttonText="Cadastrar primeiro processo" 
            variant="default" 
            onSuccess={fetchProcessos} 
          />
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
            {processos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell className="font-medium">
                  {processo.data_processo ? format(new Date(processo.data_processo), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <div className="font-medium line-clamp-1">
                      {processo.texto?.substring(0, 100)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {processo.solicitante ? `Solicitante: ${processo.solicitante}` : ''}
                      {processo.solicitante && processo.autor?.nome_completo ? ' | ' : ''}
                      {processo.autor?.nome_completo ? `Criado por: ${processo.autor.nome_completo}` : ''}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(processo.status)}
                </TableCell>
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
