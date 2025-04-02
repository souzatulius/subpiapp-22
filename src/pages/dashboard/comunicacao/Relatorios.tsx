
import React, { useState } from 'react';
import { PieChart, SlidersHorizontal, Printer, FileDown, Eye, Search } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from "@/components/ui/button";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { RelatoriosKPICards } from '@/components/relatorios/RelatoriosKPICards';
import { RelatoriosGraphCards } from '@/components/relatorios/RelatoriosGraphCards';
import FilterDialog from '@/components/relatorios/filters/FilterDialog';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';

// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';

const RelatoriosPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handlePrint = () => {
    printWithStyles();
  };

  const handleExportPDF = () => {
    exportToPDF('Relatórios de Comunicação');
  };

  return (
    <div className="max-w-7xl mx-auto pdf-content">
      {/* WelcomeCard com largura total */}
      <WelcomeCard
        title="Relatórios"
        description="Visualize estatísticas e relatórios de comunicação"
        icon={<PieChart className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-orange-500 to-orange-700"
      />

      {/* Botões apenas com ícones abaixo do WelcomeCard */}
      <div className="flex justify-end mt-4 gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={handlePrint}
          className="h-9 w-9 shadow-sm hover:shadow transition-all"
          title="Imprimir"
        >
          <Printer className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          onClick={handleExportPDF}
          className="h-9 w-9 shadow-sm hover:shadow transition-all"
          title="Exportar PDF"
        >
          <FileDown className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="default" 
          size="icon"
          onClick={() => setIsFilterOpen(true)}
          className="h-9 w-9 bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow transition-all"
          title="Filtros"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        {/* Filter dialog */}
        <FilterDialog 
          open={isFilterOpen} 
          onOpenChange={setIsFilterOpen} 
        />
      </div>

      {/* Conteúdo principal com apenas visualização de gráficos */}
      <div className="mt-6 chart-container">
        <DndContext
          sensors={sensors}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDragCancel={() => setIsDragging(false)}
        >
          <div className="space-y-8">
            <RelatoriosKPICards />
            <RelatoriosGraphCards />
          </div>
          
          <DragOverlay>
            {isDragging ? (
              <div className="w-64 h-32 bg-orange-50 border border-orange-200 rounded-lg opacity-80 flex items-center justify-center text-orange-600">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Movendo card...
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default RelatoriosPage;
