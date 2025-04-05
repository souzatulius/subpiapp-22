import { NotaOficial } from '@/types/nota';

// This function ensures that texto and conteudo are always both available
// It helps with components that might be using either property
export function ensureNotaCompat(nota: NotaOficial): NotaOficial {
  if (!nota) return nota;
  
  // If we have texto but not conteudo, use texto for conteudo
  if (nota.texto && !nota.conteudo) {
    return {
      ...nota,
      conteudo: nota.texto
    };
  }
  
  // If we have conteudo but not texto, use conteudo for texto
  if (nota.conteudo && !nota.texto) {
    return {
      ...nota,
      texto: nota.conteudo
    };
  }
  
  // If we have neither, initialize both as empty strings
  if (!nota.conteudo && !nota.texto) {
    return {
      ...nota,
      conteudo: '',
      texto: ''
    };
  }
  
  // Otherwise, return as is
  return nota;
}

// Use this in component props to make sure everything is compatible
export function prepareNotas(notas: NotaOficial[]): NotaOficial[] {
  return notas.map(ensureNotaCompat);
}
