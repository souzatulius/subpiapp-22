import React, { useState, useEffect } from 'react';
import RankingContent from '@/components/ranking/RankingContent';
import RankingFilterDialog from '@/components/ranking/filters/RankingFilterDialog';
import { useRankingCharts } from '@/hooks/ranking/useRankingCharts';
import { useUpload } from '@/hooks/ranking/useUpload';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

const RankingSubs = () => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const { refreshChartData, setIsLoading } = useRankingCharts();
  const { upload } = useUpload();
  const { showFeedback } = useAnimatedFeedback();
  const [lastUpdateText, setLastUpdateText] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    try {
      await upload(file);
      await refreshChartData();
      showFeedback('success', 'Dados atualizados com sucesso!', { duration: 3000 });
      setLastUpdateText(new Date().toLocaleTimeString());
    } catch (error: any) {
      console.error("Error during upload:", error);
      showFeedback('error', 'Erro ao atualizar os dados.', { duration: 5000 });
      toast.error('Erro ao atualizar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: Error, info: any) => {
    console.error("Caught an error", error, info);
    toast.error(`Ocorreu um erro ao processar os dados: ${error.message}`);
  };

  return (
    <div className="space-y-6">
      <RankingContent
        filterDialogOpen={filterDialogOpen}
        setFilterDialogOpen={setFilterDialogOpen}
        buttonText="Filtrar Ranking"
        lastUpdateText={lastUpdateText || "Nunca atualizado"}
        onRefreshData={refreshChartData}
      />
      
      <style>
        {`
          .chart-progress-container {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default RankingSubs;
