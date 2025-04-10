
// Import necessário para registrar plugins de Chart.js 
import { Chart, ChartOptions, registerables } from 'chart.js';
import { barChartColors, pieChartColors, lineChartColors } from '../utils/chartColors';

// Registrar todos os componentes necessários do Chart.js 
Chart.register(...registerables);

// Configurações padrão para todos os gráficos
Chart.defaults.color = '#71717a'; // text-gray-500
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.7)';
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 4;
Chart.defaults.plugins.tooltip.titleFont = { weight: 'bold', size: 13 };

// Configurações animação
Chart.defaults.animation = {
  duration: 800,
  easing: 'easeOutQuart',
};

// Configurações para eixos
Chart.defaults.scales.linear.beginAtZero = true;

// Paleta de cores em tons de laranja e azul
export const customPalette = [
  '#0368fe', // Blue primary
  '#f26812', // Orange secondary
  '#1e40af', // Dark blue
  '#64748e', // Gray
  '#c2410c', // Dark orange/brown
];

// Paleta alternada laranja/azul
export const alternatingPalette = [
  '#0368fe', // Blue primary
  '#f26812', // Orange secondary
  '#1e40af', // Dark blue
  '#c2410c', // Dark orange/brown
  '#64748e', // Gray
];

// Função de utilidade para gerar tons de laranja baseado em índice
export const getOrangeShade = (index: number): string => {
  return customPalette[index % customPalette.length];
};

// Função de utilidade para formatar números
export const formatNumber = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

// Função de utilidade para formatar datas
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Função de utilidade para formatar tempo em dias
export const formatDays = (days: number): string => {
  if (days === 1) return '1 dia';
  return `${days} dias`;
};

// Configurações para temas
export const chartTheme = {
  primary: {
    backgroundColor: barChartColors,
    borderColor: barChartColors.map(color => color),
    hoverBackgroundColor: barChartColors.map(color => color),
    hoverBorderColor: '#ffffff',
  },
  alternating: {
    backgroundColor: alternatingPalette,
    borderColor: alternatingPalette.map(color => color),
    hoverBackgroundColor: alternatingPalette.map(color => color),
    hoverBorderColor: '#ffffff',
  },
};
