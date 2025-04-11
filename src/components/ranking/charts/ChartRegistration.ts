
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
  Filler,
  ChartDataLabels
);

// Configure the datalabels plugin globally
ChartJS.defaults.set('plugins.datalabels', {
  display: function(context) {
    // Only show data labels on pie/doughnut charts by default
    return context.chart.config.type === 'pie' || context.chart.config.type === 'doughnut';
  },
  formatter: (value, ctx) => {
    const sum = ctx.dataset.data.reduce((a: number, b: number) => Number(a) + Number(b), 0);
    const percentage = Math.round((value * 100) / sum) + '%';
    return percentage;
  },
  color: '#fff',
  font: {
    weight: 'bold',
    size: 12
  },
  textAlign: 'center'
});

// Export chart colors for consistent use across components
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

// Configure default settings for all charts
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.color = '#6B7280';
ChartJS.defaults.elements.line.borderWidth = 2;
ChartJS.defaults.elements.point.radius = 3;
ChartJS.defaults.elements.point.hoverRadius = 5;
