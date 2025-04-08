
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PendingActionsProps {
  id: string;
  notesToApprove: number;
  responsesToDo: number;
  isComunicacao?: boolean;
  userDepartmentId?: string;
}

interface PendingDemand {
  id: string;
  titulo: string;
  prazo: string;
}

const PendingActionsCard: React.FC<PendingActionsProps> = ({ 
  id, 
  notesToApprove, 
  responsesToDo,
  isComunicacao = false,
  userDepartmentId = ''
}) => {
  const navigate = useNavigate();
  const [demandsNeedingNota, setDemandsNeedingNota] = useState<number>(0);
  const [pendingDemands, setPendingDemands] = useState<PendingDemand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchPendingActions = async () => {
      setIsLoading(true);
      try {
        if (isComunicacao) {
          // For communication team: find all demands that need attention
          const { data, error } = await supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta')
            .in('status', ['em_analise', 'aberta'])
            .order('prazo_resposta', { ascending: true })
            .limit(5);
          
          if (error) throw error;
          
          // Format demands with readable dates
          const formattedDemands = (data || []).map(demand => ({
            id: demand.id,
            titulo: demand.titulo,
            prazo: new Date(demand.prazo_resposta).toLocaleDateString('pt-BR')
          }));
          
          setPendingDemands(formattedDemands);
          
          // Also get demands that need a note to be created
          const { data: notaData, error: notaError } = await supabase
            .from('demandas')
            .select('id')
            .eq('status', 'respondida')
            .is('nota_oficial_id', null);
          
          if (notaError) throw notaError;
          setDemandsNeedingNota(notaData?.length || 0);
        } else if (userDepartmentId) {
          // For other departments: find demands assigned to this department
          const { data, error } = await supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta')
            .eq('coordenacao_id', userDepartmentId)
            .eq('status', 'em_analise')
            .order('prazo_resposta', { ascending: true })
            .limit(5);
          
          if (error) throw error;
          
          // Format demands with readable dates
          const formattedDemands = (data || []).map(demand => ({
            id: demand.id,
            titulo: demand.titulo,
            prazo: new Date(demand.prazo_resposta).toLocaleDateString('pt-BR')
          }));
          
          setPendingDemands(formattedDemands);
        }
      } catch (err) {
        console.error("Error fetching pending actions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPendingActions();
  }, [isComunicacao, userDepartmentId]);
  
  // Calculate pending items based on user role
  const totalPending = isComunicacao 
    ? pendingDemands.length + demandsNeedingNota
    : pendingDemands.length + notesToApprove;
    
  const hasPendingItems = totalPending > 0;
  
  const handleViewAll = () => {
    if (isComunicacao) {
      if (pendingDemands.length > 0) {
        navigate('/dashboard/comunicacao/responder');
      } else if (demandsNeedingNota > 0) {
        navigate('/dashboard/comunicacao/criar-nota');
      }
    } else {
      if (pendingDemands.length > 0) {
        navigate('/dashboard/comunicacao/responder');
      } else if (notesToApprove > 0) {
        navigate('/dashboard/comunicacao/aprovar-nota');
      }
    }
  };

  const handleItemClick = (id: string) => {
    navigate(`/dashboard/comunicacao/responder/${id}`);
  };

  return (
    <Card 
      className={`w-full h-full ${hasPendingItems 
        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
        : 'bg-green-50 text-green-800 border border-green-200'} 
        rounded-xl shadow-md overflow-hidden transition-all duration-300`}
    >
      <CardContent className="flex flex-col justify-between h-full p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {hasPendingItems ? 'Você precisa agir' : 'Tudo certo por aqui'}
          </h3>
          {hasPendingItems 
            ? <AlertTriangle className="h-5 w-5" /> 
            : <CheckCircle className="h-5 w-5" />
          }
        </div>
        
        <div className="mt-2 flex-1 overflow-auto">
          {isLoading ? (
            <p className="text-sm italic">Carregando...</p>
          ) : hasPendingItems ? (
            <div className="space-y-2">
              {isComunicacao ? (
                <>
                  {pendingDemands.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Demandas pendentes:</p>
                      <ul className="text-xs space-y-1 max-h-24 overflow-y-auto">
                        {pendingDemands.slice(0, 3).map(demand => (
                          <li 
                            key={demand.id} 
                            className="p-1 hover:bg-yellow-100 rounded cursor-pointer flex justify-between"
                            onClick={() => handleItemClick(demand.id)}
                          >
                            <span className="truncate flex-1">{demand.titulo}</span>
                            <span className="whitespace-nowrap text-yellow-600 ml-2">{demand.prazo}</span>
                          </li>
                        ))}
                        {pendingDemands.length > 3 && (
                          <li className="text-xs italic">
                            + {pendingDemands.length - 3} outras demandas
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {demandsNeedingNota > 0 && (
                    <p className="text-sm mt-2">
                      {`${demandsNeedingNota} demanda${demandsNeedingNota !== 1 ? 's' : ''} aguardando criação de nota oficial`}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {pendingDemands.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Demandas pendentes de resposta:</p>
                      <ul className="text-xs space-y-1 max-h-24 overflow-y-auto">
                        {pendingDemands.slice(0, 3).map(demand => (
                          <li 
                            key={demand.id} 
                            className="p-1 hover:bg-yellow-100 rounded cursor-pointer flex justify-between"
                            onClick={() => handleItemClick(demand.id)}
                          >
                            <span className="truncate flex-1">{demand.titulo}</span>
                            <span className="whitespace-nowrap text-yellow-600 ml-2">{demand.prazo}</span>
                          </li>
                        ))}
                        {pendingDemands.length > 3 && (
                          <li className="text-xs italic">
                            + {pendingDemands.length - 3} outras demandas
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {notesToApprove > 0 && (
                    <p className="text-sm mt-2">
                      {`${notesToApprove} nota${notesToApprove !== 1 ? 's' : ''} aguardando sua aprovação`}
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-sm">Você não tem nenhuma ação pendente no momento.</p>
          )}
        </div>
        
        {hasPendingItems && !isLoading && (
          <button 
            onClick={handleViewAll}
            className="text-xs self-end mt-2 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded transition-colors flex items-center"
          >
            Ver todas <ArrowRight className="h-3 w-3 ml-1" />
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingActionsCard;
