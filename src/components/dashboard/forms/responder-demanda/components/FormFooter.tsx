
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface FormFooterProps {
  isLoading: boolean;
  allQuestionsAnswered: boolean;
  onSubmit: () => Promise<void>;
}

const FormFooter: React.FC<FormFooterProps> = ({ 
  isLoading, 
  allQuestionsAnswered, 
  onSubmit 
}) => {
  return (
    <div className="border-t p-4 sticky bottom-0 bg-white shadow-md z-10 flex justify-between">
      <div className="text-sm text-gray-500">
        {!allQuestionsAnswered && (
          <div className="text-orange-500 animate-pulse">
            Responda todas as perguntas antes de enviar
          </div>
        )}
      </div>
      
      <Button 
        onClick={onSubmit}
        disabled={isLoading || !allQuestionsAnswered}
        className="space-x-2 bg-subpi-orange hover:bg-subpi-orange-dark transition-all duration-300 hover:shadow-lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Enviar Resposta</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default FormFooter;
