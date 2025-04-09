
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

interface PendingNote {
  id: string;
  titulo: string;
  criado_em: string;
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
  const [pendingNotes, setPendingNotes] = useState<PendingNote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchPendingActions = async () => {
      setIsLoading(true);
      try {
        // Fetch pending demands
        const { data: demandData, error: demandError } = await supabase
          .from('demandas')
          .select('id, titulo, prazo_resposta')
          .in('status', isComunicacao ? ['em_analise', 'aberta'] : ['em_analise'])
          .eq(isComunicacao ? 'id' : 'coordenacao_id', isComunicacao ? 'id' : userDepartmentId)
          .order('prazo_resposta', { ascending: true })
          .limit(5);
        
        if (demandError) throw demandError;
        
        // Format demands with readable dates
        const formattedDemands = (demandData || []).map(demand => ({
          id: demand.id,
          titulo: demand.titulo,
          prazo: new Date(demand.prazo_resposta).toLocaleDateString('pt-BR')
        }));
        
        setPendingDemands(formattedDemands);
        
        // Fetch pending notes
        const { data: notesData, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('id, titulo, criado_em')
          .eq('status', 'pendente')
          .order('criado_em', { ascending: false })
          .limit(5);
        
        if (notesError) throw notesError;
        
        // Format notes with readable dates
        const formattedNotes = (notesData || []).map(note => ({
          id: note.id,
          titulo: note.titulo,
          criado_em: new Date(note.criado_em).toLocaleDateString('pt-BR')
        }));
        
        setPendingNotes(formattedNotes);
        
        if (isComunicacao) {
          // Additionally for comms team: get demands that need notes
          const { data: notaData, error: notaError } = await supabase
            .from('demandas')
            .select('id')
            .eq('status', 'respondida')
            .is('nota_oficial_id', null);
          
          if (notaError) throw notaError;
          setDemandsNeedingNota(notaData?.length || 0);
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
  const hasPendingDemands = pendingDemands.length > 0;
  const hasPendingNotes = pendingNotes.length > 0;
  const hasPendingItems = hasPendingDemands || hasPendingNotes || demandsNeedingNota > 0;
  
  const handleViewAll = () => {
    if (hasPendingDemands) {
      navigate('/dashboard/comunicacao/responder');
    } else if (hasPendingNotes) {
      navigate('/dashboard/comunicacao/aprovar-nota');
    } else if (demandsNeedingNota > 0) {
      navigate('/dashboard/comunicacao/criar-nota');
    }
  };

  const handleDemandClick = (id: string) => {
    navigate(`/dashboard/comunicacao/responder/${id}`);
  };

  const handleNoteClick = (id: string) => {
    navigate(`/dashboard/comunicacao/aprovar-nota/${id}`);
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
            {hasPendingItems ? 'Ações Pendentes' : 'Tudo em dia'}
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
            <div className="space-y-4">
              {/* Pending Demands Section */}
              {hasPendingDemands && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Demandas pendentes:</p>
                  <ul className="text-xs space-y-1 max-h-24 overflow-y-auto">
                    {pendingDemands.slice(0, 3).map(demand => (
                      <li 
                        key={demand.id} 
                        className="p-1 hover:bg-yellow-100 rounded cursor-pointer flex justify-between"
                        onClick={() => handleDemandClick(demand.id)}
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
              
              {/* Pending Notes Section */}
              {hasPendingNotes && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Notas para aprovação:</p>
                  <ul className="text-xs space-y-1 max-h-24 overflow-y-auto">
                    {pendingNotes.slice(0, 3).map(note => (
                      <li 
                        key={note.id} 
                        className="p-1 hover:bg-yellow-100 rounded cursor-pointer flex justify-between"
                        onClick={() => handleNoteClick(note.id)}
                      >
                        <span className="truncate flex-1">{note.titulo}</span>
                        <span className="whitespace-nowrap text-yellow-600 ml-2">{note.criado_em}</span>
                      </li>
                    ))}
                    {pendingNotes.length > 3 && (
                      <li className="text-xs italic">
                        + {pendingNotes.length - 3} outras notas
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              {/* For communications team: demands needing notes */}
              {isComunicacao && demandsNeedingNota > 0 && (
                <p className="text-sm mt-1">
                  {`${demandsNeedingNota} demanda${demandsNeedingNota !== 1 ? 's' : ''} aguardando criação de nota oficial`}
                </p>
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
