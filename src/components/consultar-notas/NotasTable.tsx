
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
import { Eye, FileDown, Trash } from 'lucide-react';
import { NotaOficial } from '@/types/nota';
import { NotaStatusBadge } from '@/components/ui/status-badge';

interface NotasTableProps {
  notas: NotaOficial[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  onViewNota: (nota: NotaOficial) => void;
  onExportPDF: (nota: NotaOficial) => void;
  onDeleteClick: (nota: NotaOficial) => void;
  exporting: boolean;
  deleteLoading: boolean;
}

const NotasTable: React.FC<NotasTableProps> = ({
  notas,
  loading,
  formatDate,
  onViewNota,
  onExportPDF,
  onDeleteClick,
  exporting,
  deleteLoading
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
              <TableCell>
                {nota.supervisao_tecnica?.descricao || nota.coordenacao?.descricao || 'Área não especificada'}
              </TableCell>
              <TableCell>{formatDate(nota.criado_em || nota.created_at || "")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewNota(nota)}
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExportPDF(nota)}
                    title="Exportar PDF"
                    disabled={exporting}
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteClick(nota)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Excluir"
                    disabled={deleteLoading}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
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
