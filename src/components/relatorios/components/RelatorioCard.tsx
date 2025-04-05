
import React, { ReactNode } from 'react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';

interface RelatorioCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  badge?: {
    text: string;
    variant?: "default" | "destructive" | "outline" | "secondary";
    icon?: ReactNode;
  };
  analysis?: string;
  value?: string | number;
  isLoading?: boolean;
}

export const RelatorioCard: React.FC<RelatorioCardProps> = ({
  title,
  description,
  children,
  className,
  badge,
  value,
  isLoading = false
}) => {
  // Format value with comma as decimal separator
  const formatValue = (val: string | number): string => {
    const stringValue = val.toString();
    if (stringValue.includes('.')) {
      return stringValue.replace('.', ',');
    }
    return stringValue;
  };
  
  return (
    <div className={`h-full border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-lg ${className}`}>
      <div className="pb-2 border-b border-blue-200 p-4 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-blue-700">{title}</h3>
          {badge && (
            <Badge variant={badge.variant || "default"} className="ml-2 flex items-center gap-1 bg-blue-500">
              {badge.icon}
              {badge.text}
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {isLoading ? <Skeleton className="h-4 w-24 bg-gray-200 rounded" /> : description}
        </div>
        {value && <div className="text-2xl font-bold text-blue-600 mt-1">{isLoading ? <Skeleton className="h-8 w-16 bg-gray-200 rounded" /> : formatValue(value)}</div>}
      </div>
      <div className="p-4">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full bg-gray-200 rounded" />
        ) : (
          <div className="h-[250px] overflow-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
