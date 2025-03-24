
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Clock } from 'lucide-react';
import React from 'react';

export const formatPrioridade = (prioridade: string) => {
  switch (prioridade.toLowerCase()) {
    case 'alta':
      return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Alta</span>;
    case 'média':
      return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Média</span>;
    case 'baixa':
      return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Baixa</span>;
    default:
      return prioridade;
  }
};

export const calcularTempoRestante = (prazo: string) => {
  const prazoDate = new Date(prazo);
  const agora = new Date();
  const diffMs = prazoDate.getTime() - agora.getTime();
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHoras < 0) {
    return <span className="text-red-600 flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Atrasado</span>;
  } else if (diffHoras < 24) {
    return <span className="text-orange-600 flex items-center"><Clock className="h-3 w-3 mr-1" /> {diffHoras}h restantes</span>;
  } else {
    const diffDias = Math.floor(diffHoras / 24);
    return <span className="text-green-600 flex items-center"><Clock className="h-3 w-3 mr-1" /> {diffDias}d restantes</span>;
  }
};

export const formatarData = (dataString: string) => {
  return format(new Date(dataString), "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR
  });
};
