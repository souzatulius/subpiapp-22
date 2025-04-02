
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import QuickDemandCard from '../../QuickDemandCard';

interface QuickDemandCardWrapperProps {
  card: ActionCardItem;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const QuickDemandCardWrapper: React.FC<QuickDemandCardWrapperProps> = ({ 
  card, 
  value, 
  onChange, 
  onSubmit 
}) => {
  return (
    <QuickDemandCard 
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default QuickDemandCardWrapper;
