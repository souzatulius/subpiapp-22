
import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface PendingItem {
  id: string;
  title: string;
  department: string;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
  type: 'note' | 'demand';
}

interface PendingActionsCardProps {
  id?: string;
  title?: string;
  notesToApprove?: number;
  responsesToDo?: number;
  isComunicacao?: boolean;
  userDepartmentId?: string;
}

const PendingActionsCard: React.FC<PendingActionsCardProps> = ({
  id,
  title = "Ações Pendentes",
  notesToApprove,
  responsesToDo,
  isComunicacao,
  userDepartmentId
}) => {
  // Mock data - in production, this would come from an API call
  const pendingItems: PendingItem[] = [
    {
      id: '1',
      title: 'Nota sobre obras na zona leste',
      department: 'Infraestrutura',
      deadline: new Date(2025, 3, 15),
      priority: 'high',
      type: 'note'
    },
    {
      id: '2',
      title: 'Demanda sobre segurança pública',
      department: 'Segurança',
      deadline: new Date(2025, 3, 16),
      priority: 'medium',
      type: 'demand'
    },
    {
      id: '3',
      title: 'Resposta para imprensa - evento cultural',
      department: 'Cultura',
      deadline: new Date(2025, 3, 14),
      priority: 'low',
      type: 'demand'
    },
    {
      id: '4',
      title: 'Nota oficial - novo programa educacional',
      department: 'Educação',
      deadline: new Date(2025, 3, 13),
      priority: 'high',
      type: 'note'
    }
  ];
  
  // Sort by deadline, with closest deadlines first
  const sortedItems = [...pendingItems].sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'note': return 'Nota';
      case 'demand': return 'Demanda';
      default: return 'Item';
    }
  };
  
  return (
    <div className="w-full h-full bg-gray-100 p-4 rounded-xl">
      <div className="flex justify-between mb-3 items-center">
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-3 overflow-auto max-h-[calc(100%-2rem)]">
        {sortedItems.map((item) => {
          const isOverdue = item.deadline < new Date();
          const formattedDate = format(item.deadline, 'dd/MM');
          
          return (
            <div 
              key={item.id}
              className="bg-white p-3 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                    <span className="text-xs text-gray-500">{item.department}</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-800 mt-1">
                    {item.title}
                  </h4>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                    {isOverdue ? (
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 mr-1" />
                    )}
                    <span className="text-xs">{formattedDate}</span>
                  </div>
                  
                  <div className="mt-1 flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)} mr-1`}></div>
                    <span className="text-xs">{getPriorityLabel(item.priority)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PendingActionsCard;
