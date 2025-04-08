
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface ESICProcessesCardProps {
  loading?: boolean;
}

export const ESICProcessesCard: React.FC<ESICProcessesCardProps> = ({ loading = false }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    // Start animation after component mounts
    const timeout = setTimeout(() => setIsAnimated(true), 300);
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
          <BarChart className="mr-2 h-4 w-4" />
          Processos no e-SIC
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <motion.div 
                className="text-3xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                8
              </motion.div>
              <div className="text-sm text-gray-500">respondidos do total de 21</div>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Resposta</span>
                <span className="font-medium">6 min</span>
              </div>
              
              <div className="flex items-center text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">21% + rápido na semana</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ESICProcessesCard;
