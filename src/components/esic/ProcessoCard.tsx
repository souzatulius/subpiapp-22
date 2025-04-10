
import React from 'react';
import { ESICProcesso, statusLabels, situacaoLabels } from '@/types/esic';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Eye, Edit, Trash2, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

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
  // Format creation date
  const formattedDate = processo.criado_em 
    ? formatDistanceToNow(parseISO(processo.criado_em), { addSuffix: true, locale: pt }) 
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
    <Card className="overflow-hidden transition-all hover:shadow-md rounded-xl">
      <CardContent className="p-4 pt-4">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className={`rounded-full ${getStatusBadgeClass(processo.status)}`}>
            {statusLabels[processo.status as keyof typeof statusLabels] || processo.status}
          </Badge>
          <Badge variant="outline" className={`rounded-full ${getSituacaoBadgeClass(processo.situacao)}`}>
            {situacaoLabels[processo.situacao as keyof typeof situacaoLabels] || processo.situacao}
          </Badge>
        </div>
        <h3 className="font-medium text-lg line-clamp-2 mb-2">{processo.assunto}</h3>
        <div className="text-sm text-gray-500">
          <p>Protocolo: {processo.protocolo}</p>
          <p>Solicitante: {processo.solicitante || 'Não especificado'}</p>
        </div>
        <div className="mt-3 text-xs text-gray-400">{formattedDate}</div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
        {onAddJustificativa && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onAddJustificativa}
            title="Adicionar justificativa"
            className="rounded-full h-8 w-8"
          >
            <FilePlus className="h-4 w-4" />
          </Button>
        )}
        
        {onViewClick && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onViewClick(processo)}
            title="Visualizar"
            className="rounded-full h-8 w-8"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        
        {onEditClick && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onEditClick(processo)}
            title="Editar"
            className="rounded-full h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        
        {onDeleteClick && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onDeleteClick(processo)}
            title="Excluir"
            className="rounded-full h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProcessoCard;
