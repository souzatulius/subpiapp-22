
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';

interface DashboardDesignerProps {
  cards: ActionCardItem[];
  onCardsChange: (cards: ActionCardItem[]) => void;
  isMobilePreview: boolean;
}

const DashboardDesigner: React.FC<DashboardDesignerProps> = ({
  cards,
  onCardsChange,
  isMobilePreview
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Designer de Dashboard</h2>
      <p className="text-sm text-gray-500">
        Esta funcionalidade está sendo migrada para o Preview interativo.
        Por favor, utilize o preview para desenhar e gerenciar o dashboard.
      </p>
    </div>
  );
};

export default DashboardDesigner;
