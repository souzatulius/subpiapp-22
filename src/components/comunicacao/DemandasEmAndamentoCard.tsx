
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import ComunicacaoCard from './ComunicacaoCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface DemandasEmAndamentoCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
}

const DemandasEmAndamentoCard: React.FC<DemandasEmAndamentoCardProps> = ({ 
  coordenacaoId, 
  isComunicacao,
  baseUrl = 'dashboard/comunicacao'
}) => {
  const { data: demandsCounts, isLoading: countsLoading } = useQuery({
    queryKey: ['demands_counts', coordenacaoId],
    queryFn: async () => {
      try {
        // Build initial query base on user role
        let query = supabase
          .from('demandas')
          .select('status');
          
        if (!isComunicacao && coordenacaoId) {
          // If not communication, filter by user's area
          query = query.eq('coordenacao_id', coordenacaoId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Count demands by status
        const counts = {
          total: data.length,
          respondidas: data.filter(d => d.status === 'respondida').length,
          aguardandoNota: data.filter(d => d.status === 'aguardando_nota').length,
          emAprovacao: data.filter(d => d.status === 'em_aprovacao').length
        };
        
        return counts;
      } catch (error) {
        console.error('Error fetching demands counts:', error);
        return { total: 0, respondidas: 0, aguardandoNota: 0, emAprovacao: 0 };
      }
    },
    refetchInterval: 60000 // Refetch every minute
  });

  // Fetch latest demands
  const { data: latestItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['latest_items', coordenacaoId],
    queryFn: async () => {
      try {
        // Get latest demands
        let demandsQuery = supabase
          .from('demandas')
          .select('id, titulo, status, atualizado_em, tipo:tipo_midia_id(descricao)')
          .order('atualizado_em', { ascending: false })
          .limit(3);
          
        if (!isComunicacao && coordenacaoId) {
          demandsQuery = demandsQuery.eq('coordenacao_id', coordenacaoId);
        }

        // Get latest notas
        let notasQuery = supabase
          .from('notas_oficiais')
          .select('id, titulo, status, atualizado_em')
          .order('atualizado_em', { ascending: false })
          .limit(2);
        
        if (!isComunicacao && coordenacaoId) {
          notasQuery = notasQuery.eq('coordenacao_id', coordenacaoId);
        }
        
        const [demandsResult, notasResult] = await Promise.all([
          demandsQuery,
          notasQuery
        ]);

        // Map demands
        const demands = demandsResult.data?.map(item => ({
          id: item.id,
          titulo: item.titulo,
          status: item.status,
          atualizado_em: item.atualizado_em,
          tipo: 'demanda',
          descricao: item.tipo?.descricao
        })) || [];

        // Map notas
        const notas = notasResult.data?.map(item => ({
          id: item.id,
          titulo: item.titulo,
          status: item.status,
          atualizado_em: item.atualizado_em,
          tipo: 'nota',
          descricao: null
        })) || [];

        // Combine and sort all items
        const allItems = [...demands, ...notas].sort((a, b) => 
          new Date(b.atualizado_em).getTime() - new Date(a.atualizado_em).getTime()
        ).slice(0, 5);

        return allItems;
      } catch (error) {
        console.error('Error fetching latest items:', error);
        return [];
      }
    },
    refetchInterval: 60000
  });

  // Format date to readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit'
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'respondida': return 'bg-green-100 text-green-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'aguardando_nota': return 'bg-blue-100 text-blue-800';
      case 'em_aprovacao': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get formatted status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'respondida': return 'Respondida';
      case 'aprovado': return 'Aprovada';
      case 'rejeitado': return 'Rejeitada';
      case 'aguardando_nota': return 'Aguardando nota';
      case 'em_aprovacao': return 'Em aprovação';
      default: return status;
    }
  };

  // Get link for item type
  const getItemLink = (item: any) => {
    if (item.tipo === 'demanda') {
      return `/${baseUrl}/demandas?id=${item.id}`;
    } else {
      return `/${baseUrl}/notas/consultar?id=${item.id}`;
    }
  };

  const isLoading = countsLoading || itemsLoading;

  return (
    <ComunicacaoCard
      title="Demandas em Andamento"
      icon={<Clock size={18} />}
      loading={isLoading}
    >
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{demandsCounts?.total || 0}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Respondidas</p>
            <p className="text-2xl font-bold">{demandsCounts?.respondidas || 0}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Aguardando Nota</p>
            <p className="text-2xl font-bold">{demandsCounts?.aguardandoNota || 0}</p>
          </div>
        </div>
        
        {latestItems && latestItems.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-gray-500">Últimas atualizações:</h4>
            <ul className="divide-y divide-gray-100">
              {latestItems.map((item) => (
                <li key={`${item.tipo}-${item.id}`} className="py-2">
                  <Link 
                    to={getItemLink(item)}
                    className="block hover:bg-gray-50 rounded p-2 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-medium line-clamp-1">{item.titulo}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(item.status)} border-none text-xs`}
                          >
                            {getStatusLabel(item.status)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {item.tipo === 'demanda' ? 'Demanda' : 'Nota'}
                            {item.descricao && ` - ${item.descricao}`}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 shrink-0">
                        {formatDate(item.atualizado_em)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button
          variant="default"
          size="sm"
          className="w-full"
          asChild
        >
          <Link to={`/${baseUrl}/demandas`}>
            Visualizar todas
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </CardContent>
    </ComunicacaoCard>
  );
};

export default DemandasEmAndamentoCard;
