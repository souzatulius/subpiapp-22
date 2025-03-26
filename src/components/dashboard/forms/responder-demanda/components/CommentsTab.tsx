
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
  return (
    <TabsContent value="comments" className="pt-2 m-0 animate-fade-in">
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CommentsSection 
          comentarios={comentarios}
          onChange={onChange}
        />
      </Card>
    </TabsContent>
  );
};

export default CommentsTab;
