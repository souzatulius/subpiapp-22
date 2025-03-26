import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, MessageSquare, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Demand } from '@/hooks/consultar-demandas';

interface DemandasTableProps {
  demandas: Demand[];
  isLoading: boolean;
  onViewDemand: (demand: Demand) => void;
  onRespondDemand: (demand: Demand) => void;
  onDeleteClick: (demand: Demand) => void;
  showDeleteOption?: boolean;
}

const DemandasTable: React.FC<DemandasTableProps> = ({ 
  demandas, 
  isLoading, 
  onViewDemand, 
  onRespondDemand, 
  onDeleteClick,
  showDeleteOption = true
}) => {
  const renderStatusBadge = (status: string) => {
    let colorClass = '';
    let statusText = status;
    
    switch (status) {
      case 'pendente':
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        statusText = 'Pendente';
        break;
      case 'em_andamento':
        colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
        statusText = 'Em andamento';
        break;
      case 'respondida':
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        statusText = 'Respondida';
        break;
      case 'concluida':
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        statusText = 'Concluída';
        break;
      case 'arquivada':
        colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
        statusText = 'Arquivada';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
        statusText = status;
    }
    
    return (
      <Badge variant="outline" className={`${colorClass}`}>
        {statusText}
      </Badge>
    );
  };

  const renderPriorityBadge = (prioridade: string) => {
    let colorClass = '';
    let priorityText = prioridade;
    
    switch (prioridade) {
      case 'alta':
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        priorityText = 'Alta';
        break;
      case 'media':
        colorClass = 'bg-orange-100 text-orange-800 border-orange-200';
        priorityText = 'Média';
        break;
      case 'baixa':
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        priorityText = 'Baixa';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
        priorityText = prioridade;
    }
    
    return (
      <Badge variant="outline" className={`${colorClass}`}>
        {priorityText}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
        <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
        <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  if (demandas.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg mt-4">
        <p className="text-gray-500">Nenhuma demanda encontrada</p>
      </div>
    );
  }

  return (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demandas.map((demanda) => (
            <TableRow key={demanda.id}>
              <TableCell className="font-medium">{demanda.titulo}</TableCell>
              <TableCell>{renderStatusBadge(demanda.status)}</TableCell>
              <TableCell>{renderPriorityBadge(demanda.prioridade)}</TableCell>
              <TableCell>{demanda.area_coordenacao?.descricao || 'Não definida'}</TableCell>
              <TableCell>
                {demanda.horario_publicacao ? 
                  format(new Date(demanda.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR }) : 
                  'N/A'}
              </TableCell>
              <TableCell>
                {demanda.prazo_resposta ? 
                  format(new Date(demanda.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR }) : 
                  'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDemand(demanda)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Visualizar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRespondDemand(demanda)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Responder</span>
                    </DropdownMenuItem>
                    {showDeleteOption && (
                      <DropdownMenuItem onClick={() => onDeleteClick(demanda)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Ocultar</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DemandasTable;
