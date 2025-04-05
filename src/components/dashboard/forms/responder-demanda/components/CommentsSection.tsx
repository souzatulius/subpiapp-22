
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CommentsSectionProps {
  comentarios: string;
  onChange: (value: string) => void;
  placeholder?: string;
  simplifiedText?: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ 
  comentarios, 
  onChange,
  placeholder = "Insira seus comentários internos aqui...",
  simplifiedText = false
}) => {
  return (
    <div className="space-y-2">
      <Textarea
        value={comentarios}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] border-gray-300"
      />
    </div>
  );
};

export default CommentsSection;
