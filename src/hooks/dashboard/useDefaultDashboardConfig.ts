
import { useState, useEffect } from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { getCommunicationActionCards } from './defaultCards';

export interface UseDefaultDashboardConfigResult {
  config: ActionCardItem[];
  isLoading: boolean;
  setConfig: (cards: ActionCardItem[]) => void;
}

export const useDefaultDashboardConfig = (
  department: string = 'default'
): UseDefaultDashboardConfigResult => {
  const [config, setConfig] = useState<ActionCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    
    // Use predefined cards based on department type
    setTimeout(() => {
      if (department === 'comunicacao') {
        setConfig(getCommunicationActionCards());
      } else {
        // Add an empty Pending Actions card as default
        const defaultPendingCard: ActionCardItem = {
          id: 'pending-actions',
          title: 'Pendências',
          subtitle: 'Ações que precisam da sua atenção',
          iconId: 'alert-triangle',
          path: '/dashboard',
          color: 'orange-dark',
          width: '50',  // Double width
          height: '2',  // Double height
          type: 'special',
          isPendingActions: true,
          displayMobile: true,
          mobileOrder: 1
        };
        
        setConfig([defaultPendingCard]);
      }
      setIsLoading(false);
    }, 300);
  }, [department]);

  return {
    config,
    isLoading,
    setConfig
  };
};
