
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CommentsSectionProps {
  comentarios: string;
  onChange: (value: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comentarios, onChange }) => {
  return (
    <div>
      <Textarea
        value={comentarios}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[150px] resize-y"
      />
    </div>
  );
};

export default CommentsSection;
