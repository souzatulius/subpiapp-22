import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useComunicacaoStats } from '@/hooks/comunicacao/useComunicacaoStats';

const ComunicacaoDashboard = () => {
  const { stats, isLoading } = useComunicacaoStats();
  
  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeCard
        title="Central de Comunicação"
        description="Gerencie demandas e solicitações de comunicação"
        icon={<MessageSquare className="h-6 w-6 mr-2" />}
        statTitle="Demandas"
        statValue={isLoading ? 0 : stats.totalDemandas}
        statDescription="Ver todas demandas"
        statSection="demandas"
        color="bg-gradient-to-r from-green-600 to-green-800"
      />
      
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Dashboard de Comunicação</h1>
        <p className="text-gray-600 mb-4">
          Acompanhe as principais métricas e atividades da área de comunicação.
        </p>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-sm font-medium">Demandas Abertas</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm font-medium">Notas Publicadas</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              <span className="text-sm font-medium">Aprovações Pendentes</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Atualizado em: <span className="font-bold text-gray-600">15/07/2024</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComunicacaoDashboard;
