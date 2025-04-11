
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Skeleton } from '@/components/ui/skeleton';
import { EyeOff, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceTypesChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({ 
  data, 
  sgzData, 
  isLoading, 
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  const [chartData, setChartData] = useState<any | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    if (!isLoading && sgzData) {
      // Count service types
      const counter: Record<string, number> = {};
      
      sgzData.forEach(item => {
        const serviceType = item.servico_tipo || 'Outros';
        counter[serviceType] = (counter[serviceType] || 0) + 1;
      });
      
      // Sort by count (descending)
      const sortedEntries = Object.entries(counter)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 8); // Top 8 service types
      
      // Prepare chart data
      const labels = sortedEntries.map(([name]) => name);
      const values = sortedEntries.map(([, count]) => count);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Número de ocorrências',
            data: values,
            backgroundColor: [
              '#10b981', '#f59e0b', '#3b82f6', '#06b6d4', 
              '#8b5cf6', '#ec4899', '#f43f5e', '#6b7280'
            ],
          }
        ]
      });
    }
  }, [sgzData, isLoading]);
  
  if (isLoading) {
    return (
      <Card className="border border-orange-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Tipos de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[220px]">
            <Skeleton className="h-[200px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!sgzData?.length) {
    return (
      <Card className="border border-orange-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Tipos de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[220px] p-4">
            <p className="text-muted-foreground text-center">
              Sem dados para exibir. Faça upload de planilhas SGZ para visualizar informações.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      className="border border-orange-200 shadow-sm hover:shadow-md transition-all relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader>
        <CardTitle className="text-sm font-medium">Tipos de Serviço</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Action buttons that appear on hover */}
        <div 
          className={`absolute top-3 right-3 flex space-x-2 transition-opacity duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {onToggleAnalysis && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleAnalysis();
              }}
              className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
              title="Mostrar análise"
            >
              <Search size={16} />
            </button>
          )}
          
          {onToggleVisibility && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility();
              }}
              className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
              title="Ocultar card"
            >
              <EyeOff size={16} />
            </button>
          )}
        </div>
        
        <div className="h-[220px]">
          {chartData && (
            <Bar 
              data={chartData} 
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  },
                  x: {
                    ticks: {
                      maxRotation: 45,
                      minRotation: 45
                    }
                  }
                }
              }} 
            />
          )}
        </div>
        
        {isSimulationActive && (
          <div className="mt-3 text-sm text-orange-700 bg-orange-50 p-2 rounded-md">
            <p>Simulação: Os serviços sem responsável definido foram automaticamente atribuídos.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceTypesChart;
