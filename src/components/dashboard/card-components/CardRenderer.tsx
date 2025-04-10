
import React from 'react';
import ChartPreview from '../charts/ChartPreview';

interface CardRendererProps {
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  textColorClass: string;
  renderIcon: () => React.ReactNode | null;
  title: string;
  subtitle?: string;
  specialContent?: React.ReactNode;
  children?: React.ReactNode;
  chartId?: string;
}

export const CardRenderer: React.FC<CardRendererProps> = ({
  textColorClass,
  renderIcon,
  title,
  subtitle,
  specialContent,
  children,
  chartId
}) => {
  if (specialContent) {
    return (
      <div className="w-full h-full">{specialContent}</div>
    );
  } 
  
  if (children) {
    return children;
  } 
  
  if (chartId) {
    return (
      <div className="w-full h-full flex flex-col">
        <ChartPreview chartId={chartId} />
      </div>
    );
  }

  return (
    <>
      <div className={`mb-2.5 ${textColorClass}`}>
        {renderIcon()}
      </div>
      <div className="line-clamp-2 max-w-[90%]">
        <h3 className={`font-semibold ${textColorClass} text-lg leading-tight break-words text-balance`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`text-sm ${textColorClass} opacity-80 mt-1 line-clamp-2`}>
            {subtitle}
          </p>
        )}
      </div>
    </>
  );
};

export default CardRenderer;
