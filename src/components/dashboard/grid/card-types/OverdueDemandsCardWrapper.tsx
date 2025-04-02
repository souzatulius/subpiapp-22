
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import OverdueDemandsCard from '../../cards/OverdueDemandsCard';

interface OverdueDemandsCardWrapperProps {
  card: ActionCardItem;
  overdueCount: number;
  overdueItems: { title: string; id: string }[];
  isComunicacao: boolean;
  userDepartmentId: string;
}

const OverdueDemandsCardWrapper: React.FC<OverdueDemandsCardWrapperProps> = ({
  card,
  overdueCount,
  overdueItems,
  isComunicacao,
  userDepartmentId
}) => {
  return (
    <OverdueDemandsCard
      id={card.id}
      overdueCount={overdueCount}
      overdueItems={overdueItems}
      isComunicacao={isComunicacao}
      userDepartmentId={userDepartmentId}
    />
  );
};

export default OverdueDemandsCardWrapper;
