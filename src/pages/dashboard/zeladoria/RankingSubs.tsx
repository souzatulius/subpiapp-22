
import React from 'react';
import RankingContent from '@/components/ranking/RankingContent';

const RankingSubs = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-700 mb-6">Dados SGZ - Ranking das Subs</h1>
      <p className="text-gray-600 mb-6">
        Dashboard de análise das ordens de serviço do SGZ (Sistema de Gestão da Zeladoria) para acompanhamento 
        dos distritos da Subprefeitura de Pinheiros.
      </p>
      <RankingContent />
    </div>
  );
};

export default RankingSubs;
