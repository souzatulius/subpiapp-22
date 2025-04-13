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
  return <div className="border border-slate-300 bg-gray-400 mx-0 px-0">
      <div className="px-0 mx-0 my-0 py-[28px]">
        <h3 className="text-lg font-semibold mb-2 text-center py-[12px]">Últimas Demandas</h3>
        <div className="mx-0 bg-transparent px-[14px]">
          {demands.length === 0 ? <div className="text-center text-gray-500 p-4">
              Nenhuma demanda disponível
            </div> : <ul className="mx-0 py-[7px] my-[4px] bg-transparent px-0">
              {demands.map(demand => <li key={demand.id} onClick={() => handleDemandClick(demand.id)} className="py-[12px] my-[8px] bg-gray-300 px-[15px] mx-0">
                  <div className="">
                    <span className="">
                      {demand.titulo}
                    </span>
                    <div className="">
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