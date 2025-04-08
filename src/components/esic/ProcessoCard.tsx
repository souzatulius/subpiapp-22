
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, AlertCircle, Clock } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProcessoCardProps {
  processo: any;
  onDeleteClick: () => void;
}

const ProcessoCard: React.FC<ProcessoCardProps> = ({ processo, onDeleteClick }) => {
  const navigate = useNavigate();
  
  const handleViewClick = () => {
    navigate(`/esic/view/${processo.id}`);
  };
  
  const handleEditClick = () => {
    navigate(`/esic/edit/${processo.id}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em análise':
        return 'bg-blue-100 text-blue-800';
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Aguardando complemento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Negado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const isPrazoExpired = processo.prazo ? isPast(new Date(processo.prazo)) : false;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(processo.status)}`}>
            {processo.status}
          </span>
          <div className="flex items-center">
            {isPrazoExpired && processo.status !== 'Concluído' && (
              <span className="text-xs flex items-center text-red-600 mr-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                Atrasado
              </span>
            )}
            <span className="text-xs flex items-center text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {processo.prazo 
                ? format(new Date(processo.prazo), 'dd/MM/yyyy', { locale: ptBR })
                : 'Sem prazo'}
            </span>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{processo.titulo}</h3>
        
        <div className="text-xs text-gray-500 mb-2">
          <span className="font-medium">{processo.numero_processo}</span>
          {processo.categoria && (
            <span className="ml-2">• {processo.categoria}</span>
          )}
        </div>
        
        <div className="text-sm text-gray-600 mb-4 line-clamp-2">
          <span className="font-medium">Solicitante:</span> {processo.solicitante}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {processo.created_at && format(new Date(processo.created_at), 'dd MMM yyyy', { locale: ptBR })}
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleViewClick}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
              onClick={handleEditClick}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
              onClick={onDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProcessoCard;
