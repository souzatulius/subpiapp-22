
import React from 'react';
import { BarChart3, SlidersHorizontal } from 'lucide-react';
import RankingContent from '@/components/ranking/RankingContent';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
import StatCard from '@/components/settings/components/StatCard';

const RankingSubs = () => {
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  
  return (
    <motion.div 
      className="max-w-7xl mx-auto" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <WelcomeCard 
          title="Ranking das Subs" 
          description="Dashboard de análise das ordens de serviço do SGZ para acompanhamento dos distritos" 
          icon={<BarChart3 className="h-6 w-6 mr-2" />} 
          color="bg-gradient-to-r from-orange-500 to-orange-700" 
        />
        
        <div className="w-full md:w-auto">
          <StatCard 
            showButton={true}
            buttonText="Filtros e Configurações"
            buttonIcon={<SlidersHorizontal className="h-4 w-4" />}
            buttonVariant="outline"
            onButtonClick={() => setFilterDialogOpen(true)}
          />
        </div>
      </div>
      
      <RankingContent />
    </motion.div>
  );
};

export default RankingSubs;
