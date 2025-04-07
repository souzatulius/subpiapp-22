
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Edit, FileText, Check, X, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/hooks/consultar-demandas/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';

interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  autor_id: string;
  demanda_id: string;
  status: string;
}

interface DemandasTableProps {
  demandas: Demand[];
  onViewDemand?: (demand: Demand) => void;
  isLoading?: boolean;
}

const DemandasTable: React.FC<DemandasTableProps> = ({
  demandas,
  onViewDemand,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingNotes, setLoadingNotes] = useState<Record<string, boolean>>({});
  const [loadingApproval, setLoadingApproval] = useState<Record<string, boolean>>({});
  const [notas, setNotas] = useState<Record<string, NotaOficial | null>>({});

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'em_andamento':
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'respondida':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida':
      case 'concluído':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
      case 'em-andamento':
        return 'Em andamento';
      case 'respondida':
        return 'Respondida';
      case 'concluida':
      case 'concluído':
        return 'Concluída';
      default:
        return status;
    }
  };

  const fetchNota = async (demandaId: string) => {
    setLoadingNotes(prev => ({ ...prev, [demandaId]: true }));
    try {
      const { data, error } = await supabase
        .from('notas_oficiais')
        .select('*')
        .eq('demanda_id', demandaId)
        .single();

      if (error) {
        throw error;
      }

      // Add the required status property if it doesn't exist
      const notaWithStatus: NotaOficial = {
        ...data,
        status: data.status || 'pendente' // Provide a default status if it doesn't exist
      };

      setNotas(prev => ({ ...prev, [demandaId]: notaWithStatus }));
    } catch (error) {
      console.error('Error fetching nota:', error);
      setNotas(prev => ({ ...prev, [demandaId]: null }));
    } finally {
      setLoadingNotes(prev => ({ ...prev, [demandaId]: false }));
    }
  };

  const handleCreateNotaClick = (demandaId: string) => {
    navigate(`/dashboard/comunicacao/criar-nota?demanda=${demandaId}`);
  };

  const handleEditNotaClick = (notaId: string) => {
    navigate(`/dashboard/comunicacao/editar-nota?id=${notaId}`);
  };

  const handleApproveNota = async (notaId: string, approved: boolean) => {
    setLoadingApproval(prev => ({ ...prev, [notaId]: true }));
    try {
      const { error } = await supabase
        .from('notas_oficiais')
        .update({
          status: approved ? 'aprovada' : 'rejeitada',
          aprovador_id: user?.id
        })
        .eq('id', notaId);

      if (error) throw error;

      toast({
        title: approved ? "Nota aprovada com sucesso" : "Nota rejeitada",
        description: approved ? "A nota oficial foi aprovada." : "A nota oficial foi rejeitada.",
        variant: approved ? "default" : "destructive",
      });

      // Refresh the nota data
      const demandaId = Object.keys(notas).find(
        key => notas[key]?.id === notaId
      );
      if (demandaId) {
        fetchNota(demandaId);
      }
    } catch (error) {
      console.error('Error updating nota status:', error);
      toast({
        title: "Erro ao atualizar nota",
        description: "Não foi possível atualizar o status da nota.",
        variant: "destructive",
      });
    } finally {
      setLoadingApproval(prev => ({ ...prev, [notaId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left font-medium text-gray-500">Titulo</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500">Prioridade</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500">Data</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500">Prazo</th>
              <th className="py-3 px-4 text-center font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {demandas.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Nenhuma demanda encontrada.
                </td>
              </tr>
            ) : (
              demandas.map((demanda) => (
                <tr key={demanda.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{demanda.titulo}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`${getPriorityColor(demanda.prioridade)}`}
                    >
                      {demanda.prioridade.charAt(0).toUpperCase() + demanda.prioridade.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(demanda.status)}`}
                    >
                      {formatStatus(demanda.status)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{formatDate(demanda.horario_publicacao)}</td>
                  <td className="py-3 px-4">{formatDate(demanda.prazo_resposta)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      {/* View demand button */}
                      {onViewDemand && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDemand(demanda)}
                          title="Visualizar demanda"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Note actions */}
                      {demanda.status === 'respondida' && (
                        <>
                          {loadingNotes[demanda.id] ? (
                            <Button variant="ghost" size="sm" disabled>
                              <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                            </Button>
                          ) : !notas[demanda.id] ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchNota(demanda.id)}
                                title="Verificar nota"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCreateNotaClick(demanda.id)}
                                title="Criar nota"
                              >
                                <PenLine className="h-4 w-4" />
                              </Button>
                            </>
                          ) : notas[demanda.id] ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditNotaClick(notas[demanda.id]!.id)}
                                title="Editar nota"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              {/* Approval buttons for pending notes */}
                              {notas[demanda.id]?.status === 'pendente' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600"
                                    onClick={() => handleApproveNota(notas[demanda.id]!.id, true)}
                                    disabled={loadingApproval[notas[demanda.id]!.id]}
                                    title="Aprovar nota"
                                  >
                                    {loadingApproval[notas[demanda.id]!.id] ? (
                                      <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() => handleApproveNota(notas[demanda.id]!.id, false)}
                                    disabled={loadingApproval[notas[demanda.id]!.id]}
                                    title="Rejeitar nota"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              
                              {/* Status badges for approved/rejected notes */}
                              {notas[demanda.id]?.status === 'aprovada' && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  Aprovada
                                </Badge>
                              )}
                              {notas[demanda.id]?.status === 'rejeitada' && (
                                <Badge className="bg-red-100 text-red-800 border-red-200">
                                  Rejeitada
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCreateNotaClick(demanda.id)}
                              title="Criar nota"
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DemandasTable;
