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
      icon = <ClipboardEdit className="h-6 w-6 text-[#003570]" />;
      title = 'Demandas da Comunicação';
      description = 'Responda solicitações da imprensa e aprove a nota oficial.';
      items = ['Cadastro de demandas', 'Respostas técnicas', 'Elaboração de notas oficiais'];
      break;
    case 'acoes':
      icon = <Building2 className="h-6 w-6 text-[#f57c35]" />;
      title = 'Ações em Andamento';
      description = 'Cadastre e acompanhe projetos de zeladoria e obras.';
      items = ['Registro de atividades', 'Acompanhamento de obras', 'Controle de investimentos'];
      break;
    case 'relatorios':
      icon = <BarChart3 className="h-6 w-6 text-[#003570]" />;
      title = 'Relatórios Analíticos';
      description = 'Visualização de dados e gráficos para avaliações.';
      items = ['Gráficos interativos', 'Filtros personalizados', 'Exportação para PDF'];
      break;
    default:
      icon = <ClipboardEdit className="h-6 w-6 text-[#003570]" />;
      title = 'Recursos';
      description = 'Recursos disponíveis no sistema.';
      items = ['Item 1', 'Item 2', 'Item 3'];
  }
  return <Card className="border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group h-full overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="font-semibold text-lg mb-2 text-gray-800 text-left">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 text-left">{description}</p>
        
        <div className="space-y-2">
          {items.map((item, index) => <div key={index} className="flex items-start">
              <Check className="h-4 w-4 mr-2 flex-shrink-0 text-[#f57c35] mt-1" />
              <span className="text-gray-700 text-left text-xs font-medium">{item}</span>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
export default FeatureCard;