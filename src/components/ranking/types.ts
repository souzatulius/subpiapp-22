
import React from 'react';

export interface ChartItem {
  id: string;
  title: string;
  component: React.ReactNode;
  analysis?: string;
  isVisible: boolean;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  description?: string; // Added to support existing usages
}

export interface ChartVisibility {
  districtPerformance: boolean;
  serviceTypes: boolean;
  resolutionTime: boolean;
  responsibility: boolean;
  evolution: boolean;
  departmentComparison: boolean;
  oldestPendingList: boolean;
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
}

export interface FilterOptions {
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  status?: string[];
  serviceTypes?: string[];
  distritos?: string[];
  dataInicio?: string;
  dataFim?: string;
  tiposServico?: string[];
  departamento?: string[];
}

// Add react-beautiful-dnd types/interfaces for our components
export interface DragEndResult {
  draggableId: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  destination: {
    index: number;
    droppableId: string;
  } | null;
  reason: 'DROP' | 'CANCEL';
}
