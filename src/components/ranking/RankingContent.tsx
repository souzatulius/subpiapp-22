
import React, { useState, useEffect } from 'react';
import UploadSection from './UploadSection';
import FilterDialog from './filters/FilterDialog';
import { ChartVisibility, FilterOptions } from './types';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Card } from '@/components/ui/card';
import RankingCharts from './RankingCharts';
import DashboardCards from './insights/DashboardCards';
import ChartsSection from './ChartsSection';
import { useDemoData } from './DemoDataProvider';
import { Loader2 } from 'lucide-react';

interface RankingContentProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
}

const RankingContent: React.FC<RankingContentProps> = ({
  filterDialogOpen,
  setFilterDialogOpen
}) => {
  const { user } = useAuth();
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  // Use demo data provider
  const { sgzData, painelData, isLoading: isDemoLoading, hasData } = useDemoData();

  const { 
    filters, 
    chartVisibility, 
    handleFiltersChange, 
    handleChartVisibilityChange, 
    resetFilters 
  } = useFilterManagement();

  const handleUploadComplete = (id: string, data: any[]) => {
    console.log('SGZ Upload complete', id, data.length);
    setUploadId(id);
    setIsUploading(false);
  };

  const handlePainelUploadComplete = (id: string, data: any[]) => {
    console.log('Painel Upload complete', id, data.length);
    setIsUploading(false);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };
  
  const handleSimulateIdealRanking = () => {
    setIsSimulationActive(!isSimulationActive);
  };

  return (
    <div className="space-y-6">
      {/* Mostra um loader enquanto carrega os dados demo */}
      {isDemoLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-3 text-lg text-orange-700">Carregando dados...</span>
        </div>
      )}
      
      {/* Upload Section ainda disponível (não removemos) */}
      <Card className="p-4 bg-white border-orange-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
        <h2 className="text-lg font-semibold text-orange-700 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload de Planilhas
        </h2>
        <UploadSection 
          onUploadStart={handleUploadStart}
          onUploadComplete={handleUploadComplete}
          onPainelUploadComplete={handlePainelUploadComplete}
          isUploading={isUploading}
          user={user}
        />
      </Card>
      
      {/* Mensagem informando sobre os dados de demonstração */}
      <Card className="p-4 bg-green-50 border-green-200 shadow-sm">
        <h2 className="text-lg font-semibold text-green-700 mb-2">Dados de Demonstração Carregados</h2>
        <p className="text-green-600">
          Dados fictícios foram carregados automaticamente para permitir visualização dos gráficos sem necessidade de upload.
          Você ainda pode fazer upload de seus próprios dados usando a seção acima.
        </p>
      </Card>
      
      {/* AI Insights Cards Section */}
      {hasData && (
        <Card className="p-4 bg-white border-orange-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
          <DashboardCards 
            dadosPlanilha={sgzData || []} 
            dadosPainel={painelData || []}
            uploadId={uploadId || 'demo-data'} 
            isSimulationActive={isSimulationActive}
          />
        </Card>
      )}

      {/* Charts Section */}
      {hasData && (
        <>
          <RankingCharts 
            sgzData={sgzData || []}
            painelData={painelData || []}
            isLoading={isDemoLoading}
            chartVisibility={chartVisibility}
            isSimulationActive={isSimulationActive}
            onSimulateIdealRanking={handleSimulateIdealRanking}
          />
          
          <ChartsSection
            chartData={{}}
            isLoading={isDemoLoading}
            chartVisibility={chartVisibility}
            sgzData={sgzData || []}
            painelData={painelData || []}
            onSimulateIdealRanking={handleSimulateIdealRanking}
            isSimulationActive={isSimulationActive}
          />
        </>
      )}
      
      <FilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        chartVisibility={chartVisibility}
        onChartVisibilityChange={handleChartVisibilityChange}
        onResetFilters={resetFilters}
      />
    </div>
  );
};

export default RankingContent;
