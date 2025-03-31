
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingDemandsCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
}

interface Demanda {
  id: string;
  titulo: string;
  prazo_resposta: string;
  status: string;
  prioridade: string;
}

const PendingDemandsCard: React.FC<PendingDemandsCardProps> = ({ 
  coordenacaoId, 
  isComunicacao,
  baseUrl = ''
}) => {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [totalDemandas, setTotalDemandas] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('demandas')
          .select('id, titulo, prazo_resposta, status, prioridade');
        
        // Apply filters based on role
        if (isComunicacao) {
          // For communication team, show all pending demands
          query = query
            .in('status', ['pendente', 'em_analise'])
            .order('prazo_resposta', { ascending: true });
        } else {
          // For other areas, show only demands assigned to them
          query = query
            .eq('coordenacao_id', coordenacaoId)
            .eq('status', 'em_analise')
            .order('prazo_resposta', { ascending: true });
        }
        
        // Get count first
        const { count, error: countError } = await query.count();
        
        if (countError) {
          console.error('Error counting demands:', countError);
        } else {
          setTotalDemandas(count || 0);
        }
        
        // Then get limited data
        const { data, error } = await query.limit(5);
        
        if (error) {
          console.error('Error fetching demands:', error);
          return;
        }
        
        setDemandas(data || []);
      } catch (err) {
        console.error('Failed to fetch demands:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (coordenacaoId || isComunicacao) {
      fetchDemandas();
    }
  }, [coordenacaoId, isComunicacao]);

  const handleCardClick = () => {
    navigate(`${baseUrl ? `/${baseUrl}` : ''}/responder`);
  };
  
  const handleDemandaClick = (id: string) => {
    navigate(`${baseUrl ? `/${baseUrl}` : ''}/responder/${id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getPriorityColor = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'urgente': return 'bg-red-200 text-red-900 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5 text-orange-500" />
          Responder Demandas
        </CardTitle>
        <Badge className="bg-orange-500 hover:bg-orange-600">{totalDemandas}</Badge>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : demandas.length > 0 ? (
          <>
            <ul className="space-y-2">
              {demandas.map((demanda) => (
                <li 
                  key={demanda.id}
                  className="p-2 hover:bg-orange-50 rounded-md cursor-pointer"
                  onClick={() => handleDemandaClick(demanda.id)}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">
                      {demanda.titulo}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 ${getPriorityColor(demanda.prioridade)}`}>
                      {demanda.prioridade}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-orange-600">
                    Prazo: {formatDate(demanda.prazo_resposta)}
                  </div>
                </li>
              ))}
            </ul>
            
            <button
              onClick={handleCardClick}
              className="w-full mt-3 flex items-center justify-center p-2 rounded-md bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm"
            >
              Ver todas <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Não há demandas pendentes de resposta.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingDemandsCard;
