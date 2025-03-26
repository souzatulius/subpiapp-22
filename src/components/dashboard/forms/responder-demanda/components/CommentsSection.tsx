
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CommentsSectionProps {
  comentarios: string;
  onChange: (value: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comentarios, onChange }) => {
  return (
    <div>
      <Label htmlFor="comentarios" className="text-sm font-medium mb-2">Comentários (opcional)</Label>
      <Textarea 
        id="comentarios"
        placeholder="Adicione comentários internos sobre esta demanda"
        className="min-h-[100px]"
        value={comentarios}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CommentsSection;
