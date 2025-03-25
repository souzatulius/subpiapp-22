
export interface ArquivoAnexo {
  id: string;
  url: string;
  nome_original: string;
  tipo_arquivo: 'imagem' | 'pdf' | 'doc' | 'planilha' | 'outro';
  tamanho: number;
  usuario_id: string;
  timestamp_upload: string;
  relacionado_tipo: 'demanda' | 'resposta' | 'nota';
  relacionado_id: string;
}
