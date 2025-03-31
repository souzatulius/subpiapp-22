
import { ReactNode } from 'react';

// Re-export the types from the main dashboard types file with proper 'export type' syntax
export type { CardColor, CardWidth, CardHeight, CardType, DataSourceKey, ActionCardItem } from '@/types/dashboard';

// Used for form editing/creation - kept here for backward compatibility
export interface FormSchema {
  title: string;
  path: string;
  color: string; // Using string type to avoid circular references
  iconId: string;
  type: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
  width?: string;
  height?: string;
  displayMobile?: boolean;
  mobileOrder?: number;
  allowedDepartments: string[];
  allowedRoles: string[];
}

export interface DashboardStateReturn {
  firstName: string;
  actionCards: import('@/types/dashboard').ActionCardItem[];
  setActionCards: (cards: import('@/types/dashboard').ActionCardItem[]) => void;
  isCustomizationModalOpen: boolean;
  setIsCustomizationModalOpen: (isOpen: boolean) => void;
  editingCard: import('@/types/dashboard').ActionCardItem | null;
  handleDeleteCard: (id: string) => void;
  handleAddNewCard: () => void;
  handleEditCard: (card: import('@/types/dashboard').ActionCardItem) => void;
  handleSaveCard: (card: Partial<import('@/types/dashboard').ActionCardItem>) => void;
  newDemandTitle: string;
  setNewDemandTitle: (title: string) => void;
  handleQuickDemandSubmit: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (query: string) => void;
  specialCardsData: {
    overdueCount: number;
    overdueItems: { title: string; id: string }[];
    notesToApprove: number;
    responsesToDo: number;
    isLoading: boolean;
  };
  userCoordenaticaoId: string | null;
}

export interface ChartVisibility {
  statusDistribution: boolean;
  topCompanies: boolean;
  districtDistribution: boolean;
  servicesByDepartment: boolean;
  servicesByDistrict: boolean;
  timeComparison: boolean;
  dailyDemands: boolean;
  statusTransition: boolean;
  closureTime: boolean;
  neighborhoodComparison: boolean;
  districtEfficiencyRadar: boolean;
  externalDistricts: boolean;
  efficiencyImpact: boolean;
  criticalStatus: boolean;
  serviceDiversity: boolean;
  districtPerformance: boolean;
  serviceTypes: boolean;
  resolutionTime: boolean;
  responsibility: boolean;
  evolution: boolean;
  departmentComparison: boolean;
  oldestPendingList: boolean;
}

export interface FilterOptions {
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  status?: string[];
  serviceTypes?: string[];
  distritos?: string[];
}

export interface ChartItem {
  id: string;
  title: string;
  component: JSX.Element;
  isVisible: boolean;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  analysis: string;
}
