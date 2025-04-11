
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Export colors for consistent chart styling
export const chartColors = [
  '#0066FF', // Blue
  '#FF6B00', // Orange
  '#00C49A', // Teal
  '#FF5252', // Red
  '#6366F1', // Purple
  '#10B981', // Green
  '#F97316', // Dark orange
  '#8B5CF6', // Violet
  '#64748B', // Slate
];

// Ensure there's a NoDataMessage component for handling no data state
export const NoDataMessage = () => (
  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
    <p className="text-lg text-gray-500 font-medium">Sem dados disponíveis</p>
    <p className="text-sm text-gray-400 mt-2">Faça o upload de uma planilha SGZ para visualizar as análises</p>
  </div>
);
