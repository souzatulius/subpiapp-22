
import React from 'react';
import PendingTasksCard from '../cards/PendingTasksCard';

interface PendingTasksCardViewProps {
  className?: string;
}

const PendingTasksCardView: React.FC<PendingTasksCardViewProps> = ({ className }) => {
  return (
    <div className={className}>
      <PendingTasksCard />
    </div>
  );
};

export default PendingTasksCardView;
