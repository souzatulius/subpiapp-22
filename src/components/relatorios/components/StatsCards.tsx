
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, FileTextIcon, ClockIcon, BarChartIcon, PercentIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  isLoading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend = 0,
  isLoading = false
}) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-700">
          {isLoading ? 
            <div className="h-8 w-24 bg-orange-50 animate-pulse rounded"></div>
            : value
          }
        </div>
        <div className="flex items-center text-xs">
          {trend !== 0 && (
            <span className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? 
                <ArrowUpIcon className="h-3 w-3 mr-1" /> : 
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              }
              {Math.abs(trend)}%
            </span>
          )}
          {description && (
            <CardDescription className="text-xs text-gray-500 ml-1">
              {description}
            </CardDescription>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsCards: React.FC<{
  cardStats: {
    totalDemandas: number;
    demandasVariacao: number;
    totalNotas: number;
    notasVariacao: number;
    tempoMedioResposta: number;
    tempoRespostaVariacao: number;
    taxaAprovacao: number;
    aprovacaoVariacao: number;
  };
  isLoading: boolean;
}> = ({ cardStats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Total de Demandas"
        value={cardStats.totalDemandas}
        trend={cardStats.demandasVariacao}
        description="vs. mês anterior"
        icon={<BarChartIcon className="h-4 w-4 text-orange-600" />}
        isLoading={isLoading}
      />
      <StatsCard
        title="Notas Oficiais"
        value={cardStats.totalNotas}
        trend={cardStats.notasVariacao}
        description="vs. mês anterior"
        icon={<FileTextIcon className="h-4 w-4 text-orange-600" />}
        isLoading={isLoading}
      />
      <StatsCard
        title="Tempo Médio Resposta"
        value={`${cardStats.tempoMedioResposta.toFixed(1)} dias`}
        trend={cardStats.tempoRespostaVariacao}
        description="vs. mês anterior"
        icon={<ClockIcon className="h-4 w-4 text-orange-600" />}
        isLoading={isLoading}
      />
      <StatsCard
        title="Taxa de Aprovação"
        value={`${cardStats.taxaAprovacao}%`}
        trend={cardStats.aprovacaoVariacao}
        description="vs. mês anterior"
        icon={<PercentIcon className="h-4 w-4 text-orange-600" />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StatsCards;
