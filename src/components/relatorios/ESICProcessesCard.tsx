
import React from 'react';
import { StatsCard } from './components/StatsCard';

interface ESICProcessesCardProps {
  loading?: boolean;
  total?: number;
  responded?: number;
  justified?: number;
  description?: string;
  percentText?: string;
}

const ESICProcessesCard: React.FC<ESICProcessesCardProps> = ({
  loading = false,
  total = 0,
  responded = 0,
  justified = 0,
  description,
  percentText
}) => {
  // Calculate percentages for display
  const respondedPercent = total > 0 ? Math.round((responded / total) * 100) : 0;
  const justifiedPercent = total > 0 ? Math.round((justified / total) * 100) : 0;

  // Use provided percentText or calculate the default one
  const comparisonText = percentText || 
    `${respondedPercent}% respondidos | ${justifiedPercent}% justificados`;

  return (
    <StatsCard
      title="Processos e-SIC"
      value={total}
      comparison={comparisonText}
      isLoading={loading}
      description={description || "Solicitações de informação"}
    />
  );
};

export default ESICProcessesCard;
