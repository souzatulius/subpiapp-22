
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadManagement } from '@/hooks/ranking/useUploadManagement';
import { usePainelZeladoriaUpload } from './hooks/usePainelZeladoriaUpload';
import { User } from '@supabase/supabase-js';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UploadSectionProps {
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  isUploading: boolean;
  user: User | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onUploadStart,
  onUploadComplete,
  onPainelUploadComplete,
  isUploading,
  user
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("sgz");
  const { handleUpload, processingStats } = useUploadManagement(user);
  const { 
    handleUploadPainel, 
    uploadProgress, 
    processamentoPainel, 
    isLoading: isLoadingPainel 
  } = usePainelZeladoriaUpload(user);

  const dragEvents = {
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
    },
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadStart();
      try {
        const result = await handleUpload(files[0]);
        if (result && typeof result !== 'string') {
          onUploadComplete(result.id, result.data);
        }
      } catch (error) {
        console.error("Error handling file upload:", error);
        toast.error("Falha ao processar o arquivo");
      }
    }
  }, [handleUpload, onUploadComplete, onUploadStart]);

  const handlePainelFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadStart();
      try {
        const result = await handleUploadPainel(files[0]);
        if (result) {
          onPainelUploadComplete(result.id, result.data);
          toast.success("Planilha do Painel da Zeladoria processada com sucesso!");
        }
      } catch (error) {
        console.error("Error handling painel file upload:", error);
        toast.error("Falha ao processar o arquivo do painel");
      }
    }
  }, [handleUploadPainel, onPainelUploadComplete, onUploadStart]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onUploadStart();
      try {
        if (activeTab === "sgz") {
          const result = await handleUpload(files[0]);
          if (result && typeof result !== 'string') {
            onUploadComplete(result.id, result.data);
          }
        } else {
          const result = await handleUploadPainel(files[0]);
          if (result) {
            onPainelUploadComplete(result.id, result.data);
          }
        }
      } catch (error) {
        console.error("Error handling dropped file:", error);
        toast.error("Falha ao processar o arquivo arrastado");
      }
    }
  }, [activeTab, handleUpload, handleUploadPainel, onUploadComplete, onPainelUploadComplete, onUploadStart]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="sgz" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="sgz">Planilha SGZ</TabsTrigger>
          <TabsTrigger value="painel">Painel da Zeladoria</TabsTrigger>
        </TabsList>
        
        <div 
          className={`border-dashed rounded-lg p-6 ${
            isDragging ? 'border-orange-500 bg-orange-50' : 'border-orange-300'
          } cursor-pointer transition-colors border-2`}
          {...dragEvents}
          onDrop={handleDrop}
        >
          <TabsContent value="sgz" className="mt-0">
            <div className="text-center space-y-4">
              <FileUp className="h-10 w-10 mx-auto text-orange-400" />
              <div>
                <h3 className="text-lg font-medium text-orange-800">Planilha SGZ</h3>
                <p className="text-orange-600 text-sm mb-4">
                  Arraste e solte sua planilha SGZ aqui ou clique para fazer upload
                </p>
              </div>
              
              <div className="relative">
                <input
                  id="sgz-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <Button 
                  variant="outline" 
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Planilha SGZ
                </Button>
              </div>
              
              {isUploading && !isLoadingPainel && (
                <div className="w-full space-y-2">
                  <Progress value={processingStats.processingStatus === 'processing' ? 50 : 100} className="bg-orange-100" />
                  <p className="text-center text-sm text-orange-700">
                    {processingStats.processingStatus === 'processing' 
                      ? `Processando ${processingStats.newOrders || 0} registros...` 
                      : processingStats.errorMessage || "Processamento concluído"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="painel" className="mt-0">
            <div className="text-center space-y-4">
              <FileUp className="h-10 w-10 mx-auto text-orange-400" />
              <div>
                <h3 className="text-lg font-medium text-orange-800">Planilha do Painel da Zeladoria</h3>
                <p className="text-orange-600 text-sm mb-4">
                  Faça upload da planilha do Painel da Zeladoria para análises comparativas
                </p>
              </div>
              
              <div className="relative">
                <input
                  id="painel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handlePainelFileChange}
                  disabled={isLoadingPainel}
                />
                <Button 
                  variant="outline" 
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                  disabled={isLoadingPainel}
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Planilha do Painel
                </Button>
              </div>
              
              {isLoadingPainel && (
                <div className="w-full space-y-2">
                  <Progress value={uploadProgress} className="bg-orange-100" />
                  <p className="text-center text-sm text-orange-700">
                    {processamentoPainel.status === 'processing' 
                      ? processamentoPainel.message 
                      : (processamentoPainel.status === 'success' 
                        ? `${processamentoPainel.message} (${processamentoPainel.recordCount} registros)` 
                        : processamentoPainel.message)}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UploadSection;
