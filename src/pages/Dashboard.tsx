
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-subpi-gray-text">Painel Principal</h1>
          <div className="flex gap-2">
            <Link to="/settings">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Ajustes da Plataforma
              </Button>
            </Link>
            <Button variant="outline" onClick={signOut}>Sair</Button>
          </div>
        </div>
        
        <div className="bg-subpi-blue/10 p-4 rounded-lg mb-6">
          <p className="text-subpi-blue">
            Bem-vindo {user?.user_metadata?.name || user?.email}! 
            Este é o painel principal da Plataforma SUBPi.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-semibold text-subpi-gray-text mb-4">Demandas Recentes</h3>
            <p className="text-subpi-gray-secondary">Recurso em desenvolvimento...</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-semibold text-subpi-gray-text mb-4">Ações em Andamento</h3>
            <p className="text-subpi-gray-secondary">Recurso em desenvolvimento...</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-semibold text-subpi-gray-text mb-4">Comunicados</h3>
            <p className="text-subpi-gray-secondary">Recurso em desenvolvimento...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
