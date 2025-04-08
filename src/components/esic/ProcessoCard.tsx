
import React from 'react';
import { Calendar, MoreVertical, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { ESICProcesso, statusLabels, situacaoLabels } from '@/types/esic';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProcessoCardProps {
  processo: ESICProcesso;
  onSelect: (processo: ESICProcesso) => void;
  onEdit: (processo: ESICProcesso) => void;
  onDelete: (id: string) => void;
}

const ProcessoCard: React.FC<ProcessoCardProps> = ({
  processo,
  onSelect,
  onEdit,
  onDelete,
}) => {
  // Status icon mapping
  const getStatusIcon = () => {
    switch (processo.status) {
      case 'concluido':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'aguardando_aprovacao':
      case 'aguardando_justificativa':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'novo_processo':
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  // Format date
  const formattedDate = processo.data_processo
    ? format(new Date(processo.data_processo), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : 'Data não informada';

  return (
    <Card 
      className="h-full hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(processo)}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(processo);
              }}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(processo.id);
                }}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex-1">
          <p className="font-medium text-gray-800 line-clamp-3 mb-3">{processo.texto}</p>
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{statusLabels[processo.status]}</span>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              {situacaoLabels[processo.situacao]}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessoCard;
