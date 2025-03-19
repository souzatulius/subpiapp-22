
import React from 'react';
import { FileCog, LineChart, Building } from 'lucide-react';

interface FeatureCardProps {
  type: 'demandas' | 'acoes' | 'relatorios';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ type }) => {
  const getCardContent = () => {
    switch (type) {
      case 'demandas':
        return {
          icon: <FileCog className="h-6 w-6 text-subpi-blue" />,
          title: 'Demandas da Comunicação',
          description: 'Responda solicitações da imprensa e aprove a nota oficial.',
          items: [
            'Cadastro de demandas',
            'Respostas técnicas',
            'Elaboração de notas oficiais'
          ]
        };
      case 'acoes':
        return {
          icon: <Building className="h-6 w-6 text-subpi-blue" />,
          title: 'Ações em Andamento',
          description: 'Cadastre e acompanhamento de projetos e obras realizadas pela Subprefeitura.',
          items: [
            'Registro de atividades',
            'Acompanhamento de obras',
            'Controle de investimentos'
          ]
        };
      case 'relatorios':
        return {
          icon: <LineChart className="h-6 w-6 text-subpi-blue" />,
          title: 'Relatórios Analíticos',
          description: 'Visualização de dados e gráficos para avaliações.',
          items: [
            'Gráficos interativos',
            'Filtros personalizados',
            'Exportação para PDF'
          ]
        };
      default:
        return {
          icon: <FileCog className="h-6 w-6 text-subpi-blue" />,
          title: 'Feature',
          description: 'Description',
          items: ['Item 1', 'Item 2', 'Item 3']
        };
    }
  };

  const content = getCardContent();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full animate-fade-in">
      <div className="mb-4">
        {content.icon}
      </div>
      <h3 className="text-lg font-semibold text-subpi-gray-text mb-2">{content.title}</h3>
      <p className="text-subpi-gray-secondary text-sm mb-4">{content.description}</p>
      <ul className="mt-auto">
        {content.items.map((item, index) => (
          <li key={index} className="flex items-start text-sm mb-2">
            <span className="text-subpi-orange mr-2">•</span>
            <span className="text-subpi-gray-secondary">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeatureCard;
