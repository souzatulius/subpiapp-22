import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Eye, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import DemandDetail from '@/components/demandas/DemandDetail';

interface Demand {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  horario_publicacao: string;
  prazo_resposta: string;
  area_coordenacao: {
    descricao: string;
  } | null;
  servico: {
    descricao: string;
  } | null;
  origem: {
    descricao: string;
  } | null;
  tipo_midia: {
    descricao: string;
  } | null;
  bairro: {
    nome: string;
  } | null;
  autor: {
    nome_completo: string;
  } | null;
  endereco: string | null;
  nome_solicitante: string | null;
  email_solicitante: string | null;
  telefone_solicitante: string | null;
  veiculo_imprensa: string | null;
  detalhes_solicitacao: string | null;
  perguntas: Record<string, string> | null;
}

const ConsultarDemandas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const {
    data: demandas = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['demandas'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('demandas').select(`
          *,
          area_coordenacao:area_coordenacao_id(descricao),
          servico:servico_id(descricao),
          origem:origem_id(descricao),
          tipo_midia:tipo_midia_id(descricao),
          bairro:bairro_id(nome),
          autor:autor_id(nome_completo)
        `).order('horario_publicacao', {
        ascending: false
      });
      if (error) throw error;
      return data || [];
    },
    meta: {
      onError: (err: any) => {
        toast({
          title: "Erro ao carregar demandas",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  });

  const filteredDemandas = demandas.filter((demand: any) => demand.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || demand.servico?.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || demand.area_coordenacao?.descricao.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleViewDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleRespondDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDemand) return;
    setDeleteLoading(true);
    
    try {
      const { data: relatedNotes, error: checkError } = await supabase
        .from('notas_oficiais')
        .select('id')
        .eq('demanda_id', selectedDemand.id);
      
      if (checkError) throw checkError;
      
      if (relatedNotes && relatedNotes.length > 0) {
        toast({
          title: "Não é possível excluir a demanda",
          description: "Esta demanda possui notas oficiais associadas. Exclua as notas primeiro.",
          variant: "destructive"
        });
        setIsDeleteDialogOpen(false);
        setDeleteLoading(false);
        return;
      }
      
      const { error } = await supabase
        .from('demandas')
        .delete()
        .eq('id', selectedDemand.id);
        
      if (error) throw error;
      
      toast({
        title: "Demanda excluída",
        description: "A demanda foi excluída com sucesso."
      });
      
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir demanda",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Nova</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Aguardando Respostas</Badge>;
      case 'respondida':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Respondida</Badge>;
      case 'aguardando_nota':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Aguardando Nota</Badge>;
      case 'nota_criada':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">Nota Criada</Badge>;
      case 'pendente_aprovacao':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Pendente de Aprovação</Badge>;
      case 'aprovada':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">Aprovada</Badge>;
      case 'editada':
        return <Badge variant="outline" className="bg-cyan-100 text-cyan-800 border-cyan-300">Editada</Badge>;
      case 'recusada':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Recusada</Badge>;
      case 'arquivada':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Arquivada</Badge>;
      case 'cancelada':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultar Demandas</h1>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Lista de Demandas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="search" placeholder="Buscar demandas..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <Button variant="outline" className="md:w-auto flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </div>
                
                {isLoading ? <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div> : filteredDemandas.length === 0 ? <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma demanda encontrada</p>
                  </div> : <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Área</TableHead>
                          <TableHead>Serviço</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDemandas.map((demand: any) => <TableRow key={demand.id}>
                            <TableCell className="font-medium">{demand.titulo}</TableCell>
                            <TableCell>{demand.area_coordenacao?.descricao || '-'}</TableCell>
                            <TableCell>{demand.servico?.descricao || '-'}</TableCell>
                            <TableCell>{getStatusBadge(demand.status)}</TableCell>
                            <TableCell>
                              {demand.horario_publicacao ? format(new Date(demand.horario_publicacao), 'dd/MM/yyyy', {
                          locale: ptBR
                        }) : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewDemand(demand)} title="Visualizar">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleRespondDemand(demand)} title="Responder">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(demand)} title="Excluir">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <DemandDetail demand={selectedDemand} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-50">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Demanda</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta demanda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteLoading}>
              {deleteLoading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Excluindo...
                </> : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};

export default ConsultarDemandas;
