
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

// Configure scales to use integer ticks for Y-axis - Ensure this works properly
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
ChartJS.setLoading = function(chartInstance, loading) {
  chartInstance.options.plugins.loadingIndicator = { 
    ...chartInstance.options.plugins.loadingIndicator,
    loading
  };
  chartInstance.update();
};

export default ChartJS;
