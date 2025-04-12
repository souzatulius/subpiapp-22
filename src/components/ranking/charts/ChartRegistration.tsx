
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

// Configure Chart.js defaults
ChartJS.defaults.font.family = "'Inter', 'Helvetica', 'Arial', sans-serif";

// Configure scales to use integer ticks for Y-axis
ChartJS.defaults.scale.y = {
  ...ChartJS.defaults.scale.y,
  ticks: {
    precision: 0,
    callback: function(value) {
      if (Math.floor(value) === value) {
        return value;
      }
      return null;
    }
  }
};

// Add custom plugin for loading indicator
const loadingIndicatorPlugin = {
  id: 'loadingIndicator',
  beforeDraw: (chart, args, options) => {
    const { ctx, width, height } = chart;
    if (options.loading) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#F97316'; // Orange color
      ctx.fillText('Carregando...', width / 2, height / 2);
      
      // Draw spinner
      const spinnerSize = 30;
      const centerX = width / 2;
      const centerY = height / 2 - 30;
      const angle = Date.now() / 300 % (2 * Math.PI);
      
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, spinnerSize / 2, angle, angle + 1.5);
      ctx.stroke();
      
      ctx.restore();
    }
  }
};

// Register the plugin
ChartJS.register(loadingIndicatorPlugin);

// Configure tooltips
ChartJS.defaults.plugins.tooltip = {
  ...ChartJS.defaults.plugins.tooltip,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  titleColor: '#1e293b',
  bodyColor: '#334155',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
  boxWidth: 8,
  boxHeight: 8,
  boxPadding: 4,
  usePointStyle: true
};

// Configure legends
ChartJS.defaults.plugins.legend.labels = {
  ...ChartJS.defaults.plugins.legend.labels,
  usePointStyle: true,
  boxWidth: 8,
  boxHeight: 8,
  padding: 15
};

// Helper function to set loading state
export const setLoading = function(chartInstance, loading) {
  if (!chartInstance) return;
  
  chartInstance.options.plugins = chartInstance.options.plugins || {};
  chartInstance.options.plugins.loadingIndicator = { 
    ...chartInstance.options.plugins.loadingIndicator,
    loading
  };
  chartInstance.update();
};

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

export default ChartJS;
