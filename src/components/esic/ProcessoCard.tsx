
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2, MessageCircleMore } from 'lucide-react';
import { ESICProcesso, statusLabels } from '@/types/esic';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ProcessoCardProps {
  processo: ESICProcesso;
  onViewClick?: (processo: ESICProcesso) => void;
  onEditClick?: (processo: ESICProcesso) => void;
  onDeleteClick?: (processo: ESICProcesso) => void;
  onAddJustificativa?: () => void;
}

const ProcessoCard: React.FC<ProcessoCardProps> = ({
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
    <Card className="overflow-hidden border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-medium line-clamp-2">
          {processo.assunto}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Protocolo:</span>
            <span className="font-medium">{processo.protocolo}</span>
          </div>
          
          {processo.solicitante && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Solicitante:</span>
              <span className="font-medium">{processo.solicitante}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Data:</span>
            <span>{dataProcesso}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <Badge className={cn("rounded-xl font-normal", getStatusColor(processo.status))}>
              {statusLabels[processo.status] || processo.status}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 p-4 pt-2 bg-gray-50">
        {onAddJustificativa && (
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl" 
            onClick={handleJustificativaClick}
            title="Adicionar Justificativa"
          >
            <MessageCircleMore className="h-4 w-4" />
          </Button>
        )}
        
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
      </CardFooter>
    </Card>
  );
};

export default ProcessoCard;
