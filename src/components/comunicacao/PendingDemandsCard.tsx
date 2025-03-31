
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Clock } from 'lucide-react';
import ComunicacaoCard from './ComunicacaoCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PendingDemandsCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
}

const PendingDemandsCard: React.FC<PendingDemandsCardProps> = ({ 
  coordenacaoId, 
  isComunicacao,
  baseUrl = 'dashboard/comunicacao' 
}) => {
  // Use this query to fetch pending demands with details
  const { data: pendingDemands, isLoading } = useQuery({
    queryKey: ['pending_demands_list', coordenacaoId],
    queryFn: async () => {
      try {
        // Build query based on department role
        let query = supabase
          .from('demandas')
          .select('id, titulo, status, prazo_resposta')
          .order('prazo_resposta', { ascending: true })
          .limit(5);
          
        if (isComunicacao) {
          // If user is from communication, show all pending demands
          query = query.eq('status', 'pendente');
        } else if (coordenacaoId) {
          // For other departments, show only demands assigned to their area
          query = query
            .eq('status', 'pendente')
            .eq('coordenacao_id', coordenacaoId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching pending demands:', error);
        return [];
      }
    },
    refetchInterval: 60000 // Refetch every minute
  });

  const pendingCount = pendingDemands?.length || 0;

  // Format due date to readable format
  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Check if demand is overdue
  const isOverdue = (dateStr: string) => {
    const dueDate = new Date(dateStr);
    return dueDate < new Date();
  };

  return (
    <ComunicacaoCard
      title="Responder Demandas"
      icon={<AlertCircle size={18} />}
      badgeCount={pendingCount}
      loading={isLoading}
    >
      <CardContent className="p-4">
        {pendingCount === 0 ? (
          <p className="text-sm text-gray-500 mb-4">
            Não há demandas pendentes no momento.
          </p>
        ) : (
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-500 mb-2">
              {pendingCount} demanda{pendingCount !== 1 ? 's' : ''} aguardando resposta:
            </p>
            <ul className="divide-y divide-gray-100">
              {pendingDemands?.map((demand) => (
                <li key={demand.id} className="py-2">
                  <Link 
                    to={`/${baseUrl}/responder?id=${demand.id}`}
                    className="block hover:bg-gray-50 rounded p-2 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium line-clamp-1">{demand.titulo}</span>
                      <div className={`flex items-center text-xs ${isOverdue(demand.prazo_resposta) ? 'text-red-500' : 'text-gray-500'}`}>
                        <Clock size={12} className="mr-1" />
                        {formatDueDate(demand.prazo_resposta)}
                      </div>
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
          disabled={pendingCount === 0}
        >
          <Link to={`/${baseUrl}/responder`}>
            Ver todas
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </CardContent>
    </ComunicacaoCard>
  );
};

export default PendingDemandsCard;
