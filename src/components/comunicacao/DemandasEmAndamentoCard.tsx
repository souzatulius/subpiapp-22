
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import ComunicacaoCard from './ComunicacaoCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  const { data: demandsCounts, isLoading } = useQuery({
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
