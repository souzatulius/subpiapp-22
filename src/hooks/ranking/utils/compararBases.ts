
/**
 * Utility functions to compare SGZ and Painel da Zeladoria data
 */

export interface OSComparacao {
  sgzId: string;
  painelId?: string;
  status: {
    sgz: string;
    painel?: string;
  };
  divergente: boolean;
  motivo?: string;
}

export interface ResultadoComparacao {
  totalSGZ: number;
  totalPainel: number;
  divergencias: OSComparacao[];
  divergenciasStatus: OSComparacao[];
  ausentes: OSComparacao[];
}

/**
 * Compara dados do SGZ com dados do Painel da Zeladoria
 * @param dadosSGZ Array de dados do SGZ 
 * @param dadosPainel Array de dados do Painel da Zeladoria
 * @returns Resultado da comparação entre as bases
 */
export function compararBases(
  dadosSGZ: any[],
  dadosPainel: any[]
): ResultadoComparacao {
  const resultado: ResultadoComparacao = {
    totalSGZ: dadosSGZ.length || 0,
    totalPainel: dadosPainel.length || 0,
    divergencias: [],
    divergenciasStatus: [],
    ausentes: []
  };

  // Se não tiver dados, retornar resultado vazio
  if (!dadosSGZ?.length || !dadosPainel?.length) {
    return resultado;
  }

  // Mapeia os dados do Painel para fácil busca por número OS
  const painelMap = new Map();
  dadosPainel.forEach(item => {
    const id = item.numero_os || '';
    painelMap.set(id, item);
  });

  // Para cada OS no SGZ, verificar se existe no Painel e se há divergências
  dadosSGZ.forEach(sgzItem => {
    const sgzId = sgzItem.sgz_id || '';
    
    // Tenta encontrar a OS no Painel
    const painelItem = painelMap.get(sgzId);

    if (!painelItem) {
      // OS não encontrada no Painel
      resultado.ausentes.push({
        sgzId,
        status: {
          sgz: sgzItem.sgz_status || 'N/A'
        },
        divergente: true,
        motivo: 'OS ausente no Painel da Zeladoria'
      });
      resultado.divergencias.push({
        sgzId,
        status: {
          sgz: sgzItem.sgz_status || 'N/A'
        },
        divergente: true,
        motivo: 'OS ausente no Painel da Zeladoria'
      });
    } else {
      // Verificar divergência de status
      const sgzStatus = sgzItem.sgz_status?.toUpperCase() || '';
      const painelStatus = painelItem.status_atual?.toUpperCase() || '';
      
      if (sgzStatus !== painelStatus) {
        // Encontrou divergência de status
        const divergencia: OSComparacao = {
          sgzId,
          painelId: painelItem.numero_os,
          status: {
            sgz: sgzStatus,
            painel: painelStatus
          },
          divergente: true,
          motivo: `Status divergente: SGZ=${sgzStatus}, Painel=${painelStatus}`
        };
        
        resultado.divergenciasStatus.push(divergencia);
        resultado.divergencias.push(divergencia);
      }
    }
  });

  return resultado;
}
