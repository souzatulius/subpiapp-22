
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, FileText } from 'lucide-react';
import ResponderDemandaForm from '@/components/dashboard/forms/ResponderDemandaForm';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useDemandasData } from '@/components/dashboard/forms/responder-demanda/hooks/useDemandasData';
import { ViewMode } from '@/components/dashboard/forms/responder-demanda/types';
import DemandasFilter from '@/components/dashboard/forms/responder-demanda/components/DemandasFilter';

const ResponderDemandas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const demandaId = query.get('id');
  const { firstName } = useDashboardState();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  const {
    areas,
    searchTerm,
    setSearchTerm,
    areaFilter,
    setAreaFilter,
    prioridadeFilter,
    setPrioridadeFilter,
  } = useDemandasData();
  
  const handleNavigateToConsultar = () => {
    navigate('/dashboard/comunicacao/consultar-demandas');
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Responder Demandas"
        description={`Olá ${firstName}, atenda às solicitações pendentes de comunicação`}
        icon={<MessageCircle className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-700 to-blue-800"
        showButton={true}
        buttonText="Consultar Outras Demandas"
        buttonIcon={<FileText className="h-4 w-4" />}
        buttonVariant="outline"
        onButtonClick={handleNavigateToConsultar}
      />
      
      {!demandaId && (
        <Card className="mt-6 mb-4 shadow-sm">
          <CardContent className="p-6">
            <DemandasFilter 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              areaFilter={areaFilter} 
              setAreaFilter={setAreaFilter} 
              prioridadeFilter={prioridadeFilter} 
              setPrioridadeFilter={setPrioridadeFilter} 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
              areas={areas} 
            />
          </CardContent>
        </Card>
      )}
      
      <div className="mt-6">
        <ResponderDemandaForm />
      </div>
    </div>
  );
};

export default ResponderDemandas;
