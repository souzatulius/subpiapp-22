
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChartData, ChartOptions } from 'chart.js';
import { Bar, Pie, Line, Radar, Doughnut, PolarArea } from 'react-chartjs-2';
import { Skeleton } from '@/components/ui/skeleton';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type ChartType = 'bar' | 'pie' | 'line' | 'radar' | 'doughnut' | 'polarArea' | 'horizontalBar';

interface ZeladoriaChartCardProps {
  title: string;
  subtitle?: string;
  data: ChartData<ChartType>;
  options?: ChartOptions<ChartType>;
  chartType: ChartType;
  isLoading?: boolean;
  sourceLabel?: string;
  primaryMetric?: {
    value: string | number;
    label?: string;
    trend?: 'up' | 'down' | 'neutral';
  };
  height?: number;
}

const ZeladoriaChartCard: React.FC<ZeladoriaChartCardProps> = ({
  title,
  subtitle,
  data,
  options,
  chartType,
  isLoading = false,
  sourceLabel,
  primaryMetric,
  height = 300
}) => {
  // Render the appropriate chart type
  const renderChart = () => {
    const chartProps = { data, options };
    
    if (isLoading) {
      return <Skeleton className="w-full h-full" />;
    }
    
    switch (chartType) {
      case 'bar':
        return <Bar {...chartProps as React.ComponentProps<typeof Bar>} />;
      case 'pie':
        return <Pie {...chartProps as React.ComponentProps<typeof Pie>} />;
      case 'line':
        return <Line {...chartProps as React.ComponentProps<typeof Line>} />;
      case 'radar':
        return <Radar {...chartProps as React.ComponentProps<typeof Radar>} />;
      case 'doughnut':
        return <Doughnut {...chartProps as React.ComponentProps<typeof Doughnut>} />;
      case 'polarArea':
        return <PolarArea {...chartProps as React.ComponentProps<typeof PolarArea>} />;
      case 'horizontalBar':
        return (
          <Bar 
            {...chartProps as React.ComponentProps<typeof Bar>}
            options={{
              ...chartProps.options,
              indexAxis: 'y'
            } as ChartOptions<'bar'>} 
          />
        );
      default:
        return <div className="text-center text-gray-500">Tipo de gráfico não suportado</div>;
    }
  };

  const renderTrendIcon = () => {
    if (!primaryMetric?.trend) return null;
    
    switch (primaryMetric.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-gray-800">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          
          {primaryMetric?.value && (
            <div className="flex items-center space-x-1">
              {renderTrendIcon()}
              <div className="text-right">
                <div className="font-semibold text-lg">{primaryMetric.value}</div>
                {primaryMetric.label && (
                  <div className="text-xs text-gray-500">{primaryMetric.label}</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ height: `${height}px` }} className="relative">
          {renderChart()}
        </div>

        {sourceLabel && (
          <div className="mt-2 flex items-center justify-end">
            <Info className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-xs text-gray-400 font-mono">
              Fonte: {sourceLabel}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ZeladoriaChartCard;
