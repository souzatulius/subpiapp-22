
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo, Clock, BellRing, CalendarX, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format, isBefore } from 'date-fns';

interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  status: 'overdue' | 'warning' | 'ok';
  type: 'demand' | 'note';
  url: string;
}

const PendingTasksCard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userCoordination, setUserCoordination] = useState<string | null>(null);
  const [isComunicacao, setIsComunicacao] = useState(false);
  const [isGabinete, setIsGabinete] = useState(false);

  useEffect(() => {
    // First, get the user's department
    const fetchUserDepartment = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('coordenacao_id, coordenacoes:coordenacao_id(descricao)')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user department:', error);
          return;
        }

        if (data) {
          setUserCoordination(data.coordenacao_id);
          
          // Check if user is from Comunicação or Gabinete
          if (data.coordenacoes) {
            const deptName = (data.coordenacoes as any).descricao?.toLowerCase() || '';
            setIsComunicacao(deptName.includes('comunicação') || deptName.includes('comunicacao'));
            setIsGabinete(deptName.includes('gabinete'));
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserDepartment();
  }, [user]);

  useEffect(() => {
    if (!userCoordination) return;
    
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
            .order('prazo_resposta', { ascending: true });
            
          if (!demandsError && demandsData) {
            const demandTasks = demandsData.map(demand => ({
              id: demand.id,
              title: demand.titulo,
              dueDate: demand.prazo_resposta ? new Date(demand.prazo_resposta) : null,
              status: demand.prazo_resposta && isBefore(new Date(demand.prazo_resposta), new Date()) 
                ? 'overdue' as const 
                : 'warning' as const,
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
            .order('prazo_resposta', { ascending: true });
            
          if (!demandsError && demandsData) {
            const demandTasks = demandsData.map(demand => ({
              id: demand.id,
              title: `${demand.titulo} (${(demand.coordenacoes as any)?.descricao || 'Sem coordenação'})`,
              dueDate: demand.prazo_resposta ? new Date(demand.prazo_resposta) : null,
              status: demand.prazo_resposta && isBefore(new Date(demand.prazo_resposta), new Date()) 
                ? 'overdue' as const 
                : 'warning' as const,
              type: 'demand' as const,
              url: `/dashboard/comunicacao/demandas/${demand.id}`
            }));
            allTasks = [...allTasks, ...demandTasks];
          }
          
          // 2. Demands answered but needing notes
          const { data: notesNeededData, error: notesNeededError } = await supabase
            .from('demandas')
            .select('id, titulo, prazo_resposta')
            .eq('status', 'respondida')
            .is('nota_oficial_id', null)
            .order('prazo_resposta', { ascending: true });
            
          if (!notesNeededError && notesNeededData) {
            const notesNeededTasks = notesNeededData.map(demand => ({
              id: `note-${demand.id}`,
              title: `${demand.titulo} (Precisa de nota)`,
              dueDate: demand.prazo_resposta ? new Date(demand.prazo_resposta) : null,
              status: 'warning' as const,
              type: 'demand' as const,
              url: `/dashboard/comunicacao/demandas/${demand.id}`
            }));
            allTasks = [...allTasks, ...notesNeededTasks];
          }
          
          // 3. Notes needing approval
          const { data: pendingNotesData, error: pendingNotesError } = await supabase
            .from('notas_oficiais')
            .select('id, titulo, criado_em')
            .eq('status', 'pendente')
            .order('criado_em', { ascending: false });
            
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
            .eq('coordenacao_id', userCoordination)
            .eq('status', 'em_analise')
            .order('prazo_resposta', { ascending: true });
            
          if (!demandsError && demandsData) {
            const demandTasks = demandsData.map(demand => ({
              id: demand.id,
              title: demand.titulo,
              dueDate: demand.prazo_resposta ? new Date(demand.prazo_resposta) : null,
              status: demand.prazo_resposta && isBefore(new Date(demand.prazo_resposta), new Date()) 
                ? 'overdue' as const 
                : 'warning' as const,
              type: 'demand' as const,
              url: `/dashboard/comunicacao/responder-demanda/${demand.id}`
            }));
            allTasks = [...allTasks, ...demandTasks];
          }
          
          // Also show notes that need approval from this department
          const { data: notesData, error: notesError } = await supabase
            .from('notas_oficiais')
            .select('id, titulo, criado_em')
            .eq('coordenacao_id', userCoordination)
            .eq('status', 'pendente')
            .order('criado_em', { ascending: false });
            
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
        
        // Limit to 5 tasks for display
        setTasks(allTasks.slice(0, 5));
      } catch (error) {
        console.error('Error fetching pending tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingTasks();
  }, [userCoordination, isComunicacao, isGabinete]);

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
        return <CalendarX className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <BellRing className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <ListTodo className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <ListTodo className="h-5 w-5" />
          Pendências
        </CardTitle>
      </CardHeader>
      
      <CardContent className="overflow-auto max-h-[360px]">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-5 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-32 text-gray-500">
            <ListTodo className="h-12 w-12 text-gray-300 mb-2" />
            <p>Nenhuma pendência encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleTaskClick(task.url)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-2 items-start">
                    <span className="mt-0.5">{getTypeIcon(task.type)}</span>
                    <span className="font-medium text-sm line-clamp-2">{task.title}</span>
                  </div>
                  <Badge variant={getBadgeVariant(task.status)} className="ml-2 whitespace-nowrap flex gap-1 items-center">
                    {getStatusIcon(task.status)}
                    <span>
                      {task.status === 'overdue' ? 'Atrasado' : 
                       task.status === 'warning' ? 'Pendente' : 'Novo'}
                    </span>
                  </Badge>
                </div>
                
                {task.dueDate && (
                  <div className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>Prazo: {format(task.dueDate, 'dd/MM/yyyy')}</span>
                    <span>{task.type === 'demand' ? 'Demanda' : 'Nota'}</span>
                  </div>
                )}
              </div>
            ))}
            
            <div 
              className="text-center pt-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
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

export default PendingTasksCard;
