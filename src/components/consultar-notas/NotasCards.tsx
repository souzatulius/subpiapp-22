
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Calendar, FileText, Tag, Eye, FileDown, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotaDetailDialog from './NotaDetailDialog';
import DeleteNotaDialog from './DeleteNotaDialog';
import { useExportNotaPDF } from '@/hooks/consultar-notas/useExportNotaPDF';
import { NotaOficial } from '@/types/nota';

interface NotasCardsProps {
  notas: NotaOficial[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  onDeleteNota: (notaId: string) => Promise<void>;
  deleteLoading: boolean;
}

const NotasCards: React.FC<NotasCardsProps> = ({ 
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notas.map((nota) => (
          <Card key={nota.id} className="hover:shadow-md transition-shadow border border-gray-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-lg text-[#003570] mb-2">{nota.titulo}</h3>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{nota.autor?.nome_completo || 'Autor desconhecido'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{nota.supervisao_tecnica?.descricao || 'Área não informada'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formatDate(nota.criado_em)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className={`text-xs font-medium px-2 py-1 rounded-full
                  ${nota.status === 'aprovado' ? 'bg-green-100 text-green-800' : ''}
                  ${nota.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${nota.status === 'rascunho' ? 'bg-gray-100 text-gray-800' : ''}
                  ${nota.status === 'publicado' ? 'bg-blue-100 text-blue-800' : ''}
                  ${nota.status === 'rejeitado' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleViewNota(nota)}
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleExportPDF(nota)}
                    disabled={exporting}
                    title="Exportar PDF"
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700" 
                    onClick={() => handleDeleteClick(nota)}
                    disabled={deleteLoading}
                    title="Excluir"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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

export default NotasCards;
