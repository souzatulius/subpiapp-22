
import React from 'react';
import { useDemandaDetalhes } from './hooks/useDemandaDetalhes';
import { useNotaCriacao } from './hooks/useNotaCriacao';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import DemandaInfoCard from './components/DemandaInfoCard';
import CriarNotaForm from './components/CriarNotaForm';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import DemandaHeader from './components/DemandaHeader';
import { formatarPerguntasRespostas } from './utils/formatarPerguntasRespostas';
import { DetalhesDemandaProps } from './types';

const DetalhesDemanda: React.FC<DetalhesDemandaProps> = ({ demandaId, onClose }) => {
  const { demanda, loading, error, notaExistente, isCheckingNota } = useDemandaDetalhes(demandaId);
  const { user } = useAuth();
  const { 
    titulo, 
    setTitulo, 
    texto, 
    setTexto, 
    handleSubmit, 
    isPending,
    gerarSugestao,
    isGerandoSugestao
  } = useNotaCriacao(demandaId, demanda, onClose);
  
  if (loading) {
    return <LoadingState message="Carregando detalhes da demanda..." />;
  }
  
  if (error || !demanda) {
    return (
      <EmptyState 
        title="Erro ao carregar demanda" 
        description={error || "Não foi possível encontrar esta demanda."} 
        action={
          <Button onClick={onClose} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        }
      />
    );
  }
  
  const perguntasRespostas = formatarPerguntasRespostas(demanda, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClose}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <DemandaHeader 
          titulo={demanda.titulo} 
          status={demanda.status}
          protocolo={demanda.protocolo}
          prioridade={demanda.prioridade}
          horario_publicacao={demanda.horario_publicacao}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DemandaInfoCard 
            demanda={demanda} 
            perguntasRespostas={perguntasRespostas}
          />
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6">
            <CriarNotaForm 
              titulo={titulo}
              setTitulo={setTitulo}
              texto={texto}
              setTexto={setTexto}
              onSubmit={() => user?.id && handleSubmit(user.id)}
              isPending={isPending}
              notaExistente={notaExistente as any}
              isCheckingNota={isCheckingNota}
              demanda={demanda}
              gerarSugestao={gerarSugestao}
              isGerandoSugestao={isGerandoSugestao}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetalhesDemanda;
