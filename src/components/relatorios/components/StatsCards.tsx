
import React from 'react';
import { Clock, FileText, MessageSquare, Percent } from "lucide-react";
import { CardStats } from '../hooks/reports/types';
import InsightCard from '../../ranking/insights/InsightCard';

interface StatsCardsProps {
  cardStats: CardStats;
  isLoading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ cardStats, isLoading }) => {
  // Format number with comma as decimal separator
  const formatNumber = (value: number | string): string => {
    if (typeof value === 'number') {
      return value.toString().replace('.', ',');
    }
    return value.toString().replace('.', ',');
  };

  const stats = [
    {
      title: "Demandas",
      value: formatNumber(cardStats.totalDemandas),
      icon: <MessageSquare className="h-4 w-4" />,
      description: `Hoje foram ${cardStats.totalDemandas} demandas. ${Math.abs(cardStats.demandasVariacao)}% ${cardStats.demandasVariacao >= 0 ? 'aumento' : 'redução'} comparado ao período anterior.`
    },
    {
      title: "Notas",
      value: formatNumber(cardStats.totalNotas),
      icon: <FileText className="h-4 w-4" />,
      description: `Para a imprensa. ${Math.abs(cardStats.notasVariacao)}% ${cardStats.notasVariacao >= 0 ? 'maior' : 'menor'} que março.`
    },
    {
      title: "Resposta",
      value: `${formatNumber(cardStats.tempoMedioResposta)} horas`,
      icon: <Clock className="h-4 w-4" />,
      description: `Média de tempo. ${Math.abs(cardStats.tempoRespostaVariacao)}% ${cardStats.tempoRespostaVariacao <= 0 ? 'mais rápido' : 'mais lento'}.`
    },
    {
      title: "Aprovação",
      value: `${formatNumber(cardStats.taxaAprovacao)}%`,
      icon: <Percent className="h-4 w-4" />,
      description: `${cardStats.notasAprovadas || 0} Notas aprovadas. Editadas: ${cardStats.notasEditadas || 0}%.`
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <InsightCard
          key={index}
          title={stat.title}
          value={stat.value}
          comment={stat.description}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default StatsCards;
