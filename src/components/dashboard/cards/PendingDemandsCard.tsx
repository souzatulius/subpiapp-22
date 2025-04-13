import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Demand {
  id: string;
  titulo: string;
  status: string;
  horario_publicacao: string;
  autor?: {
    nome_completo: string;
  } | null;
}

interface PendingDemandsCardProps {
  maxDemands?: number;
}

const PendingDemandsCard: React.FC<PendingDemandsCardProps> = ({ maxDemands = 5 }) => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemands = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('demandas')
          .select(`
            id, 
            titulo, 
            status, 
            horario_publicacao,
            autor:autor_id (nome_completo)
          `)
          .order('horario_publicacao', { ascending: false })
          .limit(maxDemands);
        
        if (error) throw error;
        
        const processedDemands: Demand[] = (data || []).map(demand => {
          return {
            id: demand.id,
            titulo: demand.titulo,
            status: demand.status,
            horario_publicacao: demand.horario_publicacao,
            autor: demand.autor
          };
        });
        
        setDemands(processedDemands);
      } catch (err) {
        console.error('Error fetching demands:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemands();
    const interval = setInterval(fetchDemands, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [maxDemands]);

  const handleDemandClick = (demandId: string) => {
    navigate(`/dashboard/comunicacao/demandas/${demandId}`);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-2 text-center">Últimas Demandas</h3>
        <div className="overflow-auto flex-1">
          {demands.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              Nenhuma demanda disponível
            </div>
          ) : (
            <ul className="space-y-2 px-1">
              {demands.map((demand) => (
                <li 
                  key={demand.id}
                  onClick={() => handleDemandClick(demand.id)}
                  className={`
                    p-2 rounded-lg cursor-pointer transition-all
                    ${demand.status === 'pendente' ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium truncate">{demand.titulo}</span>
                    <Badge className={`ml-1 shrink-0 ${getStatusColor(demand.status)}`}>
                      {getStatusLabel(demand.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-xs text-gray-600">
                    <span>{demand.autor?.nome_completo || 'Usuário'}</span>
                    <span>{formatDate(demand.horario_publicacao)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pendente': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'em_progresso': return 'bg-blue-500 hover:bg-blue-600';
    case 'concluida': return 'bg-green-500 hover:bg-green-600';
    case 'cancelada': return 'bg-red-500 hover:bg-red-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pendente': return 'Pendente';
    case 'em_progresso': return 'Em Progresso';
    case 'concluida': return 'Concluída';
    case 'cancelada': return 'Cancelada';
    default: return status;
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  } catch (e) {
    return '';
  }
};

export default PendingDemandsCard;
