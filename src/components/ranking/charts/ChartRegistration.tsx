
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

// Register Chart.js components to ensure they're available throughout the app
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

// Configure default settings for all charts
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.color = '#6B7280';
ChartJS.defaults.elements.line.borderWidth = 2;
ChartJS.defaults.elements.point.radius = 3;
ChartJS.defaults.elements.point.hoverRadius = 5;

export const chartColors = [
  '#F97316', // orange-500
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#8B5CF6', // violet-500
  '#EF4444', // red-500
  '#F59E0B', // amber-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#6366F1', // indigo-500
  '#84CC16'  // lime-500
];
