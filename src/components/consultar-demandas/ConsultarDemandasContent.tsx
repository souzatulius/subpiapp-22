
import React, { useState, useEffect } from 'react';
import ConsultarDemandasTable from '@/components/dashboard/ConsultarDemandasTable';
import DemandasFilter from './DemandasFilter';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDemandasData } from '@/hooks/consultar-demandas/useDemandasData';
import DemandDetail from '@/components/demandas/DemandDetail';
import DeleteDemandDialog from './DeleteDemandDialog';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ConsultarDemandasContent = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedDemand,
    setSelectedDemand,
    isDetailOpen,
    setIsDetailOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteLoading,
    filteredDemandas,
    isLoading,
    error,
    handleDeleteConfirm,
    applyFilters
  } = useDemandasData();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter state variables
  const [coordination, setCoordination] = useState<string>('todos');
  const [tema, setTema] = useState<string>('todos');
  const [status, setStatus] = useState<string>('todos');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  // Apply filters effect
  useEffect(() => {
    applyFilters({
      searchTerm,
      dateRange,
      coordenacao: coordination !== 'todos' ? coordination : undefined,
      tema: tema !== 'todos' ? tema : undefined,
      status: status !== 'todos' ? status : undefined
    });
  }, [searchTerm, dateRange, coordination, tema, status]);
  
  const handleNewDemandClick = () => {
    navigate('/dashboard/comunicacao/cadastrar');
  };
  
  if (error) {
    toast({
      title: "Erro ao carregar demandas",
      description: "Não foi possível carregar a lista de demandas.",
      variant: "destructive"
    });
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Consultar Demandas</h1>
        
        <Button
          onClick={handleNewDemandClick}
          className="bg-subpi-blue hover:bg-subpi-blue-dark"
        >
          <Plus className="h-4 w-4 mr-2" /> Nova Demanda
        </Button>
      </div>
      
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <DemandasFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            coordination={coordination}
            setCoordination={setCoordination}
            tema={tema}
            setTema={setTema}
            status={status}
            setStatus={setStatus}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </CardContent>
      </Card>
      
      <ConsultarDemandasTable />
      
      {/* Demand Details Modal */}
      <DemandDetail
        demand={selectedDemand}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteDemandDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ConsultarDemandasContent;
