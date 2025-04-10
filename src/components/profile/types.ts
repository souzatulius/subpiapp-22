
export interface ProfileData {
  nome_completo: string;
  whatsapp?: string;
  aniversario?: string | Date | null;
  email?: string;
  foto_perfil_url?: string;
  cargo?: string | { descricao: string };
  coordenacao?: string | { descricao: string };
  supervisao_tecnica?: string;
}
