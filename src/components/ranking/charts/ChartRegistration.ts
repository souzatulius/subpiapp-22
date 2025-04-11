
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  RadialLinearScale, 
  Filler 
} from 'chart.js';
import { chartColors } from '../utils/chartColors';

// Register the chart components to make them available globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

// Configure default settings for all charts with our custom colors
ChartJS.defaults.color = chartColors.darkBlue;
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.elements.bar.backgroundColor = chartColors.blue;
ChartJS.defaults.elements.line.borderColor = chartColors.blue;
ChartJS.defaults.elements.point.backgroundColor = chartColors.blue;

// Export chart colors for consistent use across components
export { chartColors, barChartColors, pieChartColors } from '../utils/chartColors';

// Configure additional global chart options
ChartJS.defaults.elements.line.borderWidth = 2;
ChartJS.defaults.elements.point.radius = 3;
ChartJS.defaults.elements.point.hoverRadius = 5;
