
import React from 'react';
import RankingContent from '@/components/ranking/RankingContent';
import BackButton from '@/components/layouts/BackButton';

const RankingSubs = () => {
  return (
    <>
      <BackButton destination="/dashboard" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ranking das Subs</h1>
        <RankingContent />
      </div>
    </>
  );
};

export default RankingSubs;
