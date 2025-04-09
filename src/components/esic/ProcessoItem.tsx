
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2, MessageCircleMore } from 'lucide-react';
import { ESICProcesso, statusLabels } from '@/types/esic';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProcessoItemProps {
  processo: ESICProcesso;
  onViewClick?: (processo: ESICProcesso) => void;
  onEditClick?: (processo: ESICProcesso) => void;
  onDeleteClick?: (processo: ESICProcesso) => void;
  onAddJustificativa?: () => void;
}

const ProcessoItem: React.FC<ProcessoItemProps> = ({
  processo,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onAddJustificativa
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'aguardando_justificativa':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'aguardando_aprovacao':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'concluido':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'aberto':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'em_andamento':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleViewClick = () => {
    onViewClick && onViewClick(processo);
  };

  const handleEditClick = () => {
    onEditClick && onEditClick(processo);
  };

  const handleDeleteClick = () => {
    onDeleteClick && onDeleteClick(processo);
  };

  const handleJustificativaClick = () => {
    onAddJustificativa && onAddJustificativa();
  };

  const dataProcesso = processo.data_processo 
    ? format(new Date(processo.data_processo), 'dd/MM/yyyy', { locale: ptBR }) 
    : 'Sem data';

  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 rounded-xl transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          <div className="space-y-1 w-full md:w-auto md:flex-1">
            <div className="flex items-center">
              <h3 className="font-medium text-lg">{processo.assunto}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className="font-medium">Protocolo:</span>
                <span>{processo.protocolo}</span>
              </div>
              
              {processo.solicitante && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Solicitante:</span>
                  <span>{processo.solicitante}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span className="font-medium">Data:</span>
                <span>{dataProcesso}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <Badge className={cn("rounded-xl", getStatusColor(processo.status))}>
              {statusLabels[processo.status] || processo.status}
            </Badge>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl" 
                      onClick={handleJustificativaClick}
                    >
                      <MessageCircleMore className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inserir justificativa</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl" 
                onClick={handleViewClick}
                title="Visualizar"
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl" 
                onClick={handleEditClick}
                title="Editar"
              >
                <FileEdit className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl text-red-500 hover:text-red-600" 
                onClick={handleDeleteClick}
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessoItem;
