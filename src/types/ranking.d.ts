
export interface ChartItem {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  isVisible: boolean;
  analysis?: string;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  order: number;
  visible: boolean;
  subtitle?: string;
  type?: string;
}

export interface ChartVisibility {
  [key: string]: boolean;
}

export interface ChartData {
  [key: string]: any;
}
