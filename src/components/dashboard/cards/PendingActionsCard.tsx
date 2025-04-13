
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, MessageSquare, AlertCircle } from 'lucide-react';

interface PendingActionsCardProps {
  id?: string;
  title?: string;
  notesToApprove?: number;
  responsesToDo?: number;
  isComunicacao?: boolean;
  userDepartmentId?: string;
}

const PendingActionsCard: React.FC<PendingActionsCardProps> = ({
  id = 'acoes-pendentes',
  title = 'Ações Pendentes',
  notesToApprove = 3,
  responsesToDo = 5,
  isComunicacao = true,
  userDepartmentId = ''
}) => {
  const navigate = useNavigate();

  const pendingActions = [
    {
      name: 'Notas para aprovar',
      count: notesToApprove,
      icon: <FileText className="h-4 w-4" />,
      path: '/dashboard/comunicacao/aprovar-nota'
    },
    {
      name: 'Demandas para responder',
      count: responsesToDo,
      icon: <MessageSquare className="h-4 w-4" />,
      path: '/dashboard/comunicacao/responder'
    },
    {
      name: 'Comunicados próximos',
      count: 2,
      icon: <Calendar className="h-4 w-4" />,
      path: '/dashboard/comunicacao/comunicados'
    }
  ];

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">{title}</h3>
        
        {(notesToApprove > 0 || responsesToDo > 0) && (
          <Badge variant="destructive" className="rounded-full">
            {notesToApprove + responsesToDo} pendentes
          </Badge>
        )}
      </div>

      {pendingActions.some(action => action.count > 0) ? (
        <div className="space-y-3">
          {pendingActions.map((action, index) => (
            action.count > 0 && (
              <div 
                key={index} 
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleActionClick(action.path)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-full bg-blue-100 text-blue-700">
                      {action.icon}
                    </span>
                    <span className="text-sm font-medium">{action.name}</span>
                  </div>
                  <Badge variant="outline" className="rounded-full bg-white">
                    {action.count}
                  </Badge>
                </div>
              </div>
            )
          ))}
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/dashboard/comunicacao/tarefas')}
            >
              Ver todas as pendências
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100%-36px)] space-y-3 text-center">
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-gray-700 font-medium">Sem pendências</p>
            <p className="text-gray-500 text-sm">Você está em dia com suas tarefas</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingActionsCard;
