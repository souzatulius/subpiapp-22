
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
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
  // Instead of returning TabsContent directly, just return the content
  // The parent component (TabsNavigation) will handle the Tabs structure
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
