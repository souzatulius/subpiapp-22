
import { useState } from 'react';

export type DashboardType = 'main' | 'communication';

/**
 * Hook to manage dashboard type and corresponding table names
 */
export const useDashboardType = (initialType: DashboardType = 'main') => {
  const [dashboardType, setDashboardType] = useState<DashboardType>(initialType);
  
  // Get the user table name based on the dashboard type
  const getUserTableName = (): string => {
    return dashboardType === 'main' 
      ? 'user_dashboard' 
      : 'user_dashboard_comunicacao';
  };
  
  // Get the department table name based on the dashboard type
  const getDepartmentTableName = (): string => {
    return dashboardType === 'main' 
      ? 'department_dashboard' 
      : 'department_dashboard_comunicacao';
  };
  
  return {
    dashboardType,
    setDashboardType,
    getUserTableName,
    getDepartmentTableName
  };
};
