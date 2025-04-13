import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus, Loader2, Search, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface InsightCardProps {
  title: string;
  value: string;
  comment: string;
  isLoading: boolean;
  trend?: 'up' | 'down' | 'neutral';
  isSimulated?: boolean;
  analysis?: string;
}
const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  comment,
  isLoading,
  trend,
  isSimulated = false,
  analysis
}) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Format value to use commas instead of periods for decimal separator (Brazilian format)
  const formatValue = (val: string): string => {
    return val.replace('.', ',');
  };
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Card className={`overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all ${isSimulated ? 'border-orange-300 bg-orange-50' : 'border-blue-100'} relative`}>
        {/* Action buttons on hover */}
        <AnimatePresence>
          {isHovered && !isLoading && <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} transition={{
          duration: 0.2
        }} className="absolute top-2 right-2 flex space-x-1 z-10">
              {analysis && <button onClick={() => setShowAnalysis(!showAnalysis)} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors" title={showAnalysis ? "Mostrar valores" : "Ver análise interpretativa"}>
                  <Search size={14} />
                </button>}
              
              <button onClick={e => e.stopPropagation()} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors" title="Ocultar este card">
                <EyeOff size={14} />
              </button>
            </motion.div>}
        </AnimatePresence>
        
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs">
              {title}
            </h3>
            {trend && <div className={`flex items-center ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                {trend === 'up' ? <TrendingUp size={16} className="animate-pulse" /> : trend === 'down' ? <TrendingDown size={16} className="animate-pulse" /> : <Minus size={16} />}
              </div>}
          </div>
          
          {isLoading ? <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <Skeleton className="h-8 w-24 bg-blue-50" />
                <Loader2 size={16} className="ml-2 animate-spin text-blue-500" />
              </div>
              <Skeleton className="h-4 w-full mt-2 bg-blue-50" />
            </div> : <AnimatePresence mode="wait">
              {showAnalysis && analysis ? <motion.div key="analysis" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.3
          }} className="mt-2">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <p className="text-xs text-blue-800">{analysis}</p>
                  </div>
                  <button onClick={() => setShowAnalysis(false)} className="text-xs text-blue-600 mt-1 hover:text-blue-800">
                    Mostrar valores
                  </button>
                </motion.div> : <motion.div key="values" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            delay: 0.2,
            duration: 0.3
          }}>
                  <p className={`text-2xl font-bold mt-1 text-orange-500`}>
                    {isSimulated ? formatValue(value) : value}
                  </p>
                  <p className="text-xs mt-1.5 text-gray-500">{comment}</p>
                </motion.div>}
            </AnimatePresence>}
        </div>
      </Card>
    </motion.div>;
};
export default InsightCard;