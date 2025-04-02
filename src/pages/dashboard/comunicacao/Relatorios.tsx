
import React, { useState, useEffect } from 'react';
import { PieChart, SlidersHorizontal, Printer, FileDown, Eye, Search, ArrowRight } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { RelatoriosKPICards } from '@/components/relatorios/RelatoriosKPICards';
import { RelatoriosGraphCards } from '@/components/relatorios/RelatoriosGraphCards';
import RelatoriosFilters from '@/components/relatorios/filters/RelatoriosFilters';
// Import Chart registration to ensure scales are registered
import '@/components/ranking/charts/ChartRegistration';

const RelatoriosPage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('charts');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <WelcomeCard
          title="Relatórios"
          description="Visualize estatísticas e relatórios de comunicação"
          icon={<PieChart className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-orange-500 to-orange-700"
        />

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.print()}
            className="hidden md:flex"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="hidden md:flex"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="default" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
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
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="charts">Gráficos</TabsTrigger>
              <TabsTrigger value="data">Dados</TabsTrigger>
            </TabsList>
            
            <Button
              variant={isEditMode ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              className="gap-2"
            >
              {isEditMode ? (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Finalizar edição</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Organizar cards</span>
                </>
              )}
            </Button>
          </div>

          <TabsContent value="charts" className="mt-4">
            <DndContext modifiers={[restrictToWindowEdges]}>
              <div className="space-y-6">
                <RelatoriosKPICards isEditMode={isEditMode} />
                <RelatoriosGraphCards isEditMode={isEditMode} />
              </div>
            </DndContext>
          </TabsContent>
          
          <TabsContent value="data">
            <div className="flex flex-col gap-4 mt-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-slate-800">Dados dos relatórios</h3>
                <p className="text-slate-600">
                  Esta seção apresentará os dados em formato tabular para análise detalhada.
                </p>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Exportar CSV
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RelatoriosPage;
