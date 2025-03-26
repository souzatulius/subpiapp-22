
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Building, Eye, FileDown, Trash, MessageSquare } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </CardFooter>
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
        {notas.map((nota) => {
          const autorNome = nota.autor?.nome_completo || "Autor desconhecido";
          const areaNome = nota.supervisao_tecnica?.descricao || "Área não especificada";
          
          return (
            <Card key={nota.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold line-clamp-1">{nota.titulo}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(nota.status)}`}>
                    {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
                  </span>
                </div>
                <CardDescription className="flex items-center text-sm text-gray-500">
                  {nota.demanda_id ? (
                    <div className="flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      <span>Vinculada a demanda</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Building className="w-3 h-3 mr-1" />
                      <span>{areaNome}</span>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {nota.texto}
                </div>
                <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    <span>{autorNome}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(nota.criado_em || nota.created_at || "").split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDate(nota.criado_em || nota.created_at || "").split(' ')[1]}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4">
                <div className="flex space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleViewNota(nota)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-2" />
                    Ver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExportPDF(nota)}
                    disabled={exporting}
                  >
                    <FileDown className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(nota)}
                    disabled={deleteLoading}
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
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
