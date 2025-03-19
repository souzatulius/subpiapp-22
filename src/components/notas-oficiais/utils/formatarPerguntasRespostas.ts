
import { Demanda, Resposta, PerguntaResposta } from '../types';

export function formatarPerguntasRespostas(demanda: Demanda | undefined, respostas: Resposta[] | undefined): PerguntaResposta[] {
  if (!demanda?.perguntas) return [];
  
  return Object.entries(demanda.perguntas as Record<string, string>).map(([_key, pergunta]) => {
    const respostaTexto = respostas && respostas.length > 0 ? respostas[0].texto : '';
    
    const perguntaIndex = respostaTexto.indexOf(`Pergunta: ${pergunta}`);
    let resposta = '';
    
    if (perguntaIndex >= 0) {
      const respostaIndex = respostaTexto.indexOf('Resposta:', perguntaIndex);
      if (respostaIndex >= 0) {
        const nextPerguntaIndex = respostaTexto.indexOf('Pergunta:', respostaIndex);
        resposta = respostaTexto.substring(
          respostaIndex + 'Resposta:'.length,
          nextPerguntaIndex > 0 ? nextPerguntaIndex : undefined
        ).trim();
      }
    }
    
    return {
      pergunta,
      resposta
    };
  });
}
