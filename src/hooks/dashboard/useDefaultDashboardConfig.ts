
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
        setConfig([]);
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
