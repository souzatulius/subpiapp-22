
import React, { useState, useEffect } from 'react';
import { RelatoriosKPICards } from './RelatoriosKPICards';
import RelatoriosGraphCards from './RelatoriosGraphCards';
import { PieChart, SlidersHorizontal, Printer, FileDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ReportFilters } from './hooks/useReportsData';
import { toast } from '@/components/ui/use-toast';

interface RelatoriosContentProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
  filters?: ReportFilters;
}

export const RelatoriosContent: React.FC<RelatoriosContentProps> = ({
  filterDialogOpen,
  setFilterDialogOpen,
  filters = {}
}) => {
  const [chartVisibility, setChartVisibility] = useLocalStorage<Record<string, boolean>>('relatorios-chart-visibility', {
    origemDemandas: true,
    distribuicaoPorTemas: true,
    tempoMedioResposta: true,
    performanceArea: true,
    notasEmitidas: true,
    noticiasVsReleases: true,
    problemasComuns: true,
    demandasEsic: true,
    resolucaoEsic: true,
    processosCadastrados: true
  });

  const resetDashboardChartVisibility = () => {
    setChartVisibility({
      origemDemandas: true,
      distribuicaoPorTemas: true,
      tempoMedioResposta: true,
      performanceArea: true,
      notasEmitidas: true,
      noticiasVsReleases: true,
      problemasComuns: true,
      demandasEsic: true,
      resolucaoEsic: true,
      processosCadastrados: true
    });
    
    toast({
      title: "Dashboard resetado",
      description: "Todos os cards foram restaurados para a visualização padrão.",
      duration: 3000,
    });
  };

  // Reset visibility when page loads if reset param exists in URL
  useEffect(() => {
    if (window.location.search.includes('reset=true')) {
      resetDashboardChartVisibility();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-blue-600" />
          Estatísticas e Relatórios
        </h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white hover:bg-gray-100 border-gray-200 text-gray-600"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-100 border-gray-200 text-gray-600"
            onClick={() => {}}
          >
            <FileDown className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setFilterDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
        </div>
      </div>
      
      <RelatoriosKPICards />
      
      <RelatoriosGraphCards chartVisibility={chartVisibility} />
    </div>
  );
};
