
// Custom color palette for charts based on requirements
export const chartColors = {
  blue: '#095dff',      // Azul 
  green: '#01e30e',     // Verde
  lightGray: '#f4f4f4', // Cinza claro
  darkOrange: '#ea580d', // Laranja escuro
  mediumOrange: '#f4a100', // Laranja médio
  mediumBlue: '#174ba9',  // Azul médio
  darkBlue: '#051b2c',   // Azul escuro
};

// Color arrays for different chart types
export const barChartColors = [
  chartColors.blue,
  chartColors.darkOrange,
  chartColors.mediumBlue,
  chartColors.green,
  chartColors.mediumOrange,
  chartColors.darkBlue,
];

export const pieChartColors = [
  chartColors.darkOrange,
  chartColors.blue,
  chartColors.mediumOrange,
  chartColors.mediumBlue,
  chartColors.green,
  chartColors.darkBlue,
  chartColors.lightGray,
];

// Function to get colors with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};
