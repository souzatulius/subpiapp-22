
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
      <WelcomeCard 
        title="Ranking das Subs" 
        description="Dashboard de análise das ordens de serviço do SGZ para acompanhamento dos distritos" 
        icon={<BarChart3 className="h-6 w-6 mr-2" />} 
        color="bg-gradient-to-r from-orange-500 to-orange-700"
        showButton={true}
        buttonText="Filtros e Visualização"
        buttonIcon={<SlidersHorizontal className="h-4 w-4" />}
        buttonVariant="outline"
        onButtonClick={() => setFilterDialogOpen(true)}
      />
      
      <div className="mt-6">
        <RankingContent filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} />
      </div>
    </motion.div>
  );
};

export default RankingSubs;
