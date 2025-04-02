
import { useState, useEffect, useCallback } from 'react';
import { useUserData } from './useUserData';
import { useDashboardConfig } from './useDashboardConfig';

export interface DashboardState {
  viewType: 'grid' | 'list';
  isLoadingDashboard: boolean;
  actionCards: any[]; // Replace with proper type definition
  user: any; // Replace with proper type definition
  setActionCards: (cards: any[]) => void;
  toggleView: () => void;
  firstName: string;
}

export const useDashboardState = (): DashboardState => {
  const { user } = useUserData();
  const { 
    actionCards, 
    setActionCards,
    isLoadingDashboard,
    viewType,
    setViewType,
    firstName
  } = useDashboardConfig();

  const toggleView = useCallback(() => {
    setViewType(viewType === 'grid' ? 'list' : 'grid');
  }, [viewType, setViewType]);

  return {
    viewType,
    isLoadingDashboard,
    actionCards,
    setActionCards,
    user,
    toggleView,
    firstName
  };
};

export default useDashboardState;
