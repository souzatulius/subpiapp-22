
import React from 'react';
import { Calendar, MoreVertical, AlertCircle, CheckCircle, Clock, FileText, Pencil, Trash2 } from 'lucide-react';
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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'aguardando_aprovacao':
      case 'aguardando_justificativa':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'novo_processo':
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  // Format date
  const formattedDate = processo.data_processo
    ? format(new Date(processo.data_processo), "dd/MM/yyyy", { locale: ptBR })
    : 'Data não informada';

  return (
    <Card 
      className="h-full hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(processo)}
    >
      <CardContent className="p-3 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 text-gray-500 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(processo);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 text-gray-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(processo.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          <p className="font-medium text-gray-800 line-clamp-3 text-sm">{processo.texto}</p>
        </div>
        
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              {getStatusIcon()}
              <span className="text-xs font-medium">{statusLabels[processo.status]}</span>
            </div>
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full">
              {situacaoLabels[processo.situacao]}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessoCard;
