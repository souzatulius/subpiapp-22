
import React from 'react';
import { BarChart3, SlidersHorizontal } from 'lucide-react';
import RankingContent from '@/components/ranking/RankingContent';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';

const RankingSubs = () => {
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  
  return (
    <motion.div 
      className="max-w-7xl mx-auto" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center pb-2 border-b border-blue-200">
          <BarChart3 className="h-6 w-6 mr-2 text-blue-700" />
          Ranking das Subprefeituras
        </h1>
        <p className="text-gray-600 mt-2">
          Dashboard de análise das ordens de serviço do SGZ para acompanhamento dos distritos
        </p>
      </div>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setFilterDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros e Visualização
        </button>
      </div>
      
      <div className="mt-6">
        <RankingContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} />
      </div>
    </motion.div>
  );
};

export default RankingSubs;
