
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Clock } from 'lucide-react';
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
  const { data: pendingNotas, isLoading } = useQuery({
    queryKey: ['pending_notas_list', coordenacaoId],
    queryFn: async () => {
      try {
        // For Communication team, show all pending notes
        // For other departments, show notes related to their area
        let query = supabase
          .from('notas_oficiais')
          .select(`
            id, 
            titulo, 
            status, 
            criado_em, 
            autor_id,
            autor:autor_id (nome_completo)
          `)
          .order('criado_em', { ascending: false })
          .limit(5);
          
        if (isComunicacao) {
          query = query.eq('status', 'pendente');
        } else {
          query = query
            .eq('status', 'pendente')
            .eq('supervisao_tecnica_id', coordenacaoId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching pending notas:', error);
        return [];
      }
    },
    refetchInterval: 60000 // Refetch every minute
  });

  const pendingNotasCount = pendingNotas?.length || 0;

  // Format date to readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <ComunicacaoCard
      title="Notas Oficiais"
      icon={<FileText size={18} />}
      badgeCount={pendingNotasCount}
      loading={isLoading}
    >
      <CardContent className="p-4">
        {pendingNotasCount === 0 ? (
          <p className="text-sm text-gray-500 mb-4">
            Não há notas pendentes de aprovação.
          </p>
        ) : (
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-500 mb-2">
              {pendingNotasCount} nota{pendingNotasCount !== 1 ? 's' : ''} aguardando aprovação:
            </p>
            <ul className="divide-y divide-gray-100">
              {pendingNotas?.map((nota: any) => (
                <li key={nota.id} className="py-2">
                  <Link 
                    to={`/${baseUrl}/consultar?id=${nota.id}`}
                    className="block hover:bg-gray-50 rounded p-2 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium line-clamp-1">{nota.titulo}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(nota.criado_em)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Autor: {nota.autor?.nome_completo || 'Não especificado'}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
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
