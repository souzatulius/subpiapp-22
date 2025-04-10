
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import PendingTasksCard from '../../cards/PendingTasksCard';

interface PendingTasksCardWrapperProps {
  card: ActionCardItem;
  userDepartmentId?: string;
  isComunicacao?: boolean;
}

const PendingTasksCardWrapper: React.FC<PendingTasksCardWrapperProps> = ({
  card,
  userDepartmentId,
  isComunicacao
}) => {
  return (
    <PendingTasksCard
      id={card.id}
      title={card.title}
      userDepartmentId={userDepartmentId}
      isComunicacao={isComunicacao}
    />
  );
};

export default PendingTasksCardWrapper;
