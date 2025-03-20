
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, LineChart, Clock, CheckCircle2 } from 'lucide-react';
import { useReportsData } from './hooks/useReportsData';

const RelatoriosContent = () => {
  const { 
    reportsData, 
    isLoading, 
    cardStats 
  } = useReportsData({});

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Demandas
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : cardStats.totalDemandas}</div>
            <p className="text-xs text-muted-foreground">
              {cardStats.demandasVariacao > 0 ? '+' : ''}{cardStats.demandasVariacao}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notas Publicadas
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : cardStats.totalNotas}</div>
            <p className="text-xs text-muted-foreground">
              {cardStats.notasVariacao > 0 ? '+' : ''}{cardStats.notasVariacao}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo Médio de Resposta
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : cardStats.tempoMedioResposta} dias</div>
            <p className="text-xs text-muted-foreground">
              {cardStats.tempoRespostaVariacao > 0 ? '+' : ''}{cardStats.tempoRespostaVariacao}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Aprovação
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : cardStats.taxaAprovacao}%</div>
            <p className="text-xs text-muted-foreground">
              {cardStats.aprovacaoVariacao > 0 ? '+' : ''}{cardStats.aprovacaoVariacao}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Selecione os filtros acima para visualizar relatórios detalhados sobre as demandas e notas oficiais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosContent;
