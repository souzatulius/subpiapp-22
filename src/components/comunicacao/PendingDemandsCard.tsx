
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
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
  // Use this query to fetch pending demands count
  const { data: pendingDemandsCount, isLoading } = useQuery({
    queryKey: ['pending_demands_count', coordenacaoId],
    queryFn: async () => {
      try {
        // Build query based on department role
        let query = supabase
          .from('demandas')
          .select('id', { count: 'exact' });
          
        if (isComunicacao) {
          // If user is from communication, show all pending demands
          query = query.eq('status', 'pendente');
        } else if (coordenacaoId) {
          // For other departments, show only demands assigned to their area
          query = query
            .eq('status', 'pendente')
            .eq('coordenacao_id', coordenacaoId);
        }
        
        const { count, error } = await query;
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error('Error fetching pending demands count:', error);
        return 0;
      }
    },
    refetchInterval: 60000 // Refetch every minute
  });

  return (
    <ComunicacaoCard
      title="Responder Demandas"
      icon={<AlertCircle size={18} />}
      badgeCount={pendingDemandsCount}
      loading={isLoading}
    >
      <CardContent className="p-4">
        <p className="text-sm text-gray-500 mb-4">
          {pendingDemandsCount === 0
            ? "Não há demandas pendentes no momento."
            : `${pendingDemandsCount} demanda${pendingDemandsCount !== 1 ? 's' : ''} aguardando resposta.`}
        </p>
        
        <Button
          variant="default"
          size="sm"
          className="w-full"
          asChild
          disabled={pendingDemandsCount === 0}
        >
          <Link to={`/${baseUrl}/demandas/pendentes`}>
            Ver demandas
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </CardContent>
    </ComunicacaoCard>
  );
};

export default PendingDemandsCard;
