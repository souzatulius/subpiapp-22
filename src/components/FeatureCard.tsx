import React from 'react';
import { ClipboardEdit, Building2, BarChart3, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
interface FeatureCardProps {
  type: 'demandas' | 'acoes' | 'relatorios';
}
const FeatureCard: React.FC<FeatureCardProps> = ({
  type
}) => {
  let icon, title, description, items;
  switch (type) {
    case 'demandas':
      icon = <ClipboardEdit className="h-5 w-5 text-[#003570]" />;
      title = 'Demandas da Comunicação';
      description = 'Responda solicitações da imprensa e aprove a nota oficial.';
      items = ['Cadastro de demandas', 'Respostas técnicas', 'Elaboração de notas oficiais'];
      break;
    case 'acoes':
      icon = <Building2 className="h-5 w-5 text-[#f57c35]" />;
      title = 'Ações em Andamento';
      description = 'Cadastre e acompanhe projetos de zeladoria e obras.';
      items = ['Registro de atividades', 'Acompanhamento de obras', 'Controle de investimentos'];
      break;
    case 'relatorios':
      icon = <BarChart3 className="h-5 w-5 text-[#003570]" />;
      title = 'Relatórios Analíticos';
      description = 'Visualização de dados e gráficos para avaliações.';
      items = ['Gráficos interativos', 'Filtros personalizados', 'Exportação para PDF'];
      break;
    default:
      icon = <ClipboardEdit className="h-5 w-5 text-[#003570]" />;
      title = 'Recursos';
      description = 'Recursos disponíveis no sistema.';
      items = ['Item 1', 'Item 2', 'Item 3'];
  }
  const getIconColor = () => {
    switch (type) {
      case 'demandas':
        return 'text-[#003570]';
      case 'acoes':
        return 'text-[#f57c35]';
      case 'relatorios':
        return 'text-[#1a5336]';
      default:
        return 'text-[#003570]';
    }
  };
  const getDotColor = () => {
    switch (type) {
      case 'demandas':
        return 'text-[#003570]';
      case 'acoes':
        return 'text-[#f57c35]';
      case 'relatorios':
        return 'text-[#1a5336]';
      default:
        return 'text-[#003570]';
    }
  };
  return <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-0 mx-0 my-0 py-0 bg-neutral-50">
      <CardContent className="p-6 py-[10px] px-[10px] bg-neutral-50">
        <div className="mb-5">
          <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            {icon}
          </div>
          <h3 className="font-semibold text-lg mb-1 text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        
        <div className="space-y-2">
          {items.map((item, index) => <div key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 flex-shrink-0 text-[#f57c35] bg-transparent" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
export default FeatureCard;