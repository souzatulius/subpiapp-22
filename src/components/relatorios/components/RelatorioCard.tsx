
import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

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
}

export const RelatorioCard: React.FC<RelatorioCardProps> = ({
  title,
  description,
  children,
  className,
  badge,
  analysis
}) => {
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);

  const toggleAnalysis = () => {
    setIsAnalysisExpanded(!isAnalysisExpanded);
  };

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
        
        {analysis && (
          <div className="mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleAnalysis}
              className="w-full flex justify-between items-center text-sm text-gray-600 hover:bg-gray-100"
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
                className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700"
              >
                {analysis}
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
