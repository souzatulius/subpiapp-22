
import React from 'react';
import { ClipboardEdit, Building2, BarChart3, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  type: 'demandas' | 'acoes' | 'relatorios';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ type }) => {
  let icon, title, description, items;

  switch (type) {
    case 'demandas':
      icon = <ClipboardEdit className="h-8 w-8 text-white" />;
      title = 'Demandas da Comunicação';
      description = 'Responda solicitações da imprensa e aprove a nota oficial.';
      items = [
        'Cadastro de demandas',
        'Respostas técnicas',
        'Elaboração de notas oficiais'
      ];
      break;
    case 'acoes':
      icon = <Building2 className="h-8 w-8 text-white" />;
      title = 'Ações em Andamento';
      description = 'Cadastre e acompanhamento de projetos e obras realizadas pela Subprefeitura.';
      items = [
        'Registro de atividades',
        'Acompanhamento de obras',
        'Controle de investimentos'
      ];
      break;
    case 'relatorios':
      icon = <BarChart3 className="h-8 w-8 text-white" />;
      title = 'Relatórios Analíticos';
      description = 'Visualização de dados e gráficos para avaliações.';
      items = [
        'Gráficos interativos',
        'Filtros personalizados',
        'Exportação para PDF'
      ];
      break;
    default:
      icon = <ClipboardEdit className="h-8 w-8 text-white" />;
      title = 'Recursos';
      description = 'Recursos disponíveis no sistema.';
      items = [
        'Item 1',
        'Item 2',
        'Item 3'
      ];
  }

  // Get card color based on type
  const getCardColor = () => {
    switch (type) {
      case 'demandas': return 'from-[#003570] to-[#0052ab]';
      case 'acoes': return 'from-[#f57c35] to-[#f79a63]';
      case 'relatorios': return 'from-[#1a5336] to-[#2a7d50]';
      default: return 'from-[#003570] to-[#0052ab]';
    }
  };

  return (
    <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
      <div className={`bg-gradient-to-br ${getCardColor()} p-5 text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-xs text-white/80">{description}</p>
          </div>
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
            {icon}
          </div>
        </div>
      </div>
      <CardContent className="bg-white p-4">
        <ul className="space-y-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              <Circle className="h-2 w-2 text-[#f57c35] mr-2 mt-1.5 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
