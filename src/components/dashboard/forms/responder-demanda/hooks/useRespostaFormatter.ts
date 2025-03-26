
import { Demanda } from '../types';

export const useRespostaFormatter = () => {
  /**
   * Formats response data to generate a text summary
   */
  const formatRespostaText = (selectedDemanda: Demanda, resposta: Record<string, string>) => {
    return Object.entries(resposta)
      .map(([key, value]) => {
        const perguntaText = Array.isArray(selectedDemanda.perguntas) 
          ? selectedDemanda.perguntas[parseInt(key)]
          : selectedDemanda.perguntas?.[key] || '';
        return `Pergunta: ${perguntaText}\nResposta: ${value}`;
      })
      .join('\n\n');
  };

  return { formatRespostaText };
};
