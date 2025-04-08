
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardList, AlertTriangle, Clock } from 'lucide-react';

export interface PendingActionsCardWrapperProps {
  className?: string;
  notesToApprove?: number;
  responsesToDo?: number;
  isComunicacao?: boolean;
  userDepartmentId?: string;
}

const PendingActionsCardWrapper: React.FC<PendingActionsCardWrapperProps> = ({ 
  className,
  notesToApprove = 0,
  responsesToDo = 0,
  isComunicacao = false,
  userDepartmentId = ''
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [overdueCount, setOverdueCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPendingTasks = async () => {
      setIsLoading(true);
      try {
        // Fetch pending demands
        const { data: demands, error: demandsError } = await supabase
          .from('demandas')
          .select('id, titulo, prazo_resposta, status')
          .in('status', ['pendente', 'em_andamento', 'aguardando_resposta'])
          .order('prazo_resposta', { ascending: true });
          
        if (demandsError) throw demandsError;
        
        // Fetch pending notes - using the correct table: notas_oficiais
        const { data: notes, error: notesError } = await supabase
          .from('notas_oficiais')
          .select('id, titulo, criado_em, status')
          .in('status', ['pendente', 'em_revisao', 'aprovacao_pendente'])
          .order('criado_em', { ascending: true });
          
        if (notesError) throw notesError;
        
        // Process demands data
        const demandTasks: Task[] = demands?.map((demand: any) => {
          const dueDate = new Date(demand.prazo_resposta);
          const today = new Date();
          const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          let status: "overdue" | "warning" | "ok" = "ok";
          if (diffDays < 0) {
            status = "overdue";
          } else if (diffDays <= 2) {
            status = "warning";
          }
          
          return {
            id: demand.id,
            title: demand.titulo,
            dueDate: dueDate,
            status: status,
            type: "demand",
            url: `/dashboard/comunicacao/responder-demanda?id=${demand.id}`
          };
        }) || [];
        
        // Process notes data - using default 3-day deadline
        const noteTasks: Task[] = notes?.map((note: any) => {
          const creationDate = new Date(note.criado_em);
          const dueDate = new Date(creationDate);
          dueDate.setDate(dueDate.getDate() + 3); // Default 3-day deadline
          
          const today = new Date();
          const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          let status: "overdue" | "warning" | "ok" = "ok";
          if (diffDays < 0) {
            status = "overdue";
          } else if (diffDays <= 2) {
            status = "warning";
          }
          
          return {
            id: note.id,
            title: note.titulo,
            dueDate: dueDate,
            status: status,
            type: "note",
            url: `/dashboard/comunicacao/notas/detalhe?id=${note.id}`
          };
        }) || [];
        
        // Combine and sort by due date
        const allTasks = [...demandTasks, ...noteTasks].sort((a, b) => 
          a.dueDate.getTime() - b.dueDate.getTime()
        );
        
        setPendingTasks(allTasks);
        setOverdueCount(allTasks.filter(task => task.status === "overdue").length);
      } catch (error) {
        console.error('Error fetching pending tasks:', error);
        setPendingTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPendingTasks();
  }, []);
  
  const getTaskStatusIcon = (status: "overdue" | "warning" | "ok") => {
    switch (status) {
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <ClipboardList className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const formatDueDate = (date: Date) => {
    const today = new Date();
    return formatDistance(date, today, { addSuffix: true, locale: ptBR });
  };
  
  const filteredTasks = activeTab === 'all' 
    ? pendingTasks 
    : activeTab === 'overdue'
      ? pendingTasks.filter(task => task.status === "overdue")
      : pendingTasks.filter(task => task.type === activeTab);
  
  const handleTaskClick = (url: string) => {
    navigate(url);
  };
  
  return (
    <Card className={`h-full shadow-md border border-gray-200 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Pendências e Prazos</span>
          {overdueCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              {overdueCount} atrasadas
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="demand">Demandas</TabsTrigger>
            <TabsTrigger value="note">Notas</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-36">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[225px] overflow-y-auto pr-1">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div 
                      key={`${task.type}-${task.id}`}
                      onClick={() => handleTaskClick(task.url)}
                      className="p-2 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {getTaskStatusIcon(task.status)}
                        </div>
                        <div className="ml-2 flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs ${
                              task.status === "overdue" 
                                ? "text-red-600" 
                                : task.status === "warning" 
                                ? "text-orange-600" 
                                : "text-gray-500"
                            }`}>
                              {formatDueDate(task.dueDate)}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {task.type === "demand" ? "Demanda" : "Nota"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">Nenhuma pendência encontrada</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PendingActionsCardWrapper;
