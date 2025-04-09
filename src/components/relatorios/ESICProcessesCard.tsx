
import React from 'react';
import { StatsCard } from './components/StatsCard';

interface ESICProcessesCardProps {
  loading?: boolean;
}

const ESICProcessesCard: React.FC<ESICProcessesCardProps> = ({ loading = false }) => {
  return (
    <StatsCard
      title="Processos e-SIC"
      value={120}
      comparison="75% respondidos | 25% justificados"
      isLoading={loading}
      description="Solicitações de informação"
    />
  );
};

export default ESICProcessesCard;
