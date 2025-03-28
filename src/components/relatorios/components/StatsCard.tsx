
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
  formatter?: (value: number | string) => string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  changeLabel,
  className = '',
  formatter = (val) => String(val)
}) => {
  // Determine if the change is positive or negative
  const isPositive = change !== undefined ? change >= 0 : undefined;
  const formattedValue = typeof value === 'number' ? formatter(value) : value;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-5 w-5 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {change !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            {isPositive ? (
              <TrendingUpIcon className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDownIcon className="h-3 w-3 text-red-500" />
            )}
            <span
              className={
                isPositive ? "text-green-500" : "text-red-500"
              }
            >
              {isPositive ? '+' : ''}{change}% {changeLabel || 'em relação ao período anterior'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
