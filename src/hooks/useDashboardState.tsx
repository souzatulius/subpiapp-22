
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
}

export const useDashboardState = (): DashboardState => {
  const { user } = useUserData();
  const { 
    actionCards, 
    setActionCards,
    isLoadingDashboard,
    viewType,
    setViewType
  } = useDashboardConfig();

  const toggleView = useCallback(() => {
    setViewType(prevType => prevType === 'grid' ? 'list' : 'grid');
  }, [setViewType]);

  return {
    viewType,
    isLoadingDashboard,
    actionCards,
    setActionCards,
    user,
    toggleView
  };
};

export default useDashboardState;
