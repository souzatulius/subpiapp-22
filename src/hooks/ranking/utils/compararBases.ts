
import { supabase } from "@/integrations/supabase/client";

export interface OSComparacao {
  id_os: string;
  status_sgz?: string;
  status_painel?: string;
  encontradoPainel: boolean;
  motivo: string;
}

export interface ResultadoComparacao {
  totalSGZ: number;
  totalPainel: number;
  divergencias: OSComparacao[];
  ausentes: OSComparacao[];
  divergenciasStatus: OSComparacao[];
}

export function normalizarID(id: string | number): string {
  return String(id).trim().replace(/^0+/, '');
}

export function compararBases(sgz: any[], painel: any[]): ResultadoComparacao {
  const painelMap = new Map(
    painel.map((p) => [normalizarID(p.id_os), p])
  );

  const divergencias = sgz.map((os) => {
    const id = normalizarID(os.ordem_servico);
    const painelOS = painelMap.get(id);

    if (!painelOS) {
      return {
        id_os: id,
        status_sgz: os.sgz_status,
        encontradoPainel: false,
        motivo: 'Ausente no Painel da Zeladoria'
      };
    }

    const statusSGZ = os.sgz_status?.trim().toUpperCase();
    const statusPainel = painelOS.status?.trim().toUpperCase();

    if (statusSGZ !== statusPainel) {
      return {
        id_os: id,
        status_sgz: statusSGZ,
        status_painel: statusPainel,
        encontradoPainel: true,
        motivo: 'Status divergente'
      };
    }

    return null;
  }).filter(Boolean) as OSComparacao[];

  return {
    totalSGZ: sgz.length,
    totalPainel: painel.length,
    divergencias,
    ausentes: divergencias.filter((d) => !d.encontradoPainel),
    divergenciasStatus: divergencias.filter((d) => d.encontradoPainel),
  };
}

export async function salvarComparacaoNaBase(resultado: ResultadoComparacao, uploadId: string) {
  try {
    const batch: any[] = resultado.divergencias.map(div => ({
      id_os: div.id_os,
      status_sgz: div.status_sgz,
      status_painel: div.status_painel,
      motivo: div.motivo,
      upload_id: uploadId
    }));

    if (batch.length > 0) {
      const { error } = await supabase
        .from('painel_zeladoria_comparacoes')
        .insert(batch);

      if (error) {
        console.error('Erro ao salvar comparação:', error);
        throw error;
      }
    }

    return {
      totalDivergencias: resultado.divergencias.length,
      totalAusentes: resultado.ausentes.length,
      totalDivergenciasStatus: resultado.divergenciasStatus.length
    };
  } catch (error) {
    console.error('Erro ao salvar comparação:', error);
    throw error;
  }
}
