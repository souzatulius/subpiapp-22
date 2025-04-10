
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

interface ResponsibilityChartProps {
  data: any;
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ResponsibilityChart: React.FC<ResponsibilityChartProps> = ({ 
  data, 
  sgzData, 
  painelData,
  isLoading, 
  isSimulationActive 
}) => {
  return (
    <Card className="border-gray-200 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-orange-500" />
          Responsabilidade (Sub vs Externo)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-56 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="h-56 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">{isSimulationActive ? 'Simulação de ' : ''}Gráfico de Responsabilidade</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsibilityChart;
