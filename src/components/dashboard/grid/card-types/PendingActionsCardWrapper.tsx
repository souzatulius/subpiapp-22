
import React, { useEffect, useState } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListTodo, Clock, BellRing, CalendarX, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { format, isBefore } from 'date-fns';

interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  status: 'overdue' | 'warning' | 'ok';
  type: 'demand' | 'note';
  url: string;
}

interface PendingActionsCardWrapperProps {
  card: ActionCardItem;
  notesToApprove: number;
  responsesToDo: number;
  isComunicacao: boolean;
  userDepartmentId: string;
}

const PendingActionsCardWrapper: React.FC<PendingActionsCardWrapperProps> = ({
  card,
  notesToApprove,
  responsesToDo,
  isComunicacao,
  userDepartmentId
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGabinete, setIsGabinete] = useState(false);

  useEffect(() => {
    // Check if the user is from Gabinete
    const checkGabinete = async () => {
      if (!userDepartmentId) return;

      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('descricao')
          .eq('id', userDepartmentId)
          .single();

        if (!error && data?.descricao) {
          setIsGabinete(data.descricao.toLowerCase().includes('gabinete'));
        }
      } catch (error) {
        console.error('Error checking department:', error);
      }
    };

    checkGabinete();
  }, [userDepartmentId]);

  useEffect(() => {
    if (!userDepartmentId) return;

    const fetchPendingTasks = async () => {
      setLoading(true);
      try {
        let allTasks: Task[] = [];
        
        // Different queries based on user department
        if (isComunicacao) {
          // For Comunicacao, show demands that were answered but need notes
          const { data: demandsData, error: demandsError } = await supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta')
            .eq('status', 'respondida')
            .is('nota_oficial_id', null)
            .order('prazo_resposta', { ascending: true })
            .limit(5);
            
          if (!demandsError && demandsData) {
            const demandTasks = demandsData.map(demand => ({
              id: demand.id,
              title: demand.titulo,
              dueDate: demand.prazo_resposta ? new Date(demand.prazo_resposta) : null,
              status: demand.prazo_resposta && isBefore(new Date(demand.prazo_resposta), new Date()) ? 'overdue' : 'warning',
              type: 'demand' as const,
              url: `/dashboard/comunicacao/demandas/${demand.id}`
            }));
            allTasks = [...allTasks, ...demandTasks];
          }
        } else if (isGabinete) {
          // For Gabinete, show all types of pending tasks
          
          // 1. Demands needing response from any department
          const { data: demandsData, error: demandsError } = await supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta, coordenacao_id, coordenacoes:coordenacao_id(descricao)')
            .eq('status', 'em_analise')
            .order('prazo_resposta', { ascending: true })
            .limit(3);
            
          if (!demandsError && demandsData) {
            const demandTasks = demandsData.map(demand => ({
              id: demand.id,
              title: `${demand.titulo} (${(demand.coordenacoes as any)?.descricao || 'Sem coordenação'})`,
              dueDate: demand.prazo_resposta ? new Date(demand.prazo_resposta) : null,
              status: demand.prazo_resposta && isBefore(new Date(demand.prazo_resposta), new Date()) ? 'overdue' : 'warning',
              type: 'demand' as const,
              url: `/dashboard/comunicacao/demandas/${demand.id}`
            }));
            allTasks = [...allTasks, ...demandTasks];
          }
          
          // 2. Notes needing approval
          const { data: pendingNotesData, error: pendingNotesError } = await supabase
            .from('notas_oficiais')
            .select('id, titulo, criado_em')
            .eq('status', 'pendente')
            .order('criado_em', { ascending: false })
            .limit(2);
            
          if (!pendingNotesError && pendingNotesData) {
            const pendingNotesTasks = pendingNotesData.map(note => ({
              id: `note-${note.id}`,
              title: `Nota: ${note.titulo}`,
              dueDate: note.criado_em ? new Date(note.criado_em) : null,
              status: 'ok' as const,
              type: 'note' as const,
              url: `/dashboard/comunicacao/notas/${note.id}`
            }));
            allTasks = [...allTasks, ...pendingNotesTasks];
          }
        } else {
          // For other departments, show demands assigned to their department
          const { data: demandsData, error: demandsError } = await supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta')
            .eq('coordenacao_id', userDepartmentId)
            .eq('status', 'em_analise')
            .order('prazo_resposta', { ascending: true })
            .limit(3);
            
          if (!demandsError && demandsData) {
            const demandTasks = demandsData.map(demand => ({
              id: demand.id,
              title: demand.titulo,
              dueDate: demand.prazo_resposta ? new Date(demand.prazo_resposta) : null,
              status: demand.prazo_resposta && isBefore(new Date(demand.prazo_resposta), new Date()) ? 'overdue' : 'warning',
              type: 'demand' as const,
              url: `/dashboard/comunicacao/responder-demanda/${demand.id}`
            }));
            allTasks = [...allTasks, ...demandTasks];
          }
          
          // Also show notes that need approval from this department
          const { data: notesData, error: notesError } = await supabase
            .from('notas_oficiais')
            .select('id, titulo, criado_em')
            .eq('coordenacao_id', userDepartmentId)
            .eq('status', 'pendente')
            .order('criado_em', { ascending: false })
            .limit(2);
            
          if (!notesError && notesData) {
            const noteTasks = notesData.map(note => ({
              id: `note-${note.id}`,
              title: `Nota: ${note.titulo}`,
              dueDate: note.criado_em ? new Date(note.criado_em) : null,
              status: 'ok' as const,
              type: 'note' as const,
              url: `/dashboard/comunicacao/notas/${note.id}`
            }));
            allTasks = [...allTasks, ...noteTasks];
          }
        }
        
        // Sort tasks by due date (overdue first)
        allTasks.sort((a, b) => {
          // First by status (overdue > warning > ok)
          const statusOrder = { overdue: 0, warning: 1, ok: 2 };
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          
          // Then by due date (oldest first)
          if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
          }
          
          // If one has due date and the other doesn't
          if (a.dueDate && !b.dueDate) return -1;
          if (!a.dueDate && b.dueDate) return 1;
          
          return 0;
        });
        
        // Limit to 3 tasks for display in the smaller card
        setTasks(allTasks.slice(0, 3));
      } catch (error) {
        console.error('Error fetching pending tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingTasks();
  }, [userDepartmentId, isComunicacao, isGabinete]);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'destructive';
      case 'warning':
        return 'warning';
      default:
        return 'secondary';
    }
  };
  
  const handleTaskClick = (url: string) => {
    navigate(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <CalendarX className="h-3 w-3 text-red-500" />;
      case 'warning':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      default:
        return <BellRing className="h-3 w-3 text-blue-500" />;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageSquare className="h-3 w-3" />;
      default:
        return <ListTodo className="h-3 w-3" />;
    }
  };

  return (
    <Card className="h-full border-t-4 border-t-blue-600">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-blue-600" />
          <span>Pendências</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        {loading ? (
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <span>Nenhuma pendência encontrada</span>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleTaskClick(task.url)}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex gap-1.5 items-start">
                    <span className="mt-0.5">{getTypeIcon(task.type)}</span>
                    <span className="font-medium text-xs line-clamp-1">{task.title}</span>
                  </div>
                  <Badge variant={getBadgeVariant(task.status)} className="ml-1 scale-90 whitespace-nowrap flex gap-1 items-center">
                    {getStatusIcon(task.status)}
                    <span className="text-[10px]">
                      {task.status === 'overdue' ? 'Atrasado' : 
                       task.status === 'warning' ? 'Pendente' : 'Novo'}
                    </span>
                  </Badge>
                </div>
                
                {task.dueDate && (
                  <div className="text-[10px] text-gray-500 mt-1 ml-5">
                    Prazo: {format(task.dueDate, 'dd/MM/yyyy')}
                  </div>
                )}
              </div>
            ))}
            
            <div 
              className="text-center pt-2 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => navigate('/dashboard/comunicacao/demandas')}
            >
              Ver todas as pendências
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingActionsCardWrapper;
