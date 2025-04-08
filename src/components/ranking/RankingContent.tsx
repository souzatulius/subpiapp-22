
import React, { useState, useEffect } from 'react';
import UploadSection from './UploadSection';
import FilterDialog from './filters/FilterDialog';
import { useFilterManagement } from '@/hooks/ranking/useFilterManagement';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Card } from '@/components/ui/card';
import DashboardCards from './insights/DashboardCards';
import ChartsSection from './ChartsSection';
import { useDemoData } from './DemoDataProvider';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface RankingContentProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
  disableCardContainers?: boolean;
  className?: string; // Add className prop
}

const RankingContent: React.FC<RankingContentProps> = ({
  filterDialogOpen,
  setFilterDialogOpen,
  disableCardContainers = false,
  className = '' // Default to empty string
}) => {
  const { user } = useAuth();
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [lastUpdateDate, setLastUpdateDate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use demo data provider
  const { sgzData, painelData, isLoading: isDemoLoading, hasData, refreshData } = useDemoData();

  const { 
    filters, 
    chartVisibility, 
    handleFiltersChange, 
    handleChartVisibilityChange, 
    resetFilters 
  } = useFilterManagement();

  useEffect(() => {
    if (sgzData?.length || painelData?.length) {
      setLastUpdateDate(new Date());
    }
  }, [sgzData, painelData]);

  const handleUploadComplete = (id: string, data: any[]) => {
    console.log('SGZ Upload complete', id, data.length);
    setUploadId(id);
    setIsUploading(false);
    setLastUpdateDate(new Date());
  };

  const handlePainelUploadComplete = (id: string, data: any[]) => {
    console.log('Painel Upload complete', id, data.length);
    setIsUploading(false);
    setLastUpdateDate(new Date());
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };
  
  const handleSimulateIdealRanking = () => {
    setIsSimulationActive(!isSimulationActive);
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      setLastUpdateDate(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Mostra um loader enquanto carrega os dados demo */}
      {isDemoLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-3 text-lg text-orange-700">Carregando dados...</span>
        </div>
      )}
      
      {/* Seção de Upload Unificada - marked with upload-section class for hiding during PDF export */}
      <Card className="p-4 bg-white border-blue-200 shadow-sm overflow-hidden hover:shadow-md transition-all upload-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-orange-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Importação de Dados
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Faça upload das planilhas SGZ e do Painel da Zeladoria para visualizar os dados
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4 md:mt-0">
            {lastUpdateDate && (
              <div className="text-sm text-gray-600 flex items-center">
                <span className="mr-2">Última atualização:</span>
                <span className="font-medium">{format(lastUpdateDate, 'dd/MM/yyyy HH:mm')}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshData} 
              disabled={isRefreshing}
              className="bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar Dados
            </Button>
          </div>
        </div>
        
        <div className="border border-dashed border-blue-300 rounded-lg p-4">
          <UploadSection 
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            onPainelUploadComplete={handlePainelUploadComplete}
            isUploading={isUploading}
            user={user}
          />
        </div>
      </Card>
      
      {/* AI Insights Cards Section */}
      {hasData && (
        <Card className="p-4 bg-white border-blue-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
          <DashboardCards 
            dadosPlanilha={sgzData || []} 
            dadosPainel={painelData || []}
            uploadId={uploadId || 'demo-data'} 
            isSimulationActive={isSimulationActive}
          />
        </Card>
      )}

      {/* Charts Section - directly rendered without any container when disableCardContainers is true */}
      {hasData && (
        <ChartsSection
          chartData={{}}
          isLoading={isDemoLoading}
          chartVisibility={chartVisibility}
          sgzData={sgzData || []}
          painelData={painelData || []}
          onSimulateIdealRanking={handleSimulateIdealRanking}
          isSimulationActive={isSimulationActive}
          disableCardContainers={disableCardContainers}
        />
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
