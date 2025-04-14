import React, { useState, useCallback } from 'react';
import { PieChart, SlidersHorizontal, Printer, FileDown, RotateCcw } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from "@/components/ui/button";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { RelatoriosKPICards } from '@/components/relatorios/RelatoriosKPICards';
import RelatoriosGraphCards from '@/components/relatorios/RelatoriosGraphCards';
import FilterDialog from '@/components/relatorios/filters/FilterDialog';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from '@/components/ui/use-toast';

// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';
const RelatoriosPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Store chart visibility state in local storage
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
    processosCadastrados: true // Add new chart
  });
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }));
  const handlePrint = () => {
    printWithStyles();
  };
  const handleExportPDF = () => {
    exportToPDF('Relatórios de Comunicação');
  };
  const handleChartVisibilityChange = (chartId: string, visible: boolean) => {
    setChartVisibility(prev => ({
      ...prev,
      [chartId]: visible
    }));
  };
  const resetDashboard = useCallback(() => {
    // Reset to default visibility
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

    // Force reload with reset param to ensure component re-renders with default positions
    window.location.href = window.location.pathname + '?reset=true';
    toast({
      title: "Dashboard resetado",
      description: "Todos os cards foram restaurados para a visualização padrão.",
      duration: 3000
    });
  }, [setChartVisibility]);
  return <motion.div className="max-w-7xl mx-auto pdf-content" initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }}>
      {/* WelcomeCard with reset button */}
      <WelcomeCard title="Relatórios da Comunicação" description="Ações e estatísticas da área" icon={<PieChart className="h-10 w-10 mr-2 text-blue-500 py-0 my-0" />} color="bg-gradient-to-r from-blue-600 to-blue-800" showResetButton={true} onResetClick={resetDashboard} resetButtonIcon={<RotateCcw className="h-4 w-4" />} className="h-12 w-12 mr-3 text-gray-300" />

      {/* Buttons only with icons below WelcomeCard */}
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" size="icon" onClick={handlePrint} className="h-9 w-9 bg-white hover:bg-gray-100 border-gray-200 shadow-sm hover:shadow transition-all rounded-xl" title="Imprimir">
          <Printer className="h-4 w-4 text-gray-600" />
        </Button>
        
        <Button variant="outline" size="icon" onClick={handleExportPDF} className="h-9 w-9 bg-white hover:bg-gray-100 border-gray-200 shadow-sm hover:shadow transition-all rounded-xl" title="Exportar PDF">
          <FileDown className="h-4 w-4 text-gray-600" />
        </Button>
        
        <Button variant="default" size="icon" onClick={() => setIsFilterOpen(true)} className="h-9 w-9 bg-gray-600 hover:bg-gray-700 shadow-sm hover:shadow transition-all rounded-xl" title="Filtros">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        {/* Filter dialog */}
        <FilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} chartVisibility={chartVisibility} onChartVisibilityChange={handleChartVisibilityChange} />
      </div>

      {/* Main content with chart visualization only */}
      <div className="mt-4 chart-container">
        <DndContext sensors={sensors} onDragStart={() => setIsDragging(true)} onDragEnd={() => setIsDragging(false)} onDragCancel={() => setIsDragging(false)}>
          <div className="space-y-4">
            <RelatoriosKPICards />
            <RelatoriosGraphCards chartVisibility={chartVisibility} />
          </div>
          
          <DragOverlay>
            {isDragging ? <div className="w-64 h-32 bg-gray-50 border border-gray-200 rounded-lg opacity-80 flex items-center justify-center text-gray-600">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Movendo card...
              </div> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </motion.div>;
};
export default RelatoriosPage;