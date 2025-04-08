
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale } from 'chart.js';
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

// Export nothing, this file is just for side effects
export {};
