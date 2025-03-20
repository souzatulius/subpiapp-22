
import { Demand, PerguntaResposta } from '../types';

export const formatarPerguntasRespostas = (
  demanda: Demand
): PerguntaResposta[] => {
  if (!demanda.perguntas) return [];
  
  const perguntasRespostas: PerguntaResposta[] = [];
  
  for (const [pergunta, resposta] of Object.entries(demanda.perguntas)) {
    perguntasRespostas.push({
      pergunta,
      resposta
    });
  }
  
  return perguntasRespostas;
};
