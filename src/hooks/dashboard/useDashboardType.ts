
/**
 * This file defines the dashboard types supported in the application
 */

// Define the dashboard types
export type DashboardType = 'main' | 'communication' | 'zeladoria' | 'esic';

// Helper function to get the appropriate table name based on dashboard type
export const getDashboardTableName = (type: DashboardType, isUser: boolean = true): string => {
  if (isUser) {
    // User-specific dashboard tables
    switch (type) {
      case 'main':
        return 'user_dashboard';
      case 'communication':
        return 'user_dashboard_comunicacao';
      case 'zeladoria':
        return 'user_dashboard_zeladoria';
      case 'esic':
        return 'user_dashboard_esic';
      default:
        return 'user_dashboard';
    }
  } else {
    // Department dashboard tables
    switch (type) {
      case 'main':
        return 'department_dashboard';
      case 'communication':
        return 'department_dashboard_comunicacao';
      case 'zeladoria':
        return 'department_dashboard_zeladoria';
      case 'esic':
        return 'department_dashboard_esic';
      default:
        return 'department_dashboard';
    }
  }
};

export default getDashboardTableName;
