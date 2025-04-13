
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import PendingActionsCard from '../../cards/PendingActionsCard';

interface PendingActionsCardWrapperProps {
  card: ActionCardItem;
  notesToApprove: number;
  responsesToDo: number;
  isComunicacao: boolean;
  userDepartmentId: string;
}

const PendingActionsCardWrapper: React.FC<PendingActionsCardWrapperProps> = ({
  card,
  notesToApprove,
  responsesToDo,
  isComunicacao,
  userDepartmentId
}) => {
  return (
    <PendingActionsCard
      // Remove the id prop as it doesn't exist in the component
      notesToApprove={notesToApprove}
      responsesToDo={responsesToDo}
      isComunicacao={isComunicacao}
      userDepartmentId={userDepartmentId}
    />
  );
};

export default PendingActionsCardWrapper;
