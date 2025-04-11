
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ListStart, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { handleFileUpload, handlePainelZeladoriaUpload } from '@/hooks/ranking/services/uploadService';

interface UploadSectionProps {
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  isUploading: boolean;
  user: any;
  onRefreshData: () => Promise<void>;
}

const UploadSection = ({
  onUploadStart,
  onUploadComplete,
  onPainelUploadComplete,
  isUploading,
  user,
  onRefreshData
}: UploadSectionProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState<any>({});

  // Handle SGZ file upload
  const handleSGZFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart();
    try {
      const result = await handleFileUpload(
        file, 
        user, 
        (progress) => setUploadProgress(progress),
        (stats) => setUploadStats(stats)
      );
      
      if (result && result.success) {
        toast.success(`Upload da planilha SGZ concluído: ${result.recordCount} registros processados`);
        onUploadComplete(result.id, result.data || []);
        // Refresh the data to show the new uploads
        await onRefreshData();
      } else {
        toast.error(`Erro no upload: ${result?.message || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error('Error uploading SGZ file:', err);
      toast.error('Erro ao processar arquivo SGZ');
    } finally {
      // Reset the file input
      event.target.value = '';
    }
  };

  // Handle Painel file upload
  const handlePainelFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart();
    try {
      const result = await handlePainelZeladoriaUpload(
        file, 
        user, 
        (progress) => setUploadProgress(progress),
        (stats) => setUploadStats(stats)
      );
      
      if (result && result.success) {
        toast.success(`Upload da planilha do Painel concluído: ${result.recordCount} registros processados`);
        onPainelUploadComplete(result.id, result.data || []);
        // Refresh the data to show the new uploads
        await onRefreshData();
      } else {
        toast.error(`Erro no upload: ${result?.message || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error('Error uploading Painel file:', err);
      toast.error('Erro ao processar arquivo do Painel');
    } finally {
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* SGZ Upload */}
      <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <ListStart className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="text-sm font-medium text-gray-700 mb-1">Planilha SGZ</h3>
        <p className="text-xs text-gray-500 mb-3 text-center">
          Upload do arquivo Excel exportado do SGZ
        </p>
        <input
          type="file"
          id="sgzFile"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleSGZFileUpload}
          disabled={isUploading}
        />
        <label htmlFor="sgzFile">
          <Button
            variant="outline"
            size="sm"
            className={`cursor-pointer ${isUploading ? 'bg-gray-200' : 'bg-gray-100'} text-gray-700 border-gray-300 hover:bg-gray-200`}
            disabled={isUploading}
            asChild
          >
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? `Carregando... ${uploadProgress}%` : 'Selecionar Arquivo'}
            </span>
          </Button>
        </label>
        
        {isUploading && uploadStats.processingStatus === 'processing' && uploadStats.newOrders !== undefined && (
          <div className="mt-2 text-xs text-gray-600">
            <p>Novas ordens: {uploadStats.newOrders}</p>
            <p>Ordens atualizadas: {uploadStats.updatedOrders}</p>
          </div>
        )}
      </div>

      {/* Painel Upload */}
      <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <CalendarDays className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="text-sm font-medium text-gray-700 mb-1">Painel da Zeladoria</h3>
        <p className="text-xs text-gray-500 mb-3 text-center">
          Upload do arquivo Excel do Painel da Zeladoria
        </p>
        <input
          type="file"
          id="painelFile"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handlePainelFileUpload}
          disabled={isUploading}
        />
        <label htmlFor="painelFile">
          <Button
            variant="outline"
            size="sm"
            className={`cursor-pointer ${isUploading ? 'bg-gray-200' : 'bg-gray-100'} text-gray-700 border-gray-300 hover:bg-gray-200`}
            disabled={isUploading}
            asChild
          >
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? `Carregando... ${uploadProgress}%` : 'Selecionar Arquivo'}
            </span>
          </Button>
        </label>
        
        {isUploading && uploadStats.processingStatus === 'processing' && uploadStats.message && (
          <div className="mt-2 text-xs text-gray-600">
            <p>{uploadStats.message}</p>
            {uploadStats.recordCount > 0 && <p>Registros: {uploadStats.recordCount}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
