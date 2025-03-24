import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OS156ChartsProps {
  data: any;
  isLoading: boolean;
}

const OS156Charts: React.FC<OS156ChartsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados dos gráficos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-10">
          <div className="text-center">
            <p className="text-muted-foreground">Nenhum dado disponível. Faça upload de uma planilha para visualizar os gráficos.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="distribuicao">
        <TabsList>
          <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
          <TabsTrigger value="tempos">Tempos</TabsTrigger>
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
          <TabsTrigger value="distritos">Distritos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="distribuicao" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {/* Chart component would go here */}
                <div className="h-full flex items-center justify-center bg-orange-50 rounded">
                  <p className="text-muted-foreground">Gráfico de Distribuição por Status</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Status Críticos</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {/* Chart component would go here */}
                <div className="h-full flex items-center justify-center bg-orange-50 rounded">
                  <p className="text-muted-foreground">Gráfico de Status Críticos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Other tab contents would follow the same pattern */}
      </Tabs>
    </div>
  );
};

export default OS156Charts;
