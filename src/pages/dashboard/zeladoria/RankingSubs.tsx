
import React from 'react';
import { BarChart3 } from 'lucide-react';
import RankingContent from '@/components/ranking/RankingContent';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';

const RankingSubs = () => {
  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeCard
        title="Ranking das Subs"
        description="Dashboard de análise das ordens de serviço do SGZ para acompanhamento dos distritos"
        icon={<BarChart3 className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-orange-500 to-orange-700"
      />

      <div className="mt-6 bg-white rounded-lg border border-orange-200 p-5 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span className="text-sm font-medium">Pinheiros</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span>
              <span className="text-sm font-medium">Itaim Bibi</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-300 mr-2"></span>
              <span className="text-sm font-medium">Alto de Pinheiros</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-200 mr-2"></span>
              <span className="text-sm font-medium">Jardim Paulista</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Departamentos Técnicos: <span className="font-bold text-orange-600">STM</span> | <span className="font-bold text-gray-600">STLP</span>
          </div>
        </div>
      </div>
      <RankingContent />
    </motion.div>
  );
};

export default RankingSubs;
