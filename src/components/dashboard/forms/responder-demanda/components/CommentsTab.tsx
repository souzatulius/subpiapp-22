
import React from 'react';
import CommentsSection from './CommentsSection';
import { Card } from '@/components/ui/card';

interface CommentsTabProps {
  comentarios: string;
  onChange: (value: string) => void;
}

const CommentsTab: React.FC<CommentsTabProps> = ({
  comentarios,
  onChange
}) => {
  // This component is now just a wrapper for CommentsSection
  // and is kept for backward compatibility
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <CommentsSection 
        comentarios={comentarios}
        onChange={onChange}
      />
    </Card>
  );
};

export default CommentsTab;
