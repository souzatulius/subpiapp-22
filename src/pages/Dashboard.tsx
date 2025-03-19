
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { Bell, Settings, Menu, User } from 'lucide-react';
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
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-4"
          >
            <Menu className="h-5 w-5 text-[#003570]" />
          </Button>
          <img 
            src="/lovable-uploads/292774a8-b25d-4dc6-9555-f54295b8bd9f.png" 
            alt="Logo SUB PI" 
            className="h-8" 
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-[#003570]" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-[#f57c35] rounded-full"></span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5 text-[#003570]" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-gray-100 rounded-full"
          >
            <User className="h-5 w-5 text-[#003570]" />
          </Button>
        </div>
      </header>

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
                  icon="📄"
                  onClick={() => handleActionClick('cadastrar')}
                  color="blue"
                />
                
                <ActionCard 
                  title="Responder demandas"
                  icon="✅"
                  onClick={() => handleActionClick('responder')}
                  color="green"
                />
                
                <ActionCard 
                  title="Criar nota oficial"
                  icon="✏️"
                  onClick={() => handleActionClick('criar-nota')}
                  color="orange"
                />
                
                <ActionCard 
                  title="Aprovar notas"
                  icon="📝"
                  onClick={() => handleActionClick('aprovar-nota')}
                  color="purple"
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
