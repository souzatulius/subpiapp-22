
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
  return (
    <div 
      className={`h-full border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl cursor-grab ${className}`}
    >
      <div className="pb-2 border-b border-orange-200 p-4 bg-gradient-to-r from-orange-50 to-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-orange-800">{title}</h3>
          {badge && (
            <Badge variant={badge.variant || "default"} className="ml-2 flex items-center gap-1 bg-orange-200 text-orange-800 rounded-full">
              {badge.icon}
              {badge.text}
            </Badge>
          )}
        </div>
        <div className="text-sm text-orange-600 mt-1">
          {isLoading ? <Skeleton className="h-4 w-24 bg-orange-100 rounded" /> : description}
        </div>
        {value && <div className="text-2xl font-bold text-orange-700 mt-1">{isLoading ? <Skeleton className="h-8 w-16 bg-orange-100 rounded" /> : value}</div>}
      </div>
      <div className="p-2">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full bg-orange-50 rounded-lg" />
        ) : (
          <div className="h-[250px] overflow-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
