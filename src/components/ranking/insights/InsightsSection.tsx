
import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertCircle, LineChart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsightsSectionProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  isSimulationActive: boolean;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ 
  sgzData, 
  painelData,
  isSimulationActive 
}) => {
  const hasData = Boolean(sgzData?.length || painelData?.length);

  // Generate insights based on available data
  const generateInsights = () => {
    if (!hasData) return [];
    
    const insights = [];
    
    // Calculate basic stats
    const totalSgz = sgzData?.length || 0;
    const pendingCount = sgzData?.filter(item => 
      (item.sgz_status || "").toLowerCase().includes("pend")
    ).length || 0;
    
    const resolvedCount = sgzData?.filter(item => 
      (item.sgz_status || "").toLowerCase().includes("conclu") || 
      (item.sgz_status || "").toLowerCase().includes("atendid")
    ).length || 0;
    
    const resolutionRate = totalSgz > 0 ? (resolvedCount / totalSgz * 100).toFixed(1) : "0";
    
    // Add efficiency insight
    insights.push({
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      title: "Taxa de Resolução",
      value: `${isSimulationActive ? (Number(resolutionRate) + 15).toFixed(1) : resolutionRate}%`,
      description: "das ordens de serviço foram concluídas",
      color: "blue"
    });
    
    // Add pending tasks insight
    insights.push({
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      title: "Ordens Pendentes",
      value: isSimulationActive ? Math.floor(pendingCount * 0.7) : pendingCount,
      description: "aguardando atendimento",
      color: "amber"
    });
    
    // Top service type insight
    const serviceTypes = sgzData?.reduce((acc: Record<string, number>, item) => {
      const service = item.sgz_tipo_servico || "Não informado";
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {});
    
    if (serviceTypes) {
      const topService = Object.entries(serviceTypes)
        .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
        .slice(0, 1)[0];
        
      if (topService) {
        insights.push({
          icon: <LineChart className="h-5 w-5 text-green-500" />,
          title: "Serviço Mais Demandado",
          value: topService[0],
          description: `${topService[1]} ordens registradas`,
          color: "green"
        });
      }
    }
    
    // Add performance insight
    insights.push({
      icon: <Zap className="h-5 w-5 text-purple-500" />,
      title: "Tempo Médio de Atendimento",
      value: isSimulationActive ? "12 dias" : "18 dias",
      description: "entre abertura e conclusão",
      color: "purple"
    });
    
    return insights;
  };
  
  const insights = generateInsights();
  
  return (
    <Card className="p-4 bg-white border-blue-200 shadow-sm overflow-hidden hover:shadow-md transition-all rounded-3xl mb-6">
      <div className="flex items-center mb-4">
        <Lightbulb className="h-6 w-6 mr-2 text-blue-500" />
        <h2 className="text-xl font-semibold text-blue-800">Insights</h2>
      </div>
      
      {!hasData ? (
        <div className="p-6 text-center text-gray-500">
          Carregue dados para visualizar insights automáticos
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 bg-${insight.color}-50 rounded-xl border border-${insight.color}-100`}
            >
              <div className="flex items-center mb-2">
                <div className={`p-2 rounded-full bg-${insight.color}-100 mr-3`}>
                  {insight.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{insight.title}</p>
                  <p className={`text-xl font-bold text-${insight.color}-700`}>
                    {insight.value}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      )}
      
      {isSimulationActive && (
        <div className="mt-4 p-2 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-600">
          <p className="flex items-center">
            <Lightbulb className="h-3 w-3 mr-1" />
            Insights são atualizados automaticamente com base nos dados e no modo de simulação ativo.
          </p>
        </div>
      )}
    </Card>
  );
};

export default InsightsSection;
