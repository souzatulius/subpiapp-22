
import React from 'react';
import { ESICJustificativaFormValues } from '@/types/esic';
import JustificativaForm from '@/components/esic/JustificativaForm';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

interface JustificativaCreateProps {
  processoTexto: string;
  onSubmit: (values: ESICJustificativaFormValues) => void;
  onGenerateAI: () => void;
  isLoading: boolean;
  isGenerating: boolean;
  onBack: () => void;
}

const JustificativaCreate: React.FC<JustificativaCreateProps> = ({
  processoTexto,
  onSubmit,
  onGenerateAI,
  isLoading,
  isGenerating,
  onBack
}) => {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="p-0">
        <FilePlus className="h-4 w-4 mr-2" />
        Voltar para Detalhes
      </Button>
      
      <JustificativaForm 
        onSubmit={onSubmit}
        onGenerateAI={onGenerateAI}
        isLoading={isLoading}
        isGenerating={isGenerating}
        processoTexto={processoTexto}
      />
    </div>
  );
};

export default JustificativaCreate;
