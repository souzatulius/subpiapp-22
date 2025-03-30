import { ReactNode } from 'react';

export type CardColor =
  | 'blue' | 'green' | 'orange' | 'gray-light'
  | 'gray-dark' | 'blue-dark' | 'orange-light'
  | 'gray-ultra-light' | 'lime' | 'orange-600';

export type CardWidth = '25' | '50' | '75' | '100';
export type CardHeight = '1' | '2';

export interface ActionCardItem {
  id: string;
  title: string;
  icon: ReactNode;
  iconId: string;
  path: string;
  color: CardColor;
  width?: CardWidth;
  height?: CardHeight;
  isCustom?: boolean;
  type: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
  displayMobile?: boolean;
  mobileOrder?: number;
  allowedDepartments?: string[];
  allowedRoles?: string[];
  isQuickDemand?: boolean;
  isSearch?: boolean;
  isNewCardButton?: boolean;
  isOverdueDemands?: boolean;
  isPendingActions?: boolean;
}

// Usado para o formulário de edição/criação
export interface FormSchema {
  title: string;
  path: string;
  color: CardColor;
  iconId: string;
  type: 'standard' | 'data_dynamic';
  dataSourceKey?: string;
  width?: CardWidth;
  height?: CardHeight;
  displayMobile?: boolean;
  mobileOrder?: number;
  allowedDepartments: string[];
  allowedRoles: string[];
}

export interface DashboardStateReturn {
  firstName: string;
  actionCards: ActionCardItem[];
  setActionCards: (cards: ActionCardItem[]) => void;
  isCustomizationModalOpen: boolean;
  setIsCustomizationModalOpen: (isOpen: boolean) => void;
  editingCard: ActionCardItem | null;
  handleDeleteCard: (id: string) => void;
  handleAddNewCard: () => void;
  handleEditCard: (card: ActionCardItem) => void;
  handleSaveCard: (card: Partial<ActionCardItem>) => void;
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
  statuses?: string[];
  status?: string[];
  serviceTypes?: string[];
  districts?: string[];
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
