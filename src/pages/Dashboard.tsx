import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { ClipboardList, CheckSquare, FileText, ClipboardCheck } from 'lucide-react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ActionCard from '@/components/dashboard/ActionCard';
import CadastrarDemandaForm from '@/components/dashboard/forms/CadastrarDemandaForm';
import ResponderDemandaForm from '@/components/dashboard/forms/ResponderDemandaForm';
import CriarNotaForm from '@/components/dashboard/forms/CriarNotaForm';
import AprovarNotaForm from '@/components/dashboard/forms/AprovarNotaForm';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const userFirstName = user?.user_metadata?.name 
    ? user.user_metadata.name.split(' ')[0] 
    : 'Usuário';

  const handleActionClick = (action: string) => {
    setActiveForm(action);
  };

  const handleCloseForm = () => {
    setActiveForm(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderActiveForm = () => {
    switch(activeForm) {
      case 'cadastrar':
        return <CadastrarDemandaForm onClose={handleCloseForm} />;
      case 'responder':
        return <ResponderDemandaForm onClose={handleCloseForm} />;
      case 'criar-nota':
        return <CriarNotaForm onClose={handleCloseForm} />;
      case 'aprovar-nota':
        return <AprovarNotaForm onClose={handleCloseForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <Header showControls={true} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {activeForm ? (
            renderActiveForm()
          ) : (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#003570]">
                  Olá, {userFirstName}!
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  O que você precisa neste momento?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ActionCard 
                  title="Cadastrar nova solicitação"
                  icon={<ClipboardList className="h-16 w-16 text-white" />}
                  onClick={() => handleActionClick('cadastrar')}
                  color="dark-blue"
                  iconSize="giant"
                />
                
                <ActionCard 
                  title="Responder demandas"
                  icon={<CheckSquare className="h-16 w-16 text-white" />}
                  onClick={() => handleActionClick('responder')}
                  color="dark-blue"
                  iconSize="giant"
                />
                
                <ActionCard 
                  title="Criar nota oficial"
                  icon={<FileText className="h-16 w-16 text-white" />}
                  onClick={() => handleActionClick('criar-nota')}
                  color="dark-blue"
                  iconSize="giant"
                />
                
                <ActionCard 
                  title="Aprovar notas"
                  icon={<ClipboardCheck className="h-16 w-16 text-white" />}
                  onClick={() => handleActionClick('aprovar-nota')}
                  color="dark-blue"
                  iconSize="giant"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
