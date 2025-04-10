
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DemandasChart from './DemandasChart';
import { Loader2 } from 'lucide-react';

interface OriginsDemandChartProps {
  className?: string;
  title?: string;
  subtitle?: string;
  color?: string;
}

const OriginsDemandChartCompact: React.FC<OriginsDemandChartProps> = ({ 
  className = '', 
  title = 'Atividades em Andamento',
  subtitle = 'Demandas da semana por área técnica', 
  color = 'bg-blue-50' 
}) => {
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <span>{title}</span>
        </CardTitle>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-full w-full">
          <DemandasChart />
        </div>
      </CardContent>
    </Card>
  );
};

export default OriginsDemandChartCompact;
