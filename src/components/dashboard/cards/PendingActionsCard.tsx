
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, ArrowRight } from 'lucide-react';

interface PendingActionsCardProps {
  showDetailedList?: boolean;
  id?: string;
  title?: string;
  notesToApprove?: number;
  responsesToDo?: number;
  isComunicacao?: boolean;
  userDepartmentId?: string;
}

// Sample data for pending actions
const pendingActions = [
  { id: 1, title: 'Responder demanda da imprensa', deadline: '4h restantes', type: 'Imprensa', priority: 'high' },
  { id: 2, title: 'Revisar nota oficial', deadline: '1 dia restante', type: 'Nota', priority: 'medium' },
  { id: 3, title: 'Aprovação de release', deadline: '2 dias restantes', type: 'Release', priority: 'low' },
  { id: 4, title: 'Atualizar site institucional', deadline: '3 dias restantes', type: 'Site', priority: 'medium' },
];

const PendingActionsCard: React.FC<PendingActionsCardProps> = ({ 
  showDetailedList = false,
  id,
  title = "Ações Pendentes",
  notesToApprove = 0,
  responsesToDo = 0,
  isComunicacao = false,
  userDepartmentId = ""
}) => {
  // Calculate total actions from notes and responses
  const totalActions = notesToApprove + responsesToDo || pendingActions.length;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{title}</span>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {totalActions}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {showDetailedList ? (
          <div className="space-y-3">
            {pendingActions.map((action) => (
              <div 
                key={action.id} 
                className="bg-gray-50 p-3 rounded-xl border-l-4 border-l-solid hover:shadow-sm transition-all"
                style={{ 
                  borderLeftColor: 
                    action.priority === 'high' ? '#ef4444' : 
                    action.priority === 'medium' ? '#f59e0b' : '#22c55e'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">{action.title}</h4>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{action.deadline}</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-blue-50 text-blue-700 border-blue-100"
                  >
                    {action.type}
                  </Badge>
                </div>
              </div>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full text-sm text-gray-600 mt-2 hover:bg-gray-100"
            >
              Ver todas as ações
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingActions.slice(0, 3).map((action) => (
              <div 
                key={action.id} 
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <div className="flex items-center">
                  <div 
                    className="h-2 w-2 rounded-full mr-2"
                    style={{ 
                      backgroundColor: 
                        action.priority === 'high' ? '#ef4444' : 
                        action.priority === 'medium' ? '#f59e0b' : '#22c55e'
                    }}
                  />
                  <span className="text-sm truncate max-w-[180px]">{action.title}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-gray-50"
                >
                  {action.type}
                </Badge>
              </div>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full text-xs text-gray-600 mt-1"
            >
              <FileText className="h-3 w-3 mr-1" />
              Ver todas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingActionsCard;
