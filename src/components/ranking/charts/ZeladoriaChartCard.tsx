
import React from 'react';
import { Bar, Pie, Line, Radar, Doughnut, PolarArea, Scatter } from 'react-chartjs-2';
import { ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js';
import ChartCard from './ChartCard';

interface ZeladoriaChartCardProps {
  title: string;
  subtitle?: string;
  chartType: 'bar' | 'pie' | 'line' | 'radar' | 'doughnut' | 'polarArea' | 'horizontalBar' | 'scatter';
  data: ChartData<keyof ChartTypeRegistry>;
  options?: ChartOptions<keyof ChartTypeRegistry>;
  isLoading?: boolean;
  className?: string;
  height?: number;
  dataSource?: string;
  analysis?: string;
}

const ZeladoriaChartCard: React.FC<ZeladoriaChartCardProps> = ({
  title,
  subtitle,
  chartType,
  data,
  options,
  isLoading = false,
  className = '',
  height = 280,
  dataSource,
  analysis
}) => {
  // Render chart based on type
  const renderChart = () => {
    const chartProps = { data, options, height };
    
    switch (chartType) {
      case 'bar':
        return <Bar {...chartProps as any} />;
      case 'pie':
        return <Pie {...chartProps as any} />;
      case 'line':
        return <Line {...chartProps as any} />;
      case 'radar':
        return <Radar {...chartProps as any} />;
      case 'doughnut':
        return <Doughnut {...chartProps as any} />;
      case 'polarArea':
        return <PolarArea {...chartProps as any} />;
      case 'horizontalBar':
        return <Bar {...chartProps as any} options={{ ...options as any, indexAxis: 'y' }} />;
      case 'scatter':
        return <Scatter {...chartProps as any} />;
      default:
        return <Bar {...chartProps as any} />;
    }
  };

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      dataSource={dataSource}
      className={className}
      analysis={analysis}
    >
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </ChartCard>
  );
};

export default ZeladoriaChartCard;
