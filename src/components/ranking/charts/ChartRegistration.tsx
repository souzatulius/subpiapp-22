
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
import { chartColors, lineChartColors, barChartColors, pieChartColors } from '../utils/chartColors';

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

// Set up chart defaults
ChartJS.defaults.color = chartColors.darkBlue;
ChartJS.defaults.font.family = "'Inter', sans-serif";

// Configure chart element defaults
ChartJS.defaults.elements.bar.backgroundColor = chartColors.blue;
ChartJS.defaults.elements.line.borderColor = chartColors.blue;
ChartJS.defaults.elements.point.backgroundColor = chartColors.blue;
ChartJS.defaults.elements.line.borderWidth = 2;
ChartJS.defaults.elements.point.radius = 3;
ChartJS.defaults.elements.point.hoverRadius = 5;

// Export everything
export { chartColors, barChartColors, pieChartColors, lineChartColors };

// Ensure there's a NoDataMessage component for handling no data state
export const NoDataMessage = () => (
  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
    <p className="text-lg text-gray-500 font-medium">Sem dados disponíveis</p>
    <p className="text-sm text-gray-400 mt-2">Faça o upload de uma planilha SGZ para visualizar as análises</p>
  </div>
);
