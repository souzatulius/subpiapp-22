
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingDemandsCardProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
}

interface Demanda {
  id: string;
  titulo: string;
  criado_em: string;
  requerente: { nome: string } | null;
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
        
        // Build base query for data
        let baseQuery = supabase
          .from('demandas')
          .select(`
            id, 
            titulo, 
            status, 
            horario_publicacao,
            nome_solicitante
          `);
        
        // Apply filters based on role
        if (isComunicacao) {
          // For communication team, show all pending demands
          baseQuery = baseQuery
            .eq('status', 'pendente_resposta')
            .order('horario_publicacao', { ascending: false });
        } else {
          // For other areas, show only demands for their coordination
          baseQuery = baseQuery
            .eq('coordenacao_id', coordenacaoId)
            .eq('status', 'pendente_resposta')
            .order('horario_publicacao', { ascending: false });
        }
        
        // Get count using separate query with head: true
        const countQuery = isComunicacao 
          ? supabase.from('demandas').select('*', { count: 'exact', head: true }).eq('status', 'pendente_resposta')
          : supabase.from('demandas').select('*', { count: 'exact', head: true })
              .eq('coordenacao_id', coordenacaoId)
              .eq('status', 'pendente_resposta');
        
        const { count, error: countError } = await countQuery;
        
        if (countError) {
          console.error('Error fetching demandas count:', countError);
          return;
        }
        
        setTotalDemandas(count || 0);
        
        // Then get limited data for display
        const { data, error } = await baseQuery.limit(5);
        
        if (error) {
          console.error('Error fetching demandas:', error);
          return;
        }
        
        if (data) {
          // Format data to match the Demanda interface
          const formattedDemandas: Demanda[] = data.map(item => ({
            id: item.id,
            titulo: item.titulo,
            criado_em: item.horario_publicacao, // Using horario_publicacao instead of criado_em
            requerente: { nome: item.nome_solicitante || "Sem requerente" }
          }));
          
          setDemandas(formattedDemandas);
        }
      } catch (err) {
        console.error('Failed to fetch demandas:', err);
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
          Demandas Pendentes
        </CardTitle>
        <Badge className="bg-blue-500 hover:bg-blue-600">{totalDemandas}</Badge>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : demandas.length > 0 ? (
          <>
            <ul className="space-y-2">
              {demandas.map((demanda) => (
                <li 
                  key={demanda.id}
                  className="p-2 hover:bg-blue-50 rounded-md cursor-pointer"
                  onClick={() => handleDemandaClick(demanda.id)}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">
                      {demanda.titulo}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-xs text-gray-500">
                      {demanda.requerente?.nome || "Sem requerente"}
                    </span>
                    <span className="text-xs text-blue-600">
                      {formatDate(demanda.criado_em)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            
            <button
              onClick={handleCardClick}
              className="w-full mt-3 flex items-center justify-center p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm"
            >
              Responder demandas <ArrowRight className="ml-1 h-4 w-4" />
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
