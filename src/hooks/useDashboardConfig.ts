
import { useState, useEffect } from 'react';

export interface DashboardConfigResult {
  actionCards: any[];
  setActionCards: (cards: any[]) => void;
  isLoadingDashboard: boolean;
  viewType: 'grid' | 'list';
  setViewType: (viewType: 'grid' | 'list') => void;
  firstName: string;
}

export const useDashboardConfig = (): DashboardConfigResult => {
  const [actionCards, setActionCards] = useState<any[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [firstName, setFirstName] = useState<string>('Usuário');

  useEffect(() => {
    // Mock loading state
    const loadTimer = setTimeout(() => {
      setActionCards([]);
      setIsLoadingDashboard(false);
      
      // Try to get user's first name from localStorage or any other source
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const { name } = JSON.parse(userInfo);
          if (name) {
            const parts = name.split(' ');
            setFirstName(parts[0] || 'Usuário');
          }
        }
      } catch (error) {
        console.error('Error getting user first name:', error);
      }
    }, 500);

    return () => clearTimeout(loadTimer);
  }, []);

  return {
    actionCards,
    setActionCards,
    isLoadingDashboard,
    viewType,
    setViewType,
    firstName
  };
};
