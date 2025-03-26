
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Building, FileDown } from 'lucide-react';
import { NotaOficial } from '@/types/nota';
import { useExportNotaPDF } from '@/hooks/consultar-notas/useExportNotaPDF';

interface NotaDetailDialogProps {
  nota: NotaOficial;
  isOpen: boolean;
  onClose: () => void;
  formatDate: (dateString: string) => string;
}

const NotaDetailDialog: React.FC<NotaDetailDialogProps> = ({ 
  nota, 
  isOpen, 
  onClose,
  formatDate
}) => {
  const { exportNotaToPDF, exporting } = useExportNotaPDF(formatDate);
  
  const handleExportPDF = () => {
    exportNotaToPDF(nota);
  };

  const autorNome = nota.autor?.nome_completo || "Autor desconhecido";
  const areaNome = nota.supervisao_tecnica?.descricao || "Área não especificada";
  const dataCriacao = nota.criado_em || nota.created_at || "";
  const dataAtualizacao = nota.atualizado_em || nota.updated_at || "";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{nota.titulo}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 my-2">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{autorNome}</span>
          </div>
          <div className="flex items-center">
            <Building className="w-4 h-4 mr-1" />
            <span>{areaNome}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(dataCriacao)}</span>
          </div>
          {nota.atualizado_em && nota.atualizado_em !== nota.criado_em && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Atualizado em: {formatDate(dataAtualizacao)}</span>
            </div>
          )}
        </div>
        
        <div className="relative border border-gray-200 rounded-md p-4 bg-white">
          <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
          </div>
          
          <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: nota.texto.replace(/\n/g, '<br />') }} />
        </div>
        
        {nota.historico_edicoes && nota.historico_edicoes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Histórico de Edições</h3>
            <div className="space-y-4">
              {nota.historico_edicoes.map((edicao) => (
                <div key={edicao.id} className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">
                      {edicao.editor?.nome_completo || "Editor desconhecido"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(edicao.criado_em)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="mb-1"><span className="font-medium">Título anterior:</span> {edicao.titulo_anterior}</p>
                    <p><span className="font-medium">Título novo:</span> {edicao.titulo_novo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center"
          >
            <FileDown className="w-4 h-4 mr-1" />
            {exporting ? 'Exportando...' : 'Exportar PDF'}
          </Button>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotaDetailDialog;
