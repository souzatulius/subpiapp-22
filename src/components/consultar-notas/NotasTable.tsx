
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, FileDown, Trash } from 'lucide-react';
import NotaDetailDialog from './NotaDetailDialog';
import DeleteNotaDialog from './DeleteNotaDialog';
import { useExportNotaPDF } from '@/hooks/consultar-notas/useExportNotaPDF';
import { NotaOficial } from '@/types/nota';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface NotasTableProps {
  notas: NotaOficial[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  onDeleteNota: (notaId: string) => Promise<void>;
  deleteLoading: boolean;
}

const NotasTable: React.FC<NotasTableProps> = ({ 
  notas, 
  loading, 
  formatDate,
  onDeleteNota,
  deleteLoading
}) => {
  const [selectedNota, setSelectedNota] = useState<NotaOficial | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { exportNotaToPDF, exporting } = useExportNotaPDF(formatDate);

  const handleViewNota = (nota: NotaOficial) => {
    setSelectedNota(nota);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (nota: NotaOficial) => {
    setSelectedNota(nota);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedNota) {
      await onDeleteNota(selectedNota.id);
      setIsDeleteOpen(false);
    }
  };

  const handleExportPDF = (nota: NotaOficial) => {
    exportNotaToPDF(nota);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-md p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto" id="notas-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Nenhuma nota encontrada.
                </TableCell>
              </TableRow>
            ) : (
              notas.map((nota) => (
                <TableRow key={nota.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{nota.titulo}</TableCell>
                  <TableCell>{nota.autor?.nome_completo || 'Autor desconhecido'}</TableCell>
                  <TableCell>{nota.supervisao_tecnica?.descricao || 'Área não informada'}</TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${nota.status === 'aprovado' ? 'bg-green-100 text-green-800' : ''}
                      ${nota.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${nota.status === 'rascunho' ? 'bg-gray-100 text-gray-800' : ''}
                      ${nota.status === 'publicado' ? 'bg-blue-100 text-blue-800' : ''}
                      ${nota.status === 'rejeitado' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(nota.criado_em)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewNota(nota)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleExportPDF(nota)}
                        disabled={exporting}
                        title="Exportar PDF"
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(nota)}
                        disabled={deleteLoading}
                        title="Excluir"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedNota && (
        <>
          <NotaDetailDialog 
            nota={selectedNota}
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            formatDate={formatDate}
          />
          
          <DeleteNotaDialog 
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleConfirmDelete}
            notaTitle={selectedNota.titulo}
            hasDemanda={!!selectedNota.demanda_id}
          />
        </>
      )}
    </>
  );
};

export default NotasTable;
