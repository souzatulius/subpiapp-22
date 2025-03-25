
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@dnd-kit/core';
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(charts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setCharts(items);
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {charts.map((chart, index) => (
                  chart.visible && (
                    <Draggable key={chart.id} draggableId={chart.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card className="h-full">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                              <CardTitle className="text-md flex items-center">
                                <MoveVertical className="h-4 w-4 mr-2 text-muted-foreground" />
                                {chart.title}
                              </CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleVisibility(chart.id)}
                              >
                                <EyeOff className="h-4 w-4" />
                              </Button>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[250px]">
                                {isLoading ? (
                                  <Skeleton className="h-full w-full" />
                                ) : (
                                  <SGZChart type={chart.type as any} data={data[chart.id as keyof SGZChartData]} />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  )
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
