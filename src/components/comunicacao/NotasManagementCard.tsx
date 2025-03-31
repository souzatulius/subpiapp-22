
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import ComunicacaoCard from './ComunicacaoCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NotasManagementCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
}

const NotasManagementCard: React.FC<NotasManagementCardProps> = ({ 
  coordenacaoId, 
  isComunicacao,
  baseUrl = 'dashboard/comunicacao/notas'
}) => {
  const { data: pendingNotasCount, isLoading } = useQuery({
    queryKey: ['pending_notas_count', coordenacaoId],
    queryFn: async () => {
      try {
        // For Communication team, show all pending notes
        // For other departments, show notes related to their area
        let query = supabase
          .from('notas_oficiais')
          .select('id', { count: 'exact' });
          
        if (isComunicacao) {
          query = query.eq('status', 'pendente');
        } else {
          query = query
            .eq('status', 'pendente')
            .eq('supervisao_tecnica_id', coordenacaoId);
        }
        
        const { count, error } = await query;
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error('Error fetching pending notas count:', error);
        return 0;
      }
    },
    refetchInterval: 60000 // Refetch every minute
  });

  return (
    <ComunicacaoCard
      title="Notas Oficiais"
      icon={<FileText size={18} />}
      badgeCount={pendingNotasCount}
      loading={isLoading}
    >
      <CardContent className="p-4">
        <p className="text-sm text-gray-500 mb-4">
          {pendingNotasCount === 0
            ? "Não há notas pendentes de aprovação."
            : `${pendingNotasCount} nota${pendingNotasCount !== 1 ? 's' : ''} aguardando aprovação.`}
        </p>
        
        <div className="space-y-2">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            asChild
          >
            <Link to={`/${baseUrl}/consultar`}>
              Consultar notas
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          
          {isComunicacao && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              asChild
            >
              <Link to={`/${baseUrl}/aprovar`}>
                Aprovar notas
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </ComunicacaoCard>
  );
};

export default NotasManagementCard;
