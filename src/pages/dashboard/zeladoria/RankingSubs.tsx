
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SGZContent from '@/components/ranking/SGZContent';

const RankingSubs = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Helmet>
        <title>Sistema de Gestão de Zeladoria | Subprefeitura Pinheiros</title>
      </Helmet>
      
      <h1 className="text-2xl font-bold mb-6">Sistema de Gestão de Zeladoria</h1>
      <SGZContent />
    </div>
  );
};

export default RankingSubs;
