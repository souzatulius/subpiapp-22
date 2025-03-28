
import React from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useNotasStats } from '@/hooks/comunicacao/useNotasStats';

const NotasDashboard = () => {
  const statsData = useNotasStats();
  const totalNotas = statsData?.totalNotas || 0;
  
  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeCard
        title="Notas Oficiais"
        description="Gerencie e acompanhe notas oficiais da comunicação"
        icon={<FileText className="h-6 w-6 mr-2" />}
        statTitle="Notas"
        statValue={totalNotas}
        statDescription="Ver todas notas"
        statSection="notas"
        color="bg-gradient-to-r from-amber-500 to-amber-700"
      />
      
      <div className="mb-6 bg-white rounded-lg border border-orange-200 p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-orange-700 mb-3">Dashboard de Notas Oficiais</h1>
        <p className="text-gray-600 mb-4">
          Acompanhamento das notas oficiais da Subprefeitura de Pinheiros.
        </p>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
              <span className="text-sm font-medium">Em Elaboração</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-400 mr-2"></span>
              <span className="text-sm font-medium">Em Aprovação</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-300 mr-2"></span>
              <span className="text-sm font-medium">Publicadas</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Coordenação de Comunicação - <span className="font-bold text-orange-600">COM</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotasDashboard;
