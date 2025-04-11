
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

// Configure additional global chart options
ChartJS.defaults.elements.line.borderWidth = 2;
ChartJS.defaults.elements.point.radius = 3;
ChartJS.defaults.elements.point.hoverRadius = 5;

// Add custom plugin for loading indicator
const loadingIndicatorPlugin = {
  id: 'loadingIndicator',
  beforeDraw: (chart, args, options) => {
    const { ctx, width, height } = chart;
    if (options?.loading) {
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

// Helper function to set loading state
export const setLoading = function(chartInstance, loading) {
  if (!chartInstance) return;
  
  chartInstance.options.plugins = chartInstance.options.plugins || {};
  chartInstance.options.plugins.loadingIndicator = chartInstance.options.plugins.loadingIndicator || {};
  chartInstance.options.plugins.loadingIndicator.loading = loading;
  chartInstance.update();
};

// Export chart colors for consistent use across components
export { chartColors, ChartJS };
export { barChartColors, pieChartColors, lineChartColors } from '../utils/chartColors';
