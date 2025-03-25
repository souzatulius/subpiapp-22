
import React from 'react';
import RankingContent from '@/components/ranking/RankingContent';
import { motion } from 'framer-motion';

const RankingSubs = () => {
  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 bg-white rounded-lg border border-orange-200 p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-orange-700 mb-3">Dados SGZ - Ranking das Subs</h1>
        <p className="text-gray-600 mb-4">
          Dashboard de análise das ordens de serviço do SGZ (Sistema de Gestão da Zeladoria) para acompanhamento 
          dos distritos da Subprefeitura de Pinheiros.
        </p>
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
