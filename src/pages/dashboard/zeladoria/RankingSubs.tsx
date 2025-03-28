import React from 'react';
import { BarChart3 } from 'lucide-react';
import RankingContent from '@/components/ranking/RankingContent';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
const RankingSubs = () => {
  return <motion.div className="max-w-7xl mx-auto" initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }}>
      <WelcomeCard title="Ranking das Subs" description="Dashboard de análise das ordens de serviço do SGZ para acompanhamento dos distritos" icon={<BarChart3 className="h-6 w-6 mr-2" />} color="bg-gradient-to-r from-orange-500 to-orange-700" />

      
      <RankingContent />
    </motion.div>;
};
export default RankingSubs;