
import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { CardColor } from '@/types/dashboard';

// Define páginas para o Dropdown
export const dashboardPages = [
  { value: '/dashboard', label: 'Dashboard' },
  { value: '/demandas', label: 'Demandas' },
  { value: '/notas', label: 'Notas Oficiais' },
  { value: '/relatorios', label: 'Relatórios' },
  { value: '/ranking', label: 'Ranking' },
  { value: '/dashboard/comunicacao/cadastrar', label: 'Cadastrar Nova Demanda' },
  { value: '/dashboard/notas/criar', label: 'Criar Nota Oficial' },
];

// Mapeia tipos de cards para labels
export const cardTypes = [
  { value: 'standard', label: 'Card Padrão' },
  { value: 'data_dynamic', label: 'Card de Dados Dinâmicos' },
  { value: 'quickDemand', label: 'Demanda Rápida' },
  { value: 'search', label: 'Pesquisa' },
  { value: 'overdueDemands', label: 'Demandas Atrasadas' },
  { value: 'pendingActions', label: 'Ações Pendentes' },
  { value: 'welcome_card', label: 'Card de Boas-vindas' },
];

// Define fontes de dados para cards dinâmicos
export const dataSources = [
  { value: 'pendencias_por_coordenacao', label: 'Pendências da Coordenação' },
  { value: 'notas_aguardando_aprovacao', label: 'Notas aguardando aprovação' },
  { value: 'respostas_atrasadas', label: 'Respostas atrasadas' },
  { value: 'demandas_aguardando_nota', label: 'Demandas aguardando nota' },
  { value: 'ultimas_acoes_coordenacao', label: 'Últimas ações da coordenação' },
  { value: 'comunicados_por_cargo', label: 'Comunicados por cargo' },
];

// Opções de cores
export const colorOptions: { value: CardColor; label: string; class: string }[] = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { value: 'green', label: 'Verde', class: 'bg-green-500' },
  { value: 'orange', label: 'Laranja', class: 'bg-orange-500' },
  { value: 'gray-light', label: 'Cinza claro', class: 'bg-gray-200' },
  { value: 'gray-dark', label: 'Cinza escuro', class: 'bg-gray-700' },
  { value: 'blue-dark', label: 'Azul escuro', class: 'bg-blue-700' },
  { value: 'orange-light', label: 'Laranja claro', class: 'bg-orange-300' },
  { value: 'gray-ultra-light', label: 'Cinza ultra claro', class: 'bg-gray-100' },
  { value: 'lime', label: 'Verde lima', class: 'bg-lime-500' },
  { value: 'orange-600', label: 'Laranja Médio', class: 'bg-orange-600' },
];

// Opções de gradientes para WelcomeCard
export const gradientOptions = [
  { value: 'bg-gradient-to-r from-blue-600 to-blue-800', label: 'Azul' },
  { value: 'bg-gradient-to-r from-green-600 to-green-800', label: 'Verde' },
  { value: 'bg-gradient-to-r from-orange-500 to-red-600', label: 'Laranja' },
  { value: 'bg-gradient-to-r from-purple-600 to-indigo-800', label: 'Roxo' },
  { value: 'bg-gradient-to-r from-pink-500 to-purple-700', label: 'Rosa' },
  { value: 'bg-gradient-to-r from-yellow-500 to-orange-600', label: 'Amarelo' },
  { value: 'bg-gradient-to-r from-cyan-500 to-blue-600', label: 'Ciano' },
  { value: 'bg-gradient-to-r from-teal-500 to-green-600', label: 'Turquesa' },
];

// Função ajudante para obter a classe de cor
export function getColorClass(color: CardColor): string {
  const colorOption = colorOptions.find(option => option.value === color);
  return colorOption ? colorOption.class : 'bg-blue-500'; // Default fallback
}

// Função para obter o componente de ícone a partir do ID
export function getIconComponentById(iconId: string): React.ReactElement {
  try {
    const IconComponent = LucideIcons[iconId as keyof typeof LucideIcons];
    
    if (IconComponent) {
      return React.createElement(IconComponent, {
        className: "h-8 w-8 text-white",
        strokeWidth: 1.5
      });
    }
  } catch (error) {
    console.error(`Erro ao carregar ícone ${iconId}:`, error);
  }
  
  // Fallback para ícone padrão se não encontrar
  return React.createElement(LucideIcons.Layout, {
    className: "h-8 w-8 text-white",
    strokeWidth: 1.5
  });
}

// Lista de ícones para seleção
export const iconOptions = Object.keys(LucideIcons)
  .filter(key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function')
  .map(key => ({
    value: key,
    label: key.replace(/([A-Z])/g, ' $1').trim(),
    icon: React.createElement(LucideIcons[key as keyof typeof LucideIcons], {
      className: "h-4 w-4 mr-2",
      strokeWidth: 1.5
    })
  }));
