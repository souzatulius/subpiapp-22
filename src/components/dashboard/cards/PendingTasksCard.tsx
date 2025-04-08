
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Task, convertTasksArray } from '@/types/task';
import { AlertTriangle, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PendingTasksCardProps {
  id: string;
  title?: string;
  userDepartmentId?: string;
  isComunicacao?: boolean;
}

const PendingTasksCard: React.FC<PendingTasksCardProps> = ({
  id,
  title = "Tarefas pendentes",
  userDepartmentId,
  isComunicacao = false
}) => {
  const navigate = useNavigate();
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    fetchPendingTasks();
  }, [userDepartmentId, isComunicacao]);
  
  const fetchPendingTasks = async () => {
    setIsLoading(true);
    
    try {
      // Fetch demands that need attention
      let tasks: Task[] = [];
      
      if (isComunicacao) {
        // Communication department tasks (notes to create)
        const { data: demandData, error: demandError } = await supabase
          .from('demandas')
          .select('id, titulo, prazo_resposta, status')
          .eq('status', 'respondida')
          .is('nota_oficial_id', null);
        
        if (demandError) throw demandError;
        
        const demandTasks = (demandData || []).map(demand => ({
          id: demand.id,
          title: demand.titulo,
          dueDate: new Date(demand.prazo_resposta),
          status: 'warning', // As warning to indicate needed action
          type: 'demand' as const,
          url: `/dashboard/comunicacao/criar-nota?demandaId=${demand.id}`
        }));
        
        // Process tasks to ensure they match the Task type
        tasks = convertTasksArray(demandTasks);
      } else if (userDepartmentId) {
        // Department tasks (demands to respond)
        const { data: demandData, error: demandError } = await supabase
          .from('demandas')
          .select('id, titulo, prazo_resposta, status')
          .eq('coordenacao_id', userDepartmentId)
          .eq('status', 'em_analise');
        
        if (demandError) throw demandError;
        
        const demandTasks = (demandData || []).map(demand => {
          const dueDate = new Date(demand.prazo_resposta);
          const now = new Date();
          const diffDays = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Determine status based on due date
          let status: 'overdue' | 'warning' | 'ok' = 'ok';
          if (diffDays < 0) {
            status = 'overdue';
          } else if (diffDays < 2) {
            status = 'warning';
          }
          
          return {
            id: demand.id,
            title: demand.titulo,
            dueDate,
            status,
            type: 'demand' as const,
            url: `/dashboard/comunicacao/responder/${demand.id}`
          };
        });
        
        // Additionally, fetch notes that need approval
        const { data: noteData, error: noteError } = await supabase
          .from('notas_oficiais')
          .select('id, titulo, criado_em')
          .eq('status', 'aguardando_aprovacao')
          .eq('coordenacao_id', userDepartmentId);
        
        if (noteError) throw noteError;
        
        const noteTasks = (noteData || []).map(note => ({
          id: note.id,
          title: note.titulo,
          dueDate: new Date(note.criado_em),
          status: 'warning' as const,
          type: 'note' as const,
          url: `/dashboard/comunicacao/aprovar-nota/${note.id}`
        }));
        
        // Combine tasks and ensure they match the Task type
        tasks = convertTasksArray([...demandTasks, ...noteTasks]);
        
        // Sort by status priority (overdue first, then warning, then ok)
        tasks.sort((a, b) => {
          const statusPriority = { overdue: 0, warning: 1, ok: 2 };
          return statusPriority[a.status] - statusPriority[b.status];
        });
      }
      
      setPendingTasks(tasks);
    } catch (error) {
      console.error("Error fetching pending tasks:", error);
      setPendingTasks([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTaskClick = (task: Task) => {
    navigate(task.url);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };
  
  const hasTasks = pendingTasks.length > 0;
  
  return (
    <Card className={`h-full w-full overflow-hidden ${hasTasks ? 'border-yellow-200' : 'border-green-200'}`}>
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800">{title}</h3>
          {hasTasks ? (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
        
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">Carregando tarefas...</p>
            </div>
          ) : hasTasks ? (
            <ul className="space-y-2">
              {pendingTasks.map(task => (
                <li 
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="p-2 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{task.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                      {task.status === 'overdue' ? 'Atrasado' : 
                       task.status === 'warning' ? 'Pendente' : 'OK'}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {task.dueDate.toLocaleDateString('pt-BR')}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">Não há tarefas pendentes.</p>
            </div>
          )}
        </div>
        
        {hasTasks && (
          <button 
            onClick={() => navigate(isComunicacao ? '/dashboard/comunicacao/criar-nota' : '/dashboard/comunicacao/responder')}
            className="mt-3 text-xs self-end px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded flex items-center"
          >
            Ver todas <ArrowRight className="h-3 w-3 ml-1" />
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTasksCard;
