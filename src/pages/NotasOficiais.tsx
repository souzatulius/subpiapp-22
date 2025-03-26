
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Layout } from '@/components/demandas';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import CadastrarDemandaForm from '@/components/dashboard/forms/CadastrarDemandaForm';
import ResponderDemandaForm from '@/components/dashboard/forms/ResponderDemandaForm';
import CriarNotaForm from '@/components/dashboard/forms/CriarNotaForm';
import AprovarNotaForm from '@/components/dashboard/forms/AprovarNotaForm';
import AdminProtectedRoute from '@/components/layouts/AdminProtectedRoute';

const NotasOficiais = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOpenForm = (formName: string) => {
    setActiveForm(formName);
  };

  const handleCloseForm = () => {
    setActiveForm(null);
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'cadastrar-demanda':
        return <CadastrarDemandaForm onClose={handleCloseForm} />;
      case 'responder-demanda':
        return <ResponderDemandaForm onClose={handleCloseForm} />;
      case 'criar-nota':
        return <CriarNotaForm onClose={handleCloseForm} />;
      case 'aprovar-nota':
        return <AprovarNotaForm onClose={handleCloseForm} />;
      default:
        return renderMainContent();
    }
  };

  const renderMainContent = () => {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Notas Oficiais</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gerencie demandas da imprensa, crie e aprove notas oficiais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-blue-50">
                  <PlusCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900">Cadastrar Demanda</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Registre novas demandas da imprensa no sistema
                  </p>
                  <Button 
                    onClick={() => handleOpenForm('cadastrar-demanda')}
                    variant="default"
                    className="mt-4"
                  >
                    Cadastrar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-green-50">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900">Responder Demanda</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Responda às demandas pendentes da imprensa
                  </p>
                  <Button 
                    onClick={() => handleOpenForm('responder-demanda')}
                    variant="default"
                    className="mt-4"
                  >
                    Responder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-orange-50">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900">Criar Nota Oficial</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Elabore notas oficiais baseadas em demandas recebidas
                  </p>
                  <Button 
                    onClick={() => handleOpenForm('criar-nota')}
                    variant="default"
                    className="mt-4"
                  >
                    Criar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-purple-50">
                  <CheckCircle className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900">Aprovar Notas</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Revise e aprove notas oficiais para publicação
                  </p>
                  <Button 
                    onClick={() => handleOpenForm('aprovar-nota')}
                    variant="default"
                    className="mt-4"
                  >
                    Aprovar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header showControls={true} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar isOpen={sidebarOpen} />
          
          <Layout>
            {renderForm()}
          </Layout>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default NotasOficiais;
