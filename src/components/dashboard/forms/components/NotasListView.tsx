
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotaOficial } from '@/types/nota';
import NotasList from './NotasList';

interface NotasListViewProps {
  notas: NotaOficial[];
  isLoading: boolean;
  onSelectNota: (nota: NotaOficial) => void;
  selectedNota: NotaOficial | null;
}

const NotasListView: React.FC<NotasListViewProps> = ({
  notas,
  isLoading,
  onSelectNota,
  selectedNota
}) => {
  return (
    <Card className="p-6">
      <Tabs defaultValue="pendentes">
        <TabsList className="mb-4">
          <TabsTrigger value="pendentes">Pendentes de Aprovação</TabsTrigger>
        </TabsList>
        <TabsContent value="pendentes">
          <NotasList 
            notas={notas || []}
            isLoading={isLoading}
            onSelectNota={onSelectNota}
            selectedNota={selectedNota}
            emptyMessage="Nenhuma nota pendente de aprovação no momento."
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default NotasListView;
