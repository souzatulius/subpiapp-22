
// Import necessário para registrar plugins de Chart.js 
import { Chart, ChartOptions, registerables } from 'chart.js';

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

// Paleta de cores em tons de laranja
export const orangePalette = [
  '#fb923c', // orange-400
  '#f97316', // orange-500
  '#ea580c', // orange-600
  '#c2410c', // orange-700
  '#9a3412', // orange-800
];

// Paleta alternada laranja/cinza
export const orangeGrayPalette = [
  '#f97316', // orange-500
  '#71717a', // gray-500
  '#ea580c', // orange-600
  '#52525b', // gray-600
  '#c2410c', // orange-700
  '#3f3f46', // gray-700
];

// Função de utilidade para gerar tons de laranja baseado em índice
export const getOrangeShade = (index: number): string => {
  const shades = ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c'];
  return shades[index % shades.length];
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
  orange: {
    backgroundColor: orangePalette,
    borderColor: orangePalette.map(color => color),
    hoverBackgroundColor: orangePalette.map(color => color),
    hoverBorderColor: '#ffffff',
  },
  orangeGray: {
    backgroundColor: orangeGrayPalette,
    borderColor: orangeGrayPalette.map(color => color),
    hoverBackgroundColor: orangeGrayPalette.map(color => color),
    hoverBorderColor: '#ffffff',
  },
};
