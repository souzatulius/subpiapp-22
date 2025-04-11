
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface DemandasTableProps {
  demandas: any[];
  onViewDemand: (id: string) => void;
  onDelete?: (id: string, title: string) => void; // Make onDelete optional
  onViewNota: (demandId: string) => void;
  totalCount: number;
  page: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  isAdmin: boolean;
  isLoading?: boolean; // Added isLoading property as optional
}

const DemandasTable: React.FC<DemandasTableProps> = ({
  demandas,
  onViewDemand,
  onDelete,
  onViewNota,
  totalCount,
  page,
  pageSize,
  setPage,
  setPageSize,
  isAdmin,
  isLoading = false // Default to false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluido':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'aguardando-nota':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (e) {
      return '-';
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Título</TableHead>
            <TableHead className="w-[100px]">Origem</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[140px]">Prazo</TableHead>
            <TableHead className="w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demandas && demandas.length > 0 ? (
            demandas.map((demanda) => (
              <TableRow key={demanda.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-gray-800">{demanda.titulo}</span>
                    <span className="text-xs text-gray-500">{demanda.problema_descricao}</span>
                  </div>
                </TableCell>
                <TableCell>{demanda.origem_descricao}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(demanda.status)}`}>
                    {demanda.status === 'em-andamento' ? 'Em andamento' : 
                     demanda.status === 'aguardando-nota' ? 'Aguardando nota' : 
                     demanda.status === 'concluido' ? 'Concluída' : 
                     demanda.status === 'pendente' ? 'Pendente' : 
                     demanda.status === 'cancelado' ? 'Cancelada' : 
                     demanda.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(demanda.prazo_resposta)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onViewDemand(demanda.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                      onClick={() => onViewNota(demanda.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    
                    {isAdmin && onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => onDelete(demanda.id, demanda.titulo)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Nenhuma demanda encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-gray-500">
          Mostrando {demandas.length} de {totalCount} demandas
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {page} de {Math.ceil(totalCount / pageSize) || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => (prev * pageSize < totalCount ? prev + 1 : prev))}
            disabled={page * pageSize >= totalCount}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemandasTable;
