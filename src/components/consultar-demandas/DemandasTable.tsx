
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Demand } from '@/hooks/consultar-demandas';
import { LoadingState } from './LoadingState';

interface DemandasTableProps {
  demandas: Demand[];
  onViewDemand?: (demand: Demand) => void;
  onRespondDemand?: (demand: Demand) => void;
  onDeleteClick?: (demand: Demand) => void;
  onEdit?: (id: string) => void;
  onDelete?: (demand: Demand) => void;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  isAdmin?: boolean;
  showDeleteOption?: boolean;
  isLoading?: boolean;
}

const DemandasTable: React.FC<DemandasTableProps> = ({
  demandas,
  onViewDemand,
  onRespondDemand,
  onDeleteClick,
  onEdit,
  onDelete,
  totalCount,
  page,
  pageSize,
  setPage,
  setPageSize,
  isAdmin,
  showDeleteOption = false,
  isLoading = false
}) => {
  const handleViewOrEdit = (demand: Demand) => {
    if (onViewDemand) {
      onViewDemand(demand);
    } else if (onEdit) {
      onEdit(demand.id);
    }
  };

  const handleDelete = (demand: Demand) => {
    if (onDeleteClick) {
      onDeleteClick(demand);
    } else if (onDelete) {
      onDelete(demand);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (demandas.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md border-dashed">
        <p className="text-gray-500">Nenhuma demanda encontrada.</p>
      </div>
    );
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string, class: string }> = {
      'pendente': { label: 'Pendente', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'em_andamento': { label: 'Em andamento', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'respondida': { label: 'Respondida', class: 'bg-green-100 text-green-800 border-green-200' },
      'concluida': { label: 'Concluída', class: 'bg-green-100 text-green-800 border-green-200' },
      'arquivada': { label: 'Arquivada', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'cancelada': { label: 'Cancelada', class: 'bg-red-100 text-red-800 border-red-200' },
    };

    return statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
  };

  const formatPriority = (priority: string) => {
    const priorityMap: Record<string, { label: string, class: string }> = {
      'alta': { label: 'Alta', class: 'bg-red-100 text-red-800 border-red-200' },
      'media': { label: 'Média', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'baixa': { label: 'Baixa', class: 'bg-green-100 text-green-800 border-green-200' },
    };

    return priorityMap[priority] || { label: priority, class: 'bg-gray-100 text-gray-800' };
  };

  const getCoordination = (demand: Demand) => {
    // Get coordination information from the problem-related data
    if (demand.problema?.supervisao_tecnica?.coordenacao_id) {
      return 'Não informada';
    }
    
    // Try to get the coordination from area_coordenacao
    if (demand.area_coordenacao?.descricao) {
      return demand.area_coordenacao.descricao;
    }
    
    return 'Não informada';
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Coordenação</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demandas.map((demand) => {
            const statusInfo = formatStatus(demand.status);
            const priorityInfo = formatPriority(demand.prioridade);
            const coordination = getCoordination(demand);

            return (
              <TableRow key={demand.id}>
                <TableCell className="font-medium">{demand.titulo}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${statusInfo.class} rounded-full`}
                  >
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${priorityInfo.class} rounded-full`}
                  >
                    {priorityInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>{coordination}</TableCell>
                <TableCell>
                  {demand.horario_publicacao ? 
                    format(new Date(demand.horario_publicacao), 'dd/MM/yyyy', { locale: ptBR }) : 
                    'N/A'
                  }
                </TableCell>
                <TableCell>
                  {demand.prazo_resposta ? 
                    format(new Date(demand.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR }) : 
                    'N/A'
                  }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewOrEdit(demand)}
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {(showDeleteOption || isAdmin) && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(demand)}
                        className="text-red-600 hover:text-red-700"
                        title="Excluir"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DemandasTable;
