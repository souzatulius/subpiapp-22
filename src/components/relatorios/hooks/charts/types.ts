
import React from 'react';

export interface ChartComponentsCollection {
  [key: string]: React.ReactNode;
}

export interface ChartData {
  name: string;
  value?: number;
  Demandas?: number;
  Aprovacao?: number;
  Quantidade?: number;
  [key: string]: any;
}

// Add explicit type for ChartConfigs
export interface ChartConfigs {
  chartColors: string[];
  pieChartColors: string[];
}
