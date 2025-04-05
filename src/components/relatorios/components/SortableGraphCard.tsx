
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Info, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SortableGraphCardProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  isVisible: boolean;
  showAnalysis: boolean;
  analysis?: string;
  isLoading: boolean;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  className?: string;
  hideMenuIcon?: boolean;
}

export const SortableGraphCard: React.FC<SortableGraphCardProps> = ({
  id,
  title,
  description,
  children,
  isVisible,
  showAnalysis,
  analysis,
  isLoading,
  onToggleVisibility,
  onToggleAnalysis,
  className,
  hideMenuIcon = false
}) => {
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <Card className={cn("w-full border border-blue-200 hover:shadow-md transition-all", className)}>
        <CardHeader className="p-3 pb-1 space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md font-semibold text-gray-800 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-gray-500" />
              {title}
            </CardTitle>
            {!hideMenuIcon && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onToggleVisibility}>
                    {isVisible ? 'Ocultar gráfico' : 'Exibir gráfico'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onToggleAnalysis}>
                    {showAnalysis ? 'Ocultar análise' : 'Mostrar análise'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Exportar dados</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {description && <CardDescription className="text-xs text-gray-500">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="relative h-full">
            {children}
          </div>
          
          {showAnalysis && analysis && (
            <div className="mt-2 bg-blue-50 rounded-md p-2 border border-blue-100">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-xs text-blue-700">
                  {analysis}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
