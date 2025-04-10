
import React from 'react';
import { Database } from 'lucide-react';
import WelcomeCard from '@/components/shared/WelcomeCard';
import DashboardMigrationHelper from '@/components/dashboard/DashboardMigrationHelper';

const DashboardsMigration: React.FC = () => {
  return (
    <div className="space-y-6">
      <WelcomeCard
        title="Migração de Dashboards"
        description="Migre as configurações dos dashboards para o novo formato"
        icon={<Database className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-violet-600 to-indigo-700"
      />
      
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-500 mb-6">
            O sistema foi atualizado para permitir que você tenha configurações separadas 
            para o dashboard principal e para o dashboard de comunicação. Use a ferramenta 
            abaixo para migrar as configurações existentes para o novo formato.
          </p>
          
          <DashboardMigrationHelper />
          
          <div className="mt-8 bg-orange-50 p-4 rounded-md border border-orange-200">
            <h3 className="font-bold text-orange-800 mb-2">Importante</h3>
            <p className="text-orange-700">
              Esta migração é necessária apenas uma vez. Após a migração, você poderá 
              personalizar os dashboards principal e de comunicação independentemente, 
              sem que as alterações em um afetem o outro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardsMigration;
