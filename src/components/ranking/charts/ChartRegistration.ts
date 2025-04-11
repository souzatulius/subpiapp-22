
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Export chart colors for consistent use
export const chartColors = [
  '#0066FF', // Blue
  '#F97316', // Orange
  '#10B981', // Green
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#64748B', // Slate
  '#0EA5E9', // Sky
];

export const pieChartColors = [
  '#0066FF', // Blue
  '#F97316', // Orange
  '#10B981', // Green
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#64748B', // Slate
  '#0EA5E9', // Sky
];

export const barChartColors = [
  '#0066FF', // Blue
  '#F97316', // Orange
  '#10B981', // Green
  '#6366F1', // Indigo
  '#EC4899', // Pink
];

export const lineChartColors = [
  '#0066FF', // Blue
  '#F97316', // Orange
  '#10B981', // Green
  '#6366F1', // Indigo
  '#EC4899', // Pink
];

// Helper to set loading state on charts
export const setLoading = (chartInstance: any, isLoading: boolean) => {
  if (!chartInstance) return;
  
  if (isLoading) {
    chartInstance.options = {
      ...chartInstance.options,
      animation: false
    };
    chartInstance.update();
  } else {
    chartInstance.options = {
      ...chartInstance.options,
      animation: {
        duration: 600
      }
    };
    chartInstance.update();
  }
};
