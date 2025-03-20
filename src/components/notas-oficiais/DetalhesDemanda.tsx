
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useDemandaDetalhes } from './hooks/useDemandaDetalhes';
import { useNotaCriacao } from './hooks/useNotaCriacao';
import { formatarPerguntasRespostas } from './utils/formatarPerguntasRespostas';
import { DetalhesDemandaProps } from './types';

// Components
import DemandaHeader from './components/DemandaHeader';
import DemandaInfoCard from './components/DemandaInfoCard';
import CriarNotaForm from './components/CriarNotaForm';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';

const DetalhesDemanda: React.FC<DetalhesDemandaProps> = ({ demandaId, onClose }) => {
  const { user } = useAuth();
  const { demanda, respostas, notaExistente, isLoading } = useDemandaDetalhes(demandaId);
  const { 
    titulo, 
    setTitulo, 
    texto, 
    setTexto, 
    handleSubmit, 
    isPending 
  } = useNotaCriacao(demandaId, demanda, onClose);
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!demanda) {
    return <EmptyState onClose={onClose} />;
  }
  
  const perguntasRespostas = formatarPerguntasRespostas(demanda, respostas);
  
  return (
    <div className="space-y-6">
      <DemandaHeader demanda={demanda} onClose={onClose} />
      
      <DemandaInfoCard 
        demanda={demanda} 
        perguntasRespostas={perguntasRespostas} 
        respostas={respostas} 
      />
      
      <CriarNotaForm
        titulo={titulo}
        setTitulo={setTitulo}
        texto={texto}
        setTexto={setTexto}
        onSubmit={() => user?.id && handleSubmit(user.id)}
        isPending={isPending}
        notaExistente={notaExistente}
      />
    </div>
  );
};

export default DetalhesDemanda;
