
import React from 'react';
import { ESICProcesso, statusLabels, situacaoLabels } from '@/types/esic';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Eye, Edit, Trash2, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  // Format creation date
  const formattedDate = processo.criado_em 
    ? formatDistanceToNow(parseISO(processo.criado_em), { addSuffix: true, locale: pt }) 
    : '';

  // Format process date
  const formattedProcessDate = processo.data_processo 
    ? format(new Date(processo.data_processo), 'dd/MM/yyyy') 
    : '';
  
  // Status badge color
  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      'aberto': 'bg-green-100 text-green-800 hover:bg-green-200',
      'em_andamento': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'concluido': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'cancelado': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      'respondido': 'bg-teal-100 text-teal-800 hover:bg-teal-200'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  // Situação badge color
  const getSituacaoBadgeClass = (situacao: string) => {
    const situacaoMap: Record<string, string> = {
      'em_tramitacao': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      'concluido': 'bg-green-100 text-green-800 hover:bg-green-200',
      'cancelado': 'bg-red-100 text-red-800 hover:bg-red-200',
      'pendente': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    };
    return situacaoMap[situacao] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className={`rounded-full ${getStatusBadgeClass(processo.status)}`}>
              {statusLabels[processo.status as keyof typeof statusLabels] || processo.status}
            </Badge>
            <Badge variant="outline" className={`rounded-full ${getSituacaoBadgeClass(processo.situacao)}`}>
              {situacaoLabels[processo.situacao as keyof typeof situacaoLabels] || processo.situacao}
            </Badge>
            <span className="text-xs text-gray-500">
              Protocolo: {processo.protocolo}
            </span>
          </div>
          
          <h3 className="font-medium text-lg text-gray-800">{processo.assunto}</h3>
          
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span>
              Solicitante: {processo.solicitante || 'Não especificado'}
            </span>
            <span>
              Data: {formattedProcessDate}
            </span>
            <span className="text-gray-400">
              Criado {formattedDate}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          {onAddJustificativa && (
            <Button 
              size="icon" 
              variant="outline" 
              onClick={onAddJustificativa}
              title="Adicionar justificativa"
              className="rounded-full"
            >
              <FilePlus className="h-4 w-4" />
            </Button>
          )}
          
          {onViewClick && (
            <Button 
              size="icon" 
              variant="outline" 
              onClick={() => onViewClick(processo)}
              title="Visualizar"
              className="rounded-full"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          
          {onEditClick && (
            <Button 
              size="icon" 
              variant="outline" 
              onClick={() => onEditClick(processo)}
              title="Editar"
              className="rounded-full"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDeleteClick && (
            <Button 
              size="icon" 
              variant="outline" 
              onClick={() => onDeleteClick(processo)}
              title="Excluir"
              className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessoItem;
