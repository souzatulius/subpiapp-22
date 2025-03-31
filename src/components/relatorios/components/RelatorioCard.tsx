
import React, { ReactNode, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
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
  analysis,
  value,
  isLoading = false
}) => {
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);

  const toggleAnalysis = () => {
    setIsAnalysisExpanded(!isAnalysisExpanded);
  };

  return (
    <div className={`h-full border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl ${className}`}>
      <div className="pb-2 border-b border-orange-200 p-4 bg-gradient-to-r from-orange-50 to-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-orange-800">{title}</h3>
          {badge && (
            <Badge variant={badge.variant || "default"} className="ml-2 flex items-center gap-1 bg-orange-200 text-orange-800">
              {badge.icon}
              {badge.text}
            </Badge>
          )}
        </div>
        <div className="text-2xl font-bold text-orange-700">
          {isLoading ? <Skeleton className="h-8 w-24 bg-orange-100" /> : value || (description && <p className="text-orange-600">{description}</p>)}
        </div>
      </div>
      <div className="p-2">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full bg-orange-50" />
        ) : (
          <div className="h-[250px] overflow-auto">
            {children}
          </div>
        )}
        
        {analysis && (
          <div className="mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleAnalysis}
              className="w-full flex justify-between items-center text-sm text-orange-600 hover:bg-orange-100"
            >
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                <span>Análise detalhada</span>
              </div>
              {isAnalysisExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {isAnalysisExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-2 p-3 bg-orange-100 rounded-md text-sm text-orange-800"
              >
                {analysis}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
