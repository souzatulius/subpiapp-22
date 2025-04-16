
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FormDescription } from '@/components/ui/form';

interface CommentsSectionProps {
  comentarios: string;
  onChange: (comentarios: string) => void;
  showHelpText?: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ 
  comentarios, 
  onChange,
  showHelpText = true
}) => {
  return (
    <div className="space-y-2">
      <Textarea 
        className="min-h-[120px] w-full rounded-xl"
        value={comentarios}
        onChange={(e) => onChange(e.target.value)}
      />
      
      {showHelpText && (
        <FormDescription className="text-xs text-gray-500">
          Estes comentários são apenas para uso interno e não serão visíveis ao solicitante.
        </FormDescription>
      )}
    </div>
  );
};

export default CommentsSection;
