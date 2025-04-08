
import React from 'react';
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  data: any[];
  colors?: string[];
  colorSet?: 'default' | 'blue' | 'orange' | 'mixed';
  showLabels?: boolean;
  showOnlyPercentage?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left' | 'none';
  largePercentage?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  colors,
  colorSet = 'default',
  showLabels = false,
  showOnlyPercentage = false,
  legendPosition = 'right',
  largePercentage = false
}) => {
  // Define color sets for consistent styling
  const colorSets = {
    default: ['#F97316', '#EA580C', '#0066FF', '#1E40AF', '#64748B', '#334155'],
    blue: ['#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8'],
    orange: ['#F97316', '#EA580C', '#c2410c', '#9a3412', '#fb923c'],
    mixed: ['#F97316', '#EA580C', '#0066FF', '#1E40AF', '#64748B', '#334155']
  };

  // Choose colors from predefined sets or use provided colors
  const chartColors = colors || colorSets[colorSet];
  
  // Calculate total for percentage
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">Sem dados disponíveis</p>
      </div>
    );
  }

  // Custom tooltip formatter for percentage or value display
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="p-2 bg-white shadow-md border rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          {showOnlyPercentage ? (
            <p className="text-sm">{percentage}%</p>
          ) : (
            <p className="text-sm">{payload[0].value} ({percentage}%)</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate layout based on legend position
  const getLayout = () => {
    if (legendPosition === 'left' || legendPosition === 'right') {
      return { 
        pieRadius: 70, 
        legendVertical: true,
        legendAlign: legendPosition,
        legendLayout: 'vertical' as const
      };
    } else if (legendPosition === 'none') {
      return {
        pieRadius: 90,
        legendVertical: false,
        legendAlign: 'center' as const,
        legendLayout: 'horizontal' as const,
        showLegend: false
      };
    } else {
      return { 
        pieRadius: 80, 
        legendVertical: false,
        legendAlign: 'center' as const,
        legendLayout: 'horizontal' as const,
        showLegend: true
      };
    }
  };

  const { pieRadius, legendVertical, legendAlign, legendLayout, showLegend = true } = getLayout();

  // Create external percentage labels
  const renderPercentageLabels = () => {
    return (
      <div className="absolute top-0 right-4 bottom-0 flex flex-col justify-center">
        {data.map((entry, index) => {
          const percentage = ((entry.value / total) * 100).toFixed(0);
          return (
            <div key={`label-${index}`} className="flex items-center mb-3">
              <div 
                className="w-3 h-3 mr-2 rounded-sm" 
                style={{ backgroundColor: chartColors[index % chartColors.length] }}
              />
              <span className="text-sm font-medium">{entry.name}: <span className="font-bold">{percentage}%</span></span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 0, right: largePercentage ? 80 : 0, bottom: 0, left: 0 }}>
          <Tooltip content={customTooltip} />
          <Pie
            data={data}
            cx="40%"
            cy={legendPosition === 'bottom' ? "40%" : "50%"}
            labelLine={false}
            label={false}
            outerRadius={pieRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          {showLegend && !largePercentage && (
            <Legend 
              layout={legendLayout}
              verticalAlign={legendPosition === 'top' ? 'top' : legendPosition === 'bottom' ? 'bottom' : 'middle'}
              align={legendPosition === 'right' ? 'right' : legendPosition === 'left' ? 'left' : 'center'}
              iconType="circle"
              iconSize={10}
              wrapperStyle={
                legendPosition === 'bottom' ? 
                { paddingTop: '20px' } : 
                legendPosition === 'top' ? 
                { paddingBottom: '20px' } : 
                {}
              }
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
      {largePercentage && renderPercentageLabels()}
    </div>
  );
};
