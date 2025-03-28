
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, BarChart, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState('filtros');

  const handleResetFilters = () => {
    // Implement filter reset functionality
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4 pb-2 border-b">
          <SheetTitle className="text-teal-700 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filtros e Gerenciamento de Visualização
          </SheetTitle>
          <SheetDescription>
            Configure os filtros para análise e selecione quais gráficos deseja visualizar
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="filtros" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6 bg-teal-50">
            <TabsTrigger 
              value="filtros"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </TabsTrigger>
            <TabsTrigger 
              value="graficos"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              <BarChart className="h-4 w-4 mr-2" />
              Gráficos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="filtros" className="space-y-6">
            {/* Filtros por Data, Coordenação e Tema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FilterCard title="Período" description="Selecione o período de tempo para análise" />
              <FilterCard title="Coordenação" description="Filtre por coordenação específica" />
              <FilterCard title="Tema / Serviço" description="Filtre por tema ou serviço" />
              <FilterCard title="Status" description="Filtre por status de demandas/notas" />
            </div>
            
            {/* Filtros Ativos */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Filtros Ativos</h3>
              <div className="flex flex-wrap gap-2">
                {/* Aqui seriam mostrados os filtros ativos */}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleResetFilters} 
                className="bg-teal-600 hover:bg-teal-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetar Filtros e Fechar
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="graficos">
            <div className="space-y-4">
              <CategorySection 
                title="Visão Geral" 
                items={[
                  { id: 'statusDistribution', label: 'Distribuição de Status', checked: true },
                  { id: 'tempoResposta', label: 'Tempo de Resposta', checked: true },
                  { id: 'volumeDemandas', label: 'Volume de Demandas', checked: true },
                ]}
              />
              
              <CategorySection 
                title="Temas Técnicos" 
                items={[
                  { id: 'distribuicaoTemas', label: 'Distribuição por Temas', checked: true },
                  { id: 'complexidadePorTema', label: 'Complexidade por Tema', checked: false },
                  { id: 'servicosMaisFrequentes', label: 'Serviços Mais Frequentes', checked: true },
                ]}
              />
              
              <CategorySection 
                title="Tempo e Desempenho" 
                items={[
                  { id: 'tempoMedioResposta', label: 'Tempo Médio de Resposta', checked: true },
                  { id: 'respostasForaPrazo', label: 'Respostas Fora do Prazo', checked: false },
                  { id: 'performancePorArea', label: 'Performance por Área', checked: true },
                ]}
              />
              
              <CategorySection 
                title="Notas Oficiais" 
                items={[
                  { id: 'notasEmitidas', label: 'Notas Emitidas', checked: true },
                  { id: 'tempoAprovacao', label: 'Tempo de Aprovação', checked: false },
                  { id: 'notasPorTema', label: 'Notas por Tema', checked: true },
                ]}
              />
              
              <CategorySection 
                title="Tendências" 
                items={[
                  { id: 'evolucaoMensal', label: 'Evolução Mensal', checked: true },
                  { id: 'comparativoAnual', label: 'Comparativo Anual', checked: false },
                  { id: 'previsaoProximoMes', label: 'Previsão Próximo Mês', checked: false },
                ]}
              />
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => onOpenChange(false)} 
                variant="outline" 
                className="border-teal-300"
              >
                Fechar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

// Helper components
const FilterCard = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm">
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
};

const CategorySection = ({ 
  title, 
  items 
}: { 
  title: string; 
  items: Array<{ id: string; label: string; checked: boolean }> 
}) => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-medium mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center space-x-2">
            <input 
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => {}}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor={item.id} className="text-sm">{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterDialog;
