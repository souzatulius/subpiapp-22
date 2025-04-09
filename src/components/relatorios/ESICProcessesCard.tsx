
import React from 'react';
import { StatsCard } from './components/StatsCard';

interface ESICProcessesCardProps {
  loading?: boolean;
  total?: number;
  responded?: number;
  justified?: number;
}

const ESICProcessesCard: React.FC<ESICProcessesCardProps> = ({
  loading = false,
  total = 0,
  responded = 0,
  justified = 0
}) => {
  // Calculate percentages for display
  const respondedPercent = total > 0 ? Math.round((responded / total) * 100) : 0;
  const justifiedPercent = total > 0 ? Math.round((justified / total) * 100) : 0;

  return (
    <StatsCard
      title="Processos e-SIC"
      value={total}
      comparison={`${respondedPercent}% respondidos | ${justifiedPercent}% justificados`}
      isLoading={loading}
      description="Solicitações de informação"
    />
  );
};

export default ESICProcessesCard;
