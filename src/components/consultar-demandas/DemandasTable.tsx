
import React from 'react';
import { Button } from '@/components/ui/button';
import { Demand } from '@/hooks/consultar-demandas/types';
import { format } from 'date-fns';
import { Eye, Trash2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DemandaStatusBadge } from '@/components/ui/status-badge';
import { Card } from '@/components/ui/card';

export interface DemandasTableProps {
  demandas: Demand[];
  onViewDemand: (demand: Demand) => void;
  onDelete?: (demand: Demand) => void;
  onViewNota?: (demandId: string) => void;
  totalCount: number;
  page: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  isAdmin?: boolean;
  isLoading?: boolean;
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
  isAdmin = false,
  isLoading = false,
}) => {
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(1); // Reset to the first page when changing page size
  };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDemandas = demandas.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <Card className="space-y-4 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentDemandas.map((demanda) => (
              <tr key={demanda.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {demanda.titulo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {demanda.horario_publicacao ? 
                    format(new Date(demanda.horario_publicacao), 'dd/MM/yyyy') : 
                    'Data não disponível'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <DemandaStatusBadge status={demanda.status} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Badge variant="outline" className={`rounded-full ${
                    demanda.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                    demanda.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {demanda.prioridade === 'alta' ? 'Alta' :
                     demanda.prioridade === 'media' ? 'Média' : 'Baixa'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="icon" onClick={() => onViewDemand(demanda)} className="rounded-full">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {isAdmin && onDelete && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(demanda)} className="rounded-full">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {onViewNota && (
                    <Button variant="ghost" size="icon" onClick={() => onViewNota(demanda.id)} className="rounded-full">
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-white px-6 py-3">
        <div className="flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
            Itens por página:
          </label>
          <select
            id="pageSize"
            className="block w-20 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="rounded-xl"
          >
            Anterior
          </Button>
          <span className="text-sm font-medium text-gray-700">
            Página {page} de {Math.ceil(totalCount / pageSize)}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page * pageSize >= totalCount}
            className="rounded-xl"
          >
            Próximo
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DemandasTable;
