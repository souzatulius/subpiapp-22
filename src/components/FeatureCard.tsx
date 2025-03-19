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

  const getAccentColor = () => {
    switch (type) {
      case 'demandas': return 'border-l-[#003570]';
      case 'acoes': return 'border-l-[#f57c35]';
      case 'relatorios': return 'border-l-[#1a5336]';
      default: return 'border-l-[#003570]';
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'demandas': return 'bg-[#003570]/10 text-[#003570]';
      case 'acoes': return 'bg-[#f57c35]/10 text-[#f57c35]';
      case 'relatorios': return 'bg-[#1a5336]/10 text-[#1a5336]';
      default: return 'bg-[#003570]/10 text-[#003570]';
    }
  };

  return (
    <Card className={`h-full border-l-4 ${getAccentColor()} shadow-sm hover:shadow-md transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <div className={`rounded-lg p-3 mr-4 ${getIconBgColor()}`}>
            {React.cloneElement(icon, { className: "h-6 w-6" })}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        
        <div className="ml-2 mt-6">
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index} className="flex items-start text-sm">
                <Circle className="h-1.5 w-1.5 text-gray-400 mr-3 mt-1.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
