
import React from 'react';
import { ClipboardEdit, Building2, BarChart3, Circle } from 'lucide-react';

interface FeatureCardProps {
  type: 'demandas' | 'acoes' | 'relatorios';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ type }) => {
  let icon, title, description, items;

  switch (type) {
    case 'demandas':
      icon = <ClipboardEdit className="h-8 w-8 text-[#003570]" />;
      title = 'Demandas da Comunicação';
      description = 'Responda solicitações da imprensa e aprove a nota oficial.';
      items = [
        'Cadastro de demandas',
        'Respostas técnicas',
        'Elaboração de notas oficiais'
      ];
      break;
    case 'acoes':
      icon = <Building2 className="h-8 w-8 text-[#003570]" />;
      title = 'Ações em Andamento';
      description = 'Cadastre e acompanhamento de projetos e obras realizadas pela Subprefeitura.';
      items = [
        'Registro de atividades',
        'Acompanhamento de obras',
        'Controle de investimentos'
      ];
      break;
    case 'relatorios':
      icon = <BarChart3 className="h-8 w-8 text-[#003570]" />;
      title = 'Relatórios Analíticos';
      description = 'Visualização de dados e gráficos para avaliações.';
      items = [
        'Gráficos interativos',
        'Filtros personalizados',
        'Exportação para PDF'
      ];
      break;
    default:
      icon = <ClipboardEdit className="h-8 w-8 text-[#003570]" />;
      title = 'Recursos';
      description = 'Recursos disponíveis no sistema.';
      items = [
        'Item 1',
        'Item 2',
        'Item 3'
      ];
  }

  return (
    <div className="feature-card">
      <div className="feature-card-icon">
        {icon}
      </div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
      <ul className="feature-card-list">
        {items.map((item, index) => (
          <li key={index} className="feature-card-list-item">
            <Circle className="h-3 w-3 feature-card-list-item-icon" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeatureCard;
