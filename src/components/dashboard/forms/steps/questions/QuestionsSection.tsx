import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface QuestionsSectionProps {
  perguntas: string[];
  onPerguntaChange: (index: number, value: string) => void;
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  perguntas,
  onPerguntaChange
}) => {
  const [showNextPergunta, setShowNextPergunta] = useState<{ [key: number]: boolean }>({});

  // Monitorar digitação nas perguntas para exibir a próxima
  useEffect(() => {
    const newShowNextPergunta = { ...showNextPergunta };
    
    perguntas.forEach((pergunta, index) => {
      if (pergunta.trim() !== '' && index < 4) { // Mostrar próxima pergunta se atual tiver conteúdo
        newShowNextPergunta[index + 1] = true;
      }
    });
    
    setShowNextPergunta(newShowNextPergunta);
  }, [perguntas]);

  const removePergunta = (index: number) => {
    const newPerguntas = [...perguntas];
    newPerguntas.splice(index, 1);
    // Update the entire perguntas array
    const updatedPerguntas = newPerguntas.filter(pergunta => pergunta !== '');
    for (let i = 0; i < 5; i++) {
      if (i < updatedPerguntas.length) {
        onPerguntaChange(i, updatedPerguntas[i]);
      } else {
        onPerguntaChange(i, '');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor="perguntas" className="block">
          Perguntas para a Área Técnica
        </Label>
      </div>
      
      <div className="space-y-2">
        {/* Sempre mostrar a primeira pergunta */}
        <div className="flex gap-2">
          <Input 
            value={perguntas[0] || ''} 
            onChange={(e) => onPerguntaChange(0, e.target.value)} 
            placeholder="Digite sua pergunta aqui"
            className="flex-1 rounded-xl"
          />
        </div>
        
        {/* Mostrar próximas perguntas de forma condicional */}
        {(perguntas[0]?.trim() || showNextPergunta[1]) && (
          <div className="flex gap-2 animate-fadeIn">
            <Input 
              value={perguntas[1] || ''} 
              onChange={(e) => onPerguntaChange(1, e.target.value)} 
              placeholder="Digite sua pergunta aqui"
              className="flex-1 rounded-xl"
            />
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              onClick={() => removePergunta(1)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        
        {(perguntas[1]?.trim() || showNextPergunta[2]) && (
          <div className="flex gap-2 animate-fadeIn">
            <Input 
              value={perguntas[2] || ''} 
              onChange={(e) => onPerguntaChange(2, e.target.value)} 
              placeholder="Digite sua pergunta aqui"
              className="flex-1 rounded-xl"
            />
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              onClick={() => removePergunta(2)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        
        {(perguntas[2]?.trim() || showNextPergunta[3]) && (
          <div className="flex gap-2 animate-fadeIn">
            <Input 
              value={perguntas[3] || ''} 
              onChange={(e) => onPerguntaChange(3, e.target.value)} 
              placeholder="Digite sua pergunta aqui"
              className="flex-1 rounded-xl"
            />
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              onClick={() => removePergunta(3)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        
        {(perguntas[3]?.trim() || showNextPergunta[4]) && (
          <div className="flex gap-2 animate-fadeIn">
            <Input 
              value={perguntas[4] || ''} 
              onChange={(e) => onPerguntaChange(4, e.target.value)} 
              placeholder="Digite sua pergunta aqui"
              className="flex-1 rounded-xl"
            />
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              onClick={() => removePergunta(4)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        
        {perguntas.filter(p => p !== '').length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Adicione perguntas específicas para a área técnica responder
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionsSection;
