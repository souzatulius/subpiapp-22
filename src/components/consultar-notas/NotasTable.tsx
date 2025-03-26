
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EyeIcon, FileDownIcon, TrashIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import NotaDetailDialog from './NotaDetailDialog';
import DeleteNotaDialog from './DeleteNotaDialog';
import { useExportNotaPDF } from '@/hooks/consultar-notas/useExportNotaPDF';
import { NotaOficial } from '@/types/nota';

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rascunho':
        return 'bg-gray-100 text-gray-800';
      case 'publicado':
        return 'bg-blue-100 text-blue-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (notas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma nota encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notas.map((nota) => (
              <TableRow key={nota.id}>
                <TableCell className="font-medium">{nota.titulo}</TableCell>
                <TableCell>{nota.autor?.nome_completo || 'Autor desconhecido'}</TableCell>
                <TableCell>{nota.supervisao_tecnica?.descricao || 'Não informada'}</TableCell>
                <TableCell>{formatDate(nota.criado_em)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(nota.status)}`}>
                    {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleViewNota(nota)}
                      title="Visualizar"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleExportPDF(nota)}
                      disabled={exporting}
                      title="Exportar PDF"
                    >
                      <FileDownIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700" 
                      onClick={() => handleDeleteClick(nota)}
                      disabled={deleteLoading}
                      title="Excluir"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
