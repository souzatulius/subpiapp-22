
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
      icon = <ClipboardEdit className="h-6 w-6" />;
      title = 'Demandas da Comunicação';
      description = 'Responda solicitações da imprensa e aprove a nota oficial.';
      items = [
        'Cadastro de demandas',
        'Respostas técnicas',
        'Elaboração de notas oficiais'
      ];
      break;
    case 'acoes':
      icon = <Building2 className="h-6 w-6" />;
      title = 'Ações em Andamento';
      description = 'Cadastre e acompanhamento de projetos e obras realizadas pela Subprefeitura.';
      items = [
        'Registro de atividades',
        'Acompanhamento de obras',
        'Controle de investimentos'
      ];
      break;
    case 'relatorios':
      icon = <BarChart3 className="h-6 w-6" />;
      title = 'Relatórios Analíticos';
      description = 'Visualização de dados e gráficos para avaliações.';
      items = [
        'Gráficos interativos',
        'Filtros personalizados',
        'Exportação para PDF'
      ];
      break;
    default:
      icon = <ClipboardEdit className="h-6 w-6" />;
      title = 'Recursos';
      description = 'Recursos disponíveis no sistema.';
      items = [
        'Item 1',
        'Item 2',
        'Item 3'
      ];
  }

  const getCardColor = () => {
    switch (type) {
      case 'demandas': return 'bg-[#003570]';
      case 'acoes': return 'bg-[#f57c35]';
      case 'relatorios': return 'bg-[#1a5336]';
      default: return 'bg-[#003570]';
    }
  };

  return (
    <Card className="h-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`${getCardColor()} h-2`}></div>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`rounded-md p-2 ${getCardColor()} bg-opacity-10`}>
            {React.cloneElement(icon, { className: `${getCardColor()} text-opacity-100` })}
          </div>
          <h3 className="font-semibold text-lg text-gray-800 truncate">{title}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start">
              <Circle className="h-1.5 w-1.5 flex-shrink-0 mt-1.5 mr-2 text-gray-400" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
