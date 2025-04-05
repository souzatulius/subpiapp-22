
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, FileDown, Trash, Check, X } from 'lucide-react';
import { NotaOficial } from '@/types/nota';
import { NotaStatusBadge } from '@/components/ui/status-badge';

interface NotasTableProps {
  notas: NotaOficial[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  onViewNota?: (nota: NotaOficial) => void;
  onEditNota?: (id: string) => void;
  onDeleteNota?: (nota: NotaOficial) => void;
  onExportPDF?: (nota: NotaOficial) => void;
  onApproveNota?: (notaId: string) => Promise<void>;
  onRejectNota?: (notaId: string) => Promise<void>;
  exporting?: boolean;
  deleteLoading?: boolean;
  isAdmin?: boolean;
}

const NotasTable: React.FC<NotasTableProps> = ({
  notas,
  loading,
  formatDate,
  onViewNota,
  onEditNota,
  onDeleteNota,
  onExportPDF,
  onApproveNota,
  onRejectNota,
  exporting = false,
  deleteLoading = false,
  isAdmin = false
}) => {
  if (loading) {
    return (
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                <TableCell><div className="h-4 bg-gray-200 rounded w-3/4"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-20"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-24"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-32"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-24"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded w-24"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (notas.length === 0) {
    return <div className="text-center py-8">Nenhuma nota encontrada.</div>;
  }

  // Function to get the correct coordination description
  const getAreaDescription = (nota: NotaOficial): string => {
    // Try to get the area from different possible locations in the nota structure
    if (nota.supervisao_tecnica?.descricao) {
      return nota.supervisao_tecnica.descricao;
    }
    
    if (nota.problema?.coordenacao?.descricao) {
      return nota.problema.coordenacao.descricao;
    }
    
    // For backwards compatibility or alternative data structure
    if ((nota as any).coordenacao?.descricao) {
      return (nota as any).coordenacao.descricao;
    }
    
    if (nota.area_coordenacao?.descricao) {
      return nota.area_coordenacao.descricao;
    }
    
    return 'Área não especificada';
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas.map((nota) => (
            <TableRow key={nota.id}>
              <TableCell className="font-medium">{nota.titulo}</TableCell>
              <TableCell>
                <NotaStatusBadge status={nota.status} size="sm" />
              </TableCell>
              <TableCell>{nota.autor?.nome_completo || 'Autor desconhecido'}</TableCell>
              <TableCell>{getAreaDescription(nota)}</TableCell>
              <TableCell>{formatDate(nota.criado_em || nota.created_at || "")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onViewNota && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewNota(nota)}
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onExportPDF && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onExportPDF(nota)}
                      title="Exportar PDF"
                      disabled={exporting}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && nota.status === 'pendente' && onApproveNota && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApproveNota(nota.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      title="Aprovar"
                      disabled={deleteLoading}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && nota.status === 'pendente' && onRejectNota && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRejectNota(nota.id)}
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      title="Rejeitar"
                      disabled={deleteLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {onEditNota && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditNota(nota.id)}
                      title="Editar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteNota && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteNota(nota)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Excluir"
                      disabled={deleteLoading}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotasTable;
