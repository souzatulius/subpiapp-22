
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CommentsSectionProps {
  comentarios: string;
  onChange: (value: string) => void;
  simplifiedText?: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ 
  comentarios, 
  onChange,
  simplifiedText = false
}) => {
  return (
    <div className="space-y-2">
      {!simplifiedText && (
        <p className="text-sm text-gray-500">
          Estes comentários são apenas para uso interno e não serão enviados ao solicitante. 
          Utilize este espaço para registrar observações, esclarecimentos ou contexto adicional sobre esta demanda.
        </p>
      )}
      <Textarea
        value={comentarios}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Insira seus comentários internos aqui..."
        className="min-h-[120px] border-gray-300"
      />
    </div>
  );
};

export default CommentsSection;
