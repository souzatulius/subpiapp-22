
import React, { useState } from 'react';
import { MessageSquare, SlidersHorizontal, Printer, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from '@/components/ui/button';
import { RelatoriosKPICards } from '@/components/relatorios/RelatoriosKPICards';
import { RelatoriosGraphCards } from '@/components/relatorios/RelatoriosGraphCards';
import FilterDialog from '@/components/relatorios/filters/FilterDialog';
import { exportToPDF, printWithStyles } from '@/utils/pdfExport';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';

// Create a styled version of the components with orange-800 and slate-400 colors
const StyledRelatoriosKPICards = () => {
  return (
    <div className="[&_*]:!border-slate-400 [&_.bg-gray-500]:!bg-orange-800 [&_svg]:!text-orange-800">
      <RelatoriosKPICards />
    </div>
  );
};

const StyledRelatoriosGraphCards = () => {
  return (
    <div className="[&_*]:!border-slate-400 [&_.chart-container_path]:!stroke-orange-800 [&_.chart-container_rect]:!fill-orange-800 [&_svg]:!text-orange-800 [&_button:hover]:!bg-orange-100 [&_button]:!text-orange-800">
      <RelatoriosGraphCards />
    </div>
  );
};

const AcoesComunicacao = () => {
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
    exportToPDF('Ações da Comunicação');
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto pdf-content"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <WelcomeCard
        title="Ações da Comunicação"
        description="Dashboard de análise e acompanhamento das ações comunicativas da prefeitura"
        icon={<MessageSquare className="h-6 w-6 mr-2 text-white" />}
        color="bg-gradient-to-r from-orange-800 to-orange-700"
      />

      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white hover:bg-gray-100 border-slate-400"
          onClick={handlePrint}
        >
          <Printer className="h-5 w-5 text-orange-800" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="bg-white hover:bg-gray-100 border-slate-400"
          onClick={handleExportPDF}
        >
          <FileText className="h-5 w-5 text-orange-800" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="bg-white hover:bg-gray-100 border-slate-400"
          onClick={() => setIsFilterOpen(true)}
        >
          <SlidersHorizontal className="h-5 w-5 text-orange-800" />
        </Button>
      </div>

      <div className="mt-6 chart-container">
        <DndContext
          sensors={sensors}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDragCancel={() => setIsDragging(false)}
        >
          <div className="space-y-8">
            <StyledRelatoriosKPICards />
            <StyledRelatoriosGraphCards />
          </div>
          
          <DragOverlay>
            {isDragging ? (
              <div className="w-64 h-32 bg-gray-50 border border-slate-400 rounded-lg opacity-80 flex items-center justify-center text-orange-800">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Movendo card...
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Filter dialog */}
      <FilterDialog 
        open={isFilterOpen} 
        onOpenChange={setIsFilterOpen} 
      />
    </motion.div>
  );
};

export default AcoesComunicacao;
