
import React, { useState } from 'react';
import { PieChart, SlidersHorizontal, Printer, FileDown, Eye, Search } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext } from "@dnd-kit/core";
import { RelatoriosKPICards } from '@/components/relatorios/RelatoriosKPICards';
import { RelatoriosGraphCards } from '@/components/relatorios/RelatoriosGraphCards';
import RelatoriosFilters from '@/components/relatorios/filters/RelatoriosFilters';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';

const RelatoriosPage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
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
          onClick={() => window.print()}
          className="h-9 w-9"
          title="Imprimir"
        >
          <Printer className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          className="h-9 w-9"
          title="Exportar PDF"
        >
          <FileDown className="h-4 w-4" />
        </Button>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="default" 
              size="icon"
              className="h-9 w-9"
              title="Filtros"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[450px]" side="right">
            <SheetHeader>
              <SheetTitle>Filtros de relatório</SheetTitle>
              <SheetDescription>
                Customize a visualização dos dados e relatórios.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="py-6">
                <RelatoriosFilters />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Button
          variant={isEditMode ? "secondary" : "outline"}
          size="icon"
          onClick={() => setIsEditMode(!isEditMode)}
          className="h-9 w-9"
          title={isEditMode ? "Finalizar edição" : "Organizar cards"}
        >
          {isEditMode ? <Eye className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {/* Conteúdo principal com apenas visualização de gráficos */}
      <div className="mt-4">
        <DndContext>
          <div className="space-y-6">
            <RelatoriosKPICards isEditMode={isEditMode} />
            <RelatoriosGraphCards isEditMode={isEditMode} />
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default RelatoriosPage;
