
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import CommentsSection from './CommentsSection';

interface CommentsTabProps {
  comentarios: string;
  onChange: (value: string) => void;
}

const CommentsTab: React.FC<CommentsTabProps> = ({
  comentarios,
  onChange
}) => {
  return (
    <TabsContent value="comments" className="pt-2 m-0 animate-fade-in">
      <CommentsSection 
        comentarios={comentarios}
        onChange={onChange}
      />
    </TabsContent>
  );
};

export default CommentsTab;
