
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ResponsabilidadeBadge } from '@/components/ui/status-badge';
import { EyeOff, Search } from 'lucide-react';

interface ResponsibilityChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
}

const RESPONSIBILITY_COLORS = {
  subprefeitura: '#10b981', // green
  dzu: '#f59e0b',          // amber
  enel: '#3b82f6',         // blue
  sabesp: '#06b6d4',       // cyan
  outros: '#9ca3af'        // gray
};

const ResponsibilityChart: React.FC<ResponsibilityChartProps> = ({
  data,
  sgzData,
  painelData,
  isLoading,
  isSimulationActive,
  onToggleVisibility,
  onToggleAnalysis
}) => {
  // Process data from sgzData to get responsibility counts
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [subprefeituraPercentage, setSubprefeituraPercentage] = React.useState<number>(0);
  const [isHovering, setIsHovering] = React.useState(false);
  
  React.useEffect(() => {
    if (!isLoading && sgzData) {
      // Count records by responsibility
      const counter: Record<string, number> = {};
      
      sgzData.forEach(item => {
        const resp = (item.servico_responsavel || 'outros').toLowerCase();
        counter[resp] = (counter[resp] || 0) + 1;
      });
      
      // Convert to chart data format
      const transformedData = Object.entries(counter).map(([name, value]) => ({
        name,
        value
      }));
      
      setChartData(transformedData);
      
      // Calculate totals
      const totalCount = transformedData.reduce((sum, item) => sum + item.value, 0);
      setTotal(totalCount);
      
      // Calculate subprefeitura percentage
      const subCount = counter['subprefeitura'] || 0;
      setSubprefeituraPercentage(totalCount > 0 ? Math.round((subCount / totalCount) * 100) : 0);
    }
  }, [sgzData, isLoading]);

  if (isLoading) {
    return (
      <Card className="border border-orange-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Responsabilidade de Ordens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[220px]">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sgzData?.length) {
    return (
      <Card className="border border-orange-200 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Responsabilidade de Ordens</CardTitle>
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
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Responsabilidade de Ordens</span>
          <span className="text-green-600 font-bold text-xs px-2 py-1 bg-green-50 rounded-full">
            {subprefeituraPercentage}% Subprefeitura
          </span>
        </CardTitle>
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
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={RESPONSIBILITY_COLORS[entry.name as keyof typeof RESPONSIBILITY_COLORS] || RESPONSIBILITY_COLORS.outros} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => {
                  return [
                    `${value} (${Math.round((Number(value) / total) * 100)}%)`,
                    <ResponsabilidadeBadge key={String(name)} responsavel={String(name)} />
                  ];
                }}
              />
              <Legend 
                formatter={(value) => {
                  return <ResponsabilidadeBadge responsavel={String(value)} />;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {isSimulationActive && (
          <div className="mt-3 text-sm text-orange-700 bg-orange-50 p-2 rounded-md">
            <p>Simulação: Remoção das OSs de terceiros melhoraria os indicadores em até 35%.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsibilityChart;
