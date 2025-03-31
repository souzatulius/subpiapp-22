
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface OverdueDemandsProps {
  id: string;
  overdueCount?: number;
  overdueItems?: { title: string; id: string }[];
  isComunicacao?: boolean;
  userDepartmentId?: string;
}

interface DemandItem {
  id: string;
  titulo: string;
  status: string;
  prazo_resposta: string | null;
}

const OverdueDemandsCard: React.FC<OverdueDemandsProps> = ({ 
  id,
  overdueCount = 0,
  overdueItems = [],
  isComunicacao = false,
  userDepartmentId = ''
}) => {
  const navigate = useNavigate();
  const [demandsList, setDemandsList] = useState<DemandItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchDemands = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('demandas')
          .select('id, titulo, status, prazo_resposta')
          .order('criado_em', { ascending: false })
          .limit(5);
          
        // Filter based on role
        if (isComunicacao) {
          // For communication team: show all in-progress demands
          query = query.in('status', ['pendente', 'em_analise', 'respondida']);
        } else if (userDepartmentId) {
          // For other departments: only show their pending demands
          query = query.eq('coordenacao_id', userDepartmentId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          setDemandsList(data);
        }
      } catch (err) {
        console.error("Error fetching demands:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDemands();
  }, [isComunicacao, userDepartmentId]);
  
  const handleViewAll = () => {
    navigate('/dashboard/comunicacao/consultar-demandas');
  };
  
  const handleItemClick = (demandId: string) => {
    navigate(`/dashboard/comunicacao/consultar-demandas/${demandId}`);
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em análise';
      case 'respondida': return 'Respondida';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'em_analise': return 'text-blue-600 bg-blue-100';
      case 'respondida': return 'text-green-600 bg-green-100';
      case 'concluida': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="w-full h-full bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
      <CardContent className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">
            {isComunicacao ? 'Demandas em Andamento' : 'Demandas da sua Coordenação'}
          </h3>
          <Clock className="h-5 w-5 text-gray-600" />
        </div>
        
        <div className="mt-3 flex-1 overflow-auto">
          {isLoading ? (
            <p className="text-sm text-gray-500 italic">Carregando...</p>
          ) : demandsList.length > 0 ? (
            <ul className="space-y-2">
              {demandsList.map(demand => (
                <li 
                  key={demand.id}
                  className="text-sm border-b border-gray-100 pb-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onClick={() => handleItemClick(demand.id)}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-gray-800 truncate flex-1">{demand.titulo}</span>
                    <span className={`text-xs px-2 py-0.5 ml-2 rounded-full whitespace-nowrap ${getStatusColor(demand.status)}`}>
                      {getStatusLabel(demand.status)}
                    </span>
                  </div>
                  {demand.prazo_resposta && (
                    <div className="text-xs text-gray-500 mt-1">
                      Prazo: {new Date(demand.prazo_resposta).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma demanda encontrada.</p>
          )}
        </div>
        
        <button 
          onClick={handleViewAll}
          className="self-end mt-4 text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors flex items-center"
        >
          Ver todas <ArrowRight className="h-3 w-3 ml-1" />
        </button>
      </CardContent>
    </Card>
  );
};

export default OverdueDemandsCard;
