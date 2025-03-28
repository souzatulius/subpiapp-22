
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartIcon } from 'lucide-react';

interface RelatorioCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  badge?: {
    text: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "success";
    icon?: ReactNode;
  };
}

export const RelatorioCard: React.FC<RelatorioCardProps> = ({
  title,
  description,
  children,
  className,
  badge
}) => {
  return (
    <Card className={`overflow-hidden shadow-sm ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {badge && (
            <Badge variant={badge.variant || "default"} className="ml-2 flex items-center gap-1">
              {badge.icon}
              {badge.text}
            </Badge>
          )}
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
