
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { CardStats } from '../hooks/reports/types';

interface StatsCardsProps {
  cardStats: CardStats;
  isLoading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ cardStats, isLoading }) => {
  const stats = [
    {
      title: "Total de demandas",
      value: cardStats.totalDemandas,
      change: cardStats.demandasVariacao,
      unit: "",
    },
    {
      title: "Notas emitidas",
      value: cardStats.totalNotas,
      change: cardStats.notasVariacao,
      unit: "",
    },
    {
      title: "Tempo médio de resposta",
      value: cardStats.tempoMedioResposta,
      change: cardStats.tempoRespostaVariacao,
      unit: " dias",
    },
    {
      title: "Taxa de aprovação",
      value: cardStats.taxaAprovacao,
      change: cardStats.aprovacaoVariacao,
      unit: "%",
    }
  ];

  const renderChangeIndicator = (change: number, isTimeResponse: boolean = false) => {
    // Para o tempo de resposta, negativo é bom (resposta mais rápida)
    const isPositive = isTimeResponse ? change < 0 : change > 0;
    const absoluteChange = Math.abs(change);
    
    // Se a variação for zero, não mostramos indicador
    if (change === 0) return null;
    
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? 
          <ArrowUpIcon className="h-4 w-4 mr-1" /> : 
          <ArrowDownIcon className="h-4 w-4 mr-1" />
        }
        <span className="text-xs font-medium">{absoluteChange}% {isPositive ? 'aumento' : 'redução'}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-orange-200 hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <div className="text-xs font-medium text-orange-800">
                {stat.title}
              </div>
              {isLoading ? (
                <div className="mt-2">
                  <Skeleton className="h-7 w-24 bg-orange-100" />
                  <Skeleton className="h-4 w-16 mt-1 bg-orange-50" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-orange-700">
                    {stat.value}{stat.unit}
                  </div>
                  {renderChangeIndicator(stat.change, index === 2)}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
