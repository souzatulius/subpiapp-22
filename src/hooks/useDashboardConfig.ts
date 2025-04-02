
import { useState, useEffect } from 'react';

export interface DashboardConfigResult {
  actionCards: any[];
  setActionCards: (cards: any[]) => void;
  isLoadingDashboard: boolean;
  viewType: 'grid' | 'list';
  setViewType: (viewType: 'grid' | 'list') => void;
}

export const useDashboardConfig = (): DashboardConfigResult => {
  const [actionCards, setActionCards] = useState<any[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Mock loading state
    const loadTimer = setTimeout(() => {
      setActionCards([]);
      setIsLoadingDashboard(false);
    }, 500);

    return () => clearTimeout(loadTimer);
  }, []);

  return {
    actionCards,
    setActionCards,
    isLoadingDashboard,
    viewType,
    setViewType
  };
};
