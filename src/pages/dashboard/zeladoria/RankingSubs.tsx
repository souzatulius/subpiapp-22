
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import SGZContent from '@/components/ranking/SGZContent';

const RankingSubs = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <SGZContent user={user} />
    </div>
  );
};

export default RankingSubs;
