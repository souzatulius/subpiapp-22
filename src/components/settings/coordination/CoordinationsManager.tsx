
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoordinationArea from './CoordinationArea';
import SupervisionsArea from './SupervisionsArea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CoordinationsManager = () => {
  const [activeTab, setActiveTab] = useState('coordinations');
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-[#003570] font-bold">
          Gestão de Coordenações e Supervisões Técnicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="coordinations" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="coordinations" className="flex-1">Coordenações</TabsTrigger>
            <TabsTrigger value="supervisions" className="flex-1">Supervisões Técnicas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coordinations" className="mt-4">
            <CoordinationArea />
          </TabsContent>
          
          <TabsContent value="supervisions" className="mt-4">
            <SupervisionsArea />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CoordinationsManager;
