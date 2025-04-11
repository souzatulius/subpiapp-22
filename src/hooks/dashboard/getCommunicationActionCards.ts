
import { v4 as uuidv4 } from 'uuid';
import { ActionCardItem } from '@/types/dashboard';

export const getCommunicationActionCards = (): ActionCardItem[] => {
  return [
    // First, add the press request card - properly configured to support drag and hide
    {
      id: 'press-request-card',
      title: "Nova Solicitação da Imprensa",
      subtitle: "Cadastre uma nova demanda de imprensa",
      iconId: "Newspaper",
      path: "/dashboard/comunicacao/cadastrar",
      color: "blue-light",
      width: "100",
      height: "2",
      type: "press_request_card",
      isCustom: false,
      displayMobile: true,
      mobileOrder: 1
    },
    // The rest of the cards
    {
      id: uuidv4(),
      title: "Demandas da Imprensa",
      iconId: "ClipboardList",
      path: "/dashboard/comunicacao/demandas",
      color: "bg-blue-500",
      width: "50",
      height: "1",
      isCustom: false,
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: uuidv4(),
      title: "Cadastrar Nova Nota",
      iconId: "FileCheck",
      path: "/dashboard/comunicacao/notas/criar",
      color: "bg-teal-500",
      width: "25",
      height: "1",
      isCustom: false,
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: uuidv4(),
      title: "Notas Publicadas",
      iconId: "FileCheck",
      path: "/dashboard/comunicacao/notas",
      color: "bg-green-500",
      width: "25",
      height: "1",
      isCustom: false,
      displayMobile: true,
      mobileOrder: 4
    },
    {
      id: 'origem-demandas-card',
      title: "Atividades em Andamento",
      subtitle: "Demandas da semana por área técnica",
      iconId: "BarChart2",
      path: "",
      color: "gray-light",
      width: "50",
      height: "2",
      type: "origin_demand_chart",
      isCustom: false,
      displayMobile: true,
      mobileOrder: 5
    },
    {
      id: 'acoes-pendentes-card',
      title: "Ações Pendentes",
      iconId: "Clock",
      path: "",
      color: "orange-light",
      width: "50",
      height: "1",
      isPendingTasks: true,
      type: "pending_tasks",
      isCustom: false,
      displayMobile: true,
      mobileOrder: 6
    },
    {
      id: uuidv4(),
      title: "Comunicados Oficiais",
      iconId: "Megaphone",
      path: "/dashboard/comunicados",
      color: "blue-vivid",
      width: "50",
      height: "1",
      type: "communications",
      isComunicados: true,
      isCustom: false,
      displayMobile: true,
      mobileOrder: 7
    }
  ];
};
