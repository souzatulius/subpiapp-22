
import React from 'react';
import { useDemandaDetalhes } from './hooks/useDemandaDetalhes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DemandaInfoCard from './components/DemandaInfoCard';
import CriarNotaForm from './components/CriarNotaForm';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import DemandaHeader from './components/DemandaHeader';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface DetalhesDemandaProps {
  demandaId: string;
}

const DetalhesDemanda: React.FC<DetalhesDemandaProps> = ({ demandaId }) => {
  const { demanda, loading, error, notaExistente, checkingNota } = useDemandaDetalhes(demandaId);
  const navigate = useNavigate();
  
  if (loading) {
    return <LoadingState message="Carregando detalhes da demanda..." />;
  }
  
  if (error || !demanda) {
    return (
      <EmptyState 
        title="Erro ao carregar demanda" 
        description={error || "Não foi possível encontrar esta demanda."} 
        action={
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        }
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <DemandaHeader 
          titulo={demanda.titulo} 
          protocolo={demanda.protocolo}
          prioridade={demanda.prioridade}
          status={demanda.status}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DemandaInfoCard demanda={demanda} />
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6">
            <CriarNotaForm 
              demanda={demanda} 
              notaExistente={notaExistente}
              isCheckingNota={checkingNota}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetalhesDemanda;
