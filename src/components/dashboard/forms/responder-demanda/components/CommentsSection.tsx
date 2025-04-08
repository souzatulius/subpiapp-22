
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CommentsSectionProps {
  comentarios: string;
  onChange: (value: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comentarios,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Adicione comentários internos que serão visíveis apenas para a equipe (opcional)"
        value={comentarios}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] resize-y rounded-xl"
      />
      <p className="text-xs text-gray-500 italic">
        Esses comentários são apenas para uso interno e não serão enviados ao solicitante.
      </p>
    </div>
  );
};

export default CommentsSection;
