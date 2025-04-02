
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import NewCardButton from '../../cards/NewCardButton';

interface NewCardButtonWrapperProps {
  card: ActionCardItem;
  onAddNewCard: () => void;
}

const NewCardButtonWrapper: React.FC<NewCardButtonWrapperProps> = ({ card, onAddNewCard }) => {
  return <NewCardButton onClick={onAddNewCard} />;
};

export default NewCardButtonWrapper;
