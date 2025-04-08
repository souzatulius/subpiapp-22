
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
import { ChevronLeft, ChevronRight, Eye, Trash2, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Demand } from '@/hooks/consultar-demandas/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DemandasTableProps {
  demandas: Demand[];
  onViewDemand: (demand: Demand) => void;
  onDelete?: (demand: Demand) => void;
  onRespond?: (demand: Demand) => void;
  isAdmin?: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  isLoading?: boolean;
}

const DemandasTable: React.FC<DemandasTableProps> = ({
  demandas,
  onViewDemand,
  onDelete,
  onRespond,
  isAdmin = false,
  totalCount,
  page,
  pageSize,
  setPage,
  setPageSize,
  isLoading = false
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
      case 'pendente_resposta':
        return <Badge className="bg-yellow-400 hover:bg-yellow-500">Pendente</Badge>;
      case 'em_andamento':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Em andamento</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Título</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Prioridade</TableHead>
              <TableHead className="font-medium">Data</TableHead>
              <TableHead className="font-medium">Prazo</TableHead>
              <TableHead className="font-medium text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : demandas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Nenhuma demanda encontrada.
                </TableCell>
              </TableRow>
            ) : (
              demandas.map((demanda) => (
                <TableRow key={demanda.id}>
                  <TableCell className="font-medium truncate max-w-[200px]">
                    {demanda.titulo}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(demanda.status)}
                  </TableCell>
                  <TableCell className="capitalize">
                    <Badge variant="outline" className={`
                      ${demanda.prioridade === 'alta' ? 'border-red-500 text-red-700' : ''}
                      ${demanda.prioridade === 'media' ? 'border-yellow-500 text-yellow-700' : ''}
                      ${demanda.prioridade === 'baixa' ? 'border-green-500 text-green-700' : ''}
                    `}>
                      {demanda.prioridade}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(demanda.horario_publicacao)}</TableCell>
                  <TableCell>{formatDate(demanda.prazo_resposta)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDemand(demanda)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {onRespond && demanda.status === 'pendente_resposta' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRespond(demanda)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {isAdmin && onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(demanda)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-gray-500">
          Mostrando {Math.min(totalCount, (page - 1) * pageSize + 1)}-{Math.min(page * pageSize, totalCount)} de {totalCount} resultados
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Página {page} de {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemandasTable;
