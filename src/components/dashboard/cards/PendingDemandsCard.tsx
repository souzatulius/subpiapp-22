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
  coordenacao?: {
    sigla?: string;
    descricao?: string;
  } | null;
}
interface PendingDemandsCardProps {
  maxDemands?: number;
}
const PendingDemandsCard: React.FC<PendingDemandsCardProps> = ({
  maxDemands = 5
}) => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDemands = async () => {
      setIsLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('demandas').select(`
            id, 
            titulo, 
            status, 
            horario_publicacao,
            autor:autor_id(nome_completo),
            coordenacao:coordenacao_id(sigla, descricao)
          `).order('horario_publicacao', {
          ascending: false
        }).limit(maxDemands);
        if (error) throw error;
        const processedDemands: Demand[] = (data || []).map(demand => {
          return {
            id: demand.id,
            titulo: demand.titulo,
            status: demand.status,
            horario_publicacao: demand.horario_publicacao,
            autor: demand.autor,
            coordenacao: demand.coordenacao
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
    return <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>;
  }
  return <div className="h-full w-full border border-slate-300 rounded-3xl">
      <div className="flex flex-col h-full px-[7px] mx-[12px] my-0 py-[10px]">
        <h3 className="text-lg font-semibold mb-2 text-center my-[7px]">Últimas Demandas</h3>
        <div className="overflow-auto flex-1">
          {demands.length === 0 ? <div className="text-center text-gray-500 p-4">
              Nenhuma demanda disponível
            </div> : <ul className="space-y-2 px-0">
              {demands.map(demand => <li key={demand.id} onClick={() => handleDemandClick(demand.id)} className="p-2 cursor-pointer transition-all bg-gray-100 hover:bg-gray-200 rounded-2xl py-[11px] my-[19px]">
                  <div className="flex flex-col px-0 py-[5px]">
                    <span className="text-sm font-medium truncate text-gray-800 w-full px-0 py-[4px]">
                      {demand.titulo}
                    </span>
                    <div className="flex justify-between items-center mt-1 py-[8px] my-[3px]">
                      <span className="text-xs text-gray-600">
                        {demand.coordenacao?.sigla || demand.coordenacao?.descricao || 'Coordenação'}
                      </span>
                      <Badge className="bg-slate-200 text-[10px] text-gray-500 leading-tight rounded-md px-[4px] py-[2px]">
                        {formatStatusLabel(demand.status)}
                      </Badge>
                    </div>
                  </div>
                </li>)}
            </ul>}
        </div>
      </div>
    </div>;
};
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pendente':
      return 'bg-orange-500 hover:bg-orange-600';
    case 'em_progresso':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'concluida':
      return 'bg-green-500 hover:bg-green-600';
    case 'cancelada':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};
const formatStatusLabel = (status: string): string => {
  if (status.includes('_')) {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
};
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  } catch (e) {
    return '';
  }
};
export default PendingDemandsCard;