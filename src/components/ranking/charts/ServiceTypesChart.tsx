
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutList } from 'lucide-react';

interface ServiceTypesChartProps {
  data: any;
  sgzData: any[] | null;
  isLoading: boolean;
  isSimulationActive: boolean;
}

const ServiceTypesChart: React.FC<ServiceTypesChartProps> = ({ 
  data, 
  sgzData, 
  isLoading, 
  isSimulationActive 
}) => {
  return (
    <Card className="border-gray-200 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <LayoutList className="h-4 w-4 text-orange-500" />
          Distribuição por Tipo de Serviço
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-56 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="h-56 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">{isSimulationActive ? 'Simulação de ' : ''}Gráfico de Tipos de Serviço</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceTypesChart;
