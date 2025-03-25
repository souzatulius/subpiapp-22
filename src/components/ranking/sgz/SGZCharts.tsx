
import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SGZChartData } from '@/types/sgz';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, MoveVertical } from 'lucide-react';
import SGZChart from './SGZChart';
import { Skeleton } from '@/components/ui/skeleton';

interface SGZChartsProps {
  data: SGZChartData | null;
  isLoading: boolean;
}

// Create a draggable chart component using dnd-kit
const SortableChartItem = ({ 
  id, 
  title, 
  children, 
  onToggleVisibility
}: { 
  id: string; 
  title: string; 
  children: React.ReactNode; 
  onToggleVisibility: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="h-full">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-md flex items-center">
            <MoveVertical className="h-4 w-4 mr-2 text-muted-foreground" />
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SGZCharts: React.FC<SGZChartsProps> = ({ data, isLoading }) => {
  // Define chart configurations
  const initialCharts = [
    { id: 'statusDistribution', title: 'Distribuição por Status', visible: true, type: 'bar' },
    { id: 'areaDistribution', title: 'Distribuição por Área Técnica', visible: true, type: 'pie' },
    { id: 'servicosFrequentes', title: 'Serviços mais Frequentes', visible: true, type: 'bar' },
    { id: 'tempoMedioPorStatus', title: 'Tempo Médio por Status (dias)', visible: true, type: 'bar' },
    { id: 'distribuicaoPorDistrito', title: 'Distribuição por Distrito', visible: true, type: 'bar' },
    { id: 'evolucaoStatus', title: 'Evolução de Status', visible: true, type: 'line' }
  ];

  const [charts, setCharts] = useState(initialCharts);

  const toggleVisibility = (id: string) => {
    setCharts(prev => prev.map(chart => 
      chart.id === id ? { ...chart, visible: !chart.visible } : chart
    ));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setCharts((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newArray = [...items];
        const [removed] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, removed);
        
        return newArray;
      });
    }
  };

  if (!data && !isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-60">
          <p className="text-gray-500 mb-2 text-center">
            Nenhum dado disponível. Faça upload de uma planilha para visualizar os gráficos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Gráficos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {charts.map(chart => (
              <Button
                key={chart.id}
                variant={chart.visible ? 'default' : 'outline'}
                size="sm"
                className={chart.visible ? 'bg-orange-500 hover:bg-orange-600' : ''}
                onClick={() => toggleVisibility(chart.id)}
              >
                {chart.visible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                {chart.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {data && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SortableContext
              items={charts.filter(chart => chart.visible).map(chart => chart.id)}
              strategy={verticalListSortingStrategy}
            >
              {charts.map((chart) => (
                chart.visible && (
                  <SortableChartItem 
                    key={chart.id} 
                    id={chart.id} 
                    title={chart.title}
                    onToggleVisibility={() => toggleVisibility(chart.id)}
                  >
                    {isLoading ? (
                      <Skeleton className="h-full w-full" />
                    ) : (
                      <SGZChart type={chart.type as any} data={data[chart.id as keyof SGZChartData]} />
                    )}
                  </SortableChartItem>
                )
              ))}
            </SortableContext>
          </div>
        </DndContext>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[250px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SGZCharts;
