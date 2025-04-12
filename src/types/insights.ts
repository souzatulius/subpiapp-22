
/**
 * Types for insights and analytics data
 */

export interface InsightData {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  delta?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
}

export interface ChartInsight {
  title: string;
  description?: string;
  insights: InsightData[];
  recommendations?: string[];
}

export interface DatasetInsight {
  name: string;
  value: number | string;
  percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export interface StatusInsight {
  status: string;
  count: number;
  percentage: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface PerformanceInsight {
  title: string;
  value: number | string;
  target?: number;
  progress?: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export interface DistrictInsight {
  name: string;
  total: number;
  completed: number;
  pending: number;
  efficiency: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ServiceInsight {
  name: string;
  count: number;
  averageResolutionTime?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ResponsibilityInsight {
  entity: string;
  count: number;
  percentage: number;
  averageResolutionTime?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface TimeBasedInsight {
  period: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
}

export interface ComparisonInsight {
  name: string;
  valueA: number;
  valueB: number;
  difference: number;
  percentageDifference: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface TrendInsight {
  period: string;
  value: number;
  previousValue?: number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}
