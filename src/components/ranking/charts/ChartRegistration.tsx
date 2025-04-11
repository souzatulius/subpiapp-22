
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

export default ChartJS;
