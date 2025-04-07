
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
import { Eye, Trash, FileText, Edit, Check, X } from 'lucide-react';
import { DemandaStatusBadge } from '@/components/ui/status-badge';
import { Demand } from '@/hooks/consultar-demandas';
import { LoadingState } from './LoadingState';
import { getPriorityColor } from '@/utils/priorityUtils';
import { Badge } from '@/components/ui/badge';
import { NotaOficial } from '@/types/nota';
import { useNavigate } from 'react-router-dom';

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
  onCreateNote?: (demand: Demand) => void;
  onViewNote?: (nota: NotaOficial) => void;
  onEditNote?: (nota: NotaOficial) => void;
  onApproveNote?: (nota: NotaOficial) => void;
  onRejectNote?: (nota: NotaOficial) => void;
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
  isLoading = false,
  onCreateNote,
  onViewNote,
  onEditNote,
  onApproveNote,
  onRejectNote
}) => {
  const navigate = useNavigate();

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
  
  const handleCreateNote = (demand: Demand) => {
    if (onCreateNote) {
      onCreateNote(demand);
    } else {
      // Default navigation to create note page with demand ID
      navigate(`/dashboard/comunicacao/criar-nota?demandaId=${demand.id}`);
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
    if (demand.problema?.coordenacao?.descricao) {
      return demand.problema.coordenacao.descricao;
    }
    
    // Try to get the coordination from area_coordenacao
    if (demand.area_coordenacao?.descricao) {
      return demand.area_coordenacao.descricao;
    }
    
    return 'Não informada';
  };
  
  const hasNota = (demand: Demand) => {
    return demand.notas && demand.notas.length > 0;
  };
  
  const hasResponsta = (demand: Demand) => {
    return demand.resposta && demand.resposta.texto;
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Coordenação</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demandas.map((demand) => {
            const priorityInfo = formatPriority(demand.prioridade);
            const coordination = getCoordination(demand);
            const demandHasNota = hasNota(demand);
            const demandHasResponsta = hasResponsta(demand);
            const firstNota = demandHasNota && demand.notas ? demand.notas[0] : null;

            return (
              <TableRow key={demand.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{demand.titulo}</TableCell>
                <TableCell>
                  <DemandaStatusBadge status={demand.status} size="sm" />
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
                  {demand.prazo_resposta ? 
                    format(new Date(demand.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR }) : 
                    'N/A'
                  }
                </TableCell>
                <TableCell>
                  {demandHasNota ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <FileText className="h-3 w-3 mr-1" /> Sim
                    </Badge>
                  ) : (
                    demandHasResponsta ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        onClick={() => handleCreateNote(demand)}
                      >
                        <FileText className="h-3 w-3 mr-1" /> Gerar Nota
                      </Button>
                    ) : (
                      'Não'
                    )
                  )}
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
                    
                    {demandHasNota && firstNota && onViewNote && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onViewNote(firstNota as any)}
                        title="Visualizar Nota"
                        className="text-blue-600"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {demandHasNota && firstNota && onEditNote && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEditNote(firstNota as any)}
                        title="Editar Nota"
                        className="text-amber-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {demandHasNota && firstNota && onApproveNote && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onApproveNote(firstNota as any)}
                        title="Aprovar Nota"
                        className="text-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {demandHasNota && firstNota && onRejectNote && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onRejectNote(firstNota as any)}
                        title="Recusar Nota"
                        className="text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    
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
