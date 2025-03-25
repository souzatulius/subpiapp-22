
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RankingContent from '@/components/ranking/RankingContent';
import UploadSection from '@/components/ranking/UploadSection';
import { useUploadManagement } from '@/hooks/ranking/useUploadManagement';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';
import { ChartVisibility } from '@/components/ranking/types';
import { toast } from '@/components/ui/use-toast';

const RankingSubs = () => {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  
  const {
    lastUpload,
    isLoading,
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload
  } = useUploadManagement(user);

  const {
    filters,
    chartVisibility,
    handleFiltersChange,
    handleChartVisibilityChange
  } = useFilterManagement();

  React.useEffect(() => {
    if (user) {
      fetchLastUpload();
    }
  }, [user]);

  const onUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);
      setUploadProgress(0);
      
      // Simulate progress for better user experience
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);
      
      await handleUpload(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Display success message
      toast({
        title: "Upload concluído",
        description: "A planilha foi carregada com sucesso e os dados estão disponíveis para visualização.",
      });
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error: any) {
      setUploadError(error.message || "Erro ao fazer upload");
      clearInterval(progressInterval);
      setUploadProgress(0);
      setUploading(false);
    }
  };

  const onDelete = async () => {
    await handleDeleteUpload();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <UploadSection 
            onUpload={onUpload} 
            lastUpload={lastUpload} 
            onDelete={onDelete} 
            isLoading={isLoading || uploading}
            uploadProgress={uploadProgress}
            uploadError={uploadError}
          />
        </CardContent>
      </Card>
      
      <RankingContent />
    </div>
  );
};

export default RankingSubs;
