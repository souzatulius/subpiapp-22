
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, PenLine, Trash2 } from 'lucide-react';
import { ESICProcesso } from '@/types/esic';

interface ProcessoItemProps {
  processo: ESICProcesso;
  onViewClick?: (processo: ESICProcesso) => void;
  onEditClick?: (processo: ESICProcesso) => void;
  onDeleteClick?: (processo: ESICProcesso) => void;
  onAddJustificativa?: (processo: ESICProcesso) => void;
}

const ProcessoItem: React.FC<ProcessoItemProps> = ({
  processo,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onAddJustificativa
}) => {
  // Function to format status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-green-500';
      case 'em_andamento': return 'bg-blue-500';
      case 'concluido': return 'bg-gray-500';
      case 'cancelado': return 'bg-red-500';
      case 'novo_processo': return 'bg-purple-500';
      case 'aguardando_justificativa': return 'bg-yellow-500';
      case 'aguardando_aprovacao': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aberto': return 'Aberto';
      case 'em_andamento': return 'Em andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      case 'novo_processo': return 'Novo Processo';
      case 'aguardando_justificativa': return 'Aguardando Justificativa';
      case 'aguardando_aprovacao': return 'Aguardando Aprovação';
      default: return status;
    }
  };

  const handleAddJustificativa = () => {
    if (onAddJustificativa) {
      onAddJustificativa(processo);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{processo.assunto}</h3>
          <div className="text-gray-500 text-sm">
            <span>Protocolo: {processo.protocolo}</span>
            {processo.solicitante && (
              <span className="ml-4">Solicitante: {processo.solicitante}</span>
            )}
          </div>
        </div>
        <div className="flex mt-2 md:mt-0">
          <Badge className={getStatusColor(processo.status)}>
            {getStatusLabel(processo.status)}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row mt-2 space-y-2 sm:space-y-0 sm:space-x-2 justify-between items-start sm:items-center">
        <div className="text-gray-500 text-sm">
          Criado em {format(new Date(processo.criado_em), 'dd/MM/yyyy')}
          {processo.autor_nome && <span> por {processo.autor_nome}</span>}
        </div>
        
        <div className="flex space-x-2">
          {onViewClick && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewClick(processo)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Visualizar
            </Button>
          )}
          
          {onAddJustificativa && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleAddJustificativa}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Justificativa
            </Button>
          )}
          
          {onEditClick && processo.status !== 'concluido' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEditClick(processo)}
            >
              <PenLine className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          
          {onDeleteClick && processo.status !== 'concluido' && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDeleteClick(processo)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessoItem;
