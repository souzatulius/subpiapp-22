
import React from 'react';
import { Upload, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUploadWithProgress from '@/components/shared/FileUploadWithProgress';
import { usePainelZeladoriaUpload } from '@/hooks/ranking/usePainelZeladoriaUpload';
import { useToast } from '@/hooks/use-toast';
import { useUploadState } from '@/hooks/ranking/useUploadState';

interface UploadButtonProps {
  isUploading: boolean;
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  currentUser: any;
  onRefreshData: () => Promise<void>;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  isUploading,
  onUploadStart,
  onUploadComplete,
  onPainelUploadComplete,
  currentUser,
  onRefreshData
}) => {
  const { toast } = useToast();
  const { sgzProgress, painelProgress } = useUploadState();
  const { handleUploadPainel } = usePainelZeladoriaUpload(currentUser);
  
  const handleFileUpload = async (file: File) => {
    onUploadStart();
    try {
      const result = await handleUploadPainel(file);
      if (result && result.success) {
        toast({
          title: "Upload concluído",
          description: `${result.recordCount} registros processados com sucesso`,
          variant: "success",
        });
        onPainelUploadComplete(result.id || "", result.data || []);
        onRefreshData();
      } else {
        toast({
          title: "Erro no upload",
          description: result?.message || "Não foi possível processar o arquivo",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Erro no upload:", err);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao processar o arquivo",
        variant: "destructive",
      });
    }
  };
  
  // Check if we have any active uploads
  const isActiveUpload = sgzProgress?.stage === 'uploading' || 
                         sgzProgress?.stage === 'processing' ||
                         painelProgress?.stage === 'uploading' ||
                         painelProgress?.stage === 'processing';
  
  return (
    <>
      {isActiveUpload ? (
        <Loader className="h-5 w-5 animate-spin text-orange-600" />
      ) : (
        <Upload className="h-5 w-5 text-gray-600" />
      )}
    </>
  );
};

export default UploadButton;
