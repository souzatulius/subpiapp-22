
export interface SGZData {
  id: string;
  subprefeitura: string;
  posicao: number;
  total_ordens: number;
  eficiencia: number;
  atrasados: number;
  pendentes: number;
  tempo_medio: number;
  periodo: string;
}

export interface PainelData {
  id: string;
  subprefeitura: string;
  total_ordens: number;
  tempo_medio: number;
  atrasados: number;
  pendentes: number;
  em_prazo: number;
  tempo_dias: number;
  periodo: string;
}
