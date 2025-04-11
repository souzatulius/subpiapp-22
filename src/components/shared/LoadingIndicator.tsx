
import React from 'react';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

type LoadingType = 'loading' | 'refreshing' | 'error';

interface LoadingIndicatorProps {
  message?: string;
  type?: LoadingType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Carregando...",
  type = "loading",
  className = "",
  size = "md"
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };
  
  const containerClasses = {
    sm: "h-[20vh]",
    md: "h-[50vh]", 
    lg: "h-[70vh]"
  };
  
  const textClasses = {
    sm: "text-sm",
    md: "text-lg", 
    lg: "text-xl"
  };
  
  const renderIcon = () => {
    const iconClass = `${sizeClasses[size]} animate-spin mb-4 ${type === 'error' ? 'text-red-600' : 'text-blue-600'}`;
    
    switch(type) {
      case 'loading':
        return <Loader2 className={iconClass} />;
      case 'refreshing':
        return <RefreshCw className={iconClass} />;
      case 'error':
        return <AlertTriangle className={`${sizeClasses[size]} mb-4 text-red-600`} />;
      default:
        return <Loader2 className={iconClass} />;
    }
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}>
      {renderIcon()}
      <span className={`${type === 'error' ? 'text-red-600' : 'text-blue-600'} font-medium ${textClasses[size]}`}>
        {message}
      </span>
    </div>
  );
};

export default LoadingIndicator;
