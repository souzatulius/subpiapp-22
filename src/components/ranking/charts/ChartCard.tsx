
import React from 'react';
import EnhancedChartCard from '../EnhancedChartCard';
import { LoadingState } from './ChartLoadingOverlay';

interface ChartCardProps {
  title: string;
  value?: string | number;
  isLoading: boolean;
  children: React.ReactNode;
  subtitle?: string;
  loadingState?: LoadingState;
  loadingMessage?: string;
  errorMessage?: string;
  dataSource?: 'SGZ' | 'Painel da Zeladoria' | string;
  onToggleAnalysis?: () => void;
  onToggleVisibility?: () => void;
  chartRef?: React.RefObject<any>;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  value,
  isLoading,
  children,
  subtitle,
  loadingState = 'idle',
  loadingMessage,
  errorMessage,
  dataSource,
  onToggleAnalysis,
  onToggleVisibility,
  chartRef,
  className
}) => {
  // If a value is provided, add it to the title
  const displayTitle = value ? `${title}` : title;

  return (
    <EnhancedChartCard
      title={displayTitle}
      isLoading={isLoading}
      chartRef={chartRef}
      loadingState={loadingState}
      loadingMessage={loadingMessage}
      errorMessage={errorMessage}
      dataSource={dataSource}
      onToggleAnalysis={onToggleAnalysis}
      onToggleVisibility={onToggleVisibility}
      className={className}
    >
      {children}
    </EnhancedChartCard>
  );
};

export default ChartCard;
