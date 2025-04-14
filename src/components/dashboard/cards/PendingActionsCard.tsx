
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface PendingActionsProps {
  id?: string;
  title?: string;
  notesToApprove?: number;
  responsesToDo?: number;
  isComunicacao?: boolean;
  userDepartmentId?: string;
  showDetailedList?: boolean;
}

const PendingActionsCard: React.FC<PendingActionsProps> = ({
  id = 'pending-actions',
  title = 'Ações Pendentes',
  notesToApprove = 0,
  responsesToDo = 0,
  isComunicacao = false,
  userDepartmentId = '',
  showDetailedList = false
}) => {
  const navigate = useNavigate();
  
  const totalActions = notesToApprove + responsesToDo;
  
  // Sample data for detailed list view
  const detailedActions = [
    { id: '1', title: 'Responder demanda de imprensa', type: 'demanda', priority: 'alta', dueDate: '2025-04-17', department: 'Comunicação' },
    { id: '2', title: 'Aprovar nota sobre obras', type: 'nota', priority: 'média', dueDate: '2025-04-18', department: 'Infraestrutura' },
    { id: '3', title: 'Responder solicitação de dados', type: 'demanda', priority: 'baixa', dueDate: '2025-04-20', department: 'Planejamento' },
  ];
  
  const handleCardClick = () => {
    if (notesToApprove > 0) {
      navigate('/dashboard/comunicacao/aprovar-nota');
    } else {
      navigate('/dashboard/comunicacao/responder-demanda');
    }
  };
  
  // Define priority badge colors
  const getPriorityBadge = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'alta':
        return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">Alta</Badge>;
      case 'média':
        return <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">Média</Badge>;
      case 'baixa':
        return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Baixa</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">{priority}</Badge>;
    }
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BellRing className="mr-2 h-5 w-5 text-orange-500" />
          {title}
          {totalActions > 0 && (
            <Badge className="ml-2 bg-orange-100 text-orange-800 hover:bg-orange-200">
              {totalActions}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        {totalActions === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-[180px] text-gray-500">
            <div className="bg-gray-100 p-3 rounded-full mb-3">
              <BellRing className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-medium">Sem ações pendentes</p>
            <p className="text-sm">Você está com tudo em dia!</p>
          </div>
        ) : showDetailedList ? (
          <div className="space-y-3">
            {detailedActions.map(action => (
              <div 
                key={action.id}
                className="p-3 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-sm">{action.title}</div>
                  {getPriorityBadge(action.priority)}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{new Date(action.dueDate).toLocaleDateString()}</span>
                  </div>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{action.department}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {notesToApprove > 0 && (
              <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer" onClick={() => navigate('/dashboard/comunicacao/aprovar-nota')}>
                <div>
                  <p className="font-medium">Notas para aprovar</p>
                  <p className="text-sm text-gray-500">
                    {isComunicacao
                      ? 'Revisão de notas oficiais'
                      : `De ${userDepartmentId || 'sua coordenação'}`}
                  </p>
                </div>
                <div className="flex items-center">
                  <Badge className="mr-2 bg-blue-100 text-blue-800">{notesToApprove}</Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
            
            {responsesToDo > 0 && (
              <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer" onClick={() => navigate('/dashboard/comunicacao/responder-demanda')}>
                <div>
                  <p className="font-medium">Demandas para responder</p>
                  <p className="text-sm text-gray-500">
                    {isComunicacao
                      ? 'Demandas aguardando resposta'
                      : `Solicitadas à ${userDepartmentId || 'sua coordenação'}`}
                  </p>
                </div>
                <div className="flex items-center">
                  <Badge className="mr-2 bg-orange-100 text-orange-800">{responsesToDo}</Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              className="w-full justify-center text-sm mt-2"
              onClick={handleCardClick}
            >
              Ver todas as pendências
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingActionsCard;
