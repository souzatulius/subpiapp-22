
export interface OSComparacao {
  id_os: string;
  sgz_status?: string;
  painel_status?: string;
  divergente: boolean;
}

export interface ResultadoComparacao {
  totalSGZ: number;
  totalPainel: number;
  ausentes: string[];
  divergencias: OSComparacao[];
  divergenciasStatus: OSComparacao[];
}

/**
 * Compara os dados entre SGZ e Painel da Zeladoria para identificar divergências
 */
export const compararBases = (
  dadosSGZ: any[],
  dadosPainel: any[]
): ResultadoComparacao => {
  // Mapear OS do SGZ por número para acesso rápido
  const mapSGZ = new Map();
  dadosSGZ.forEach(os => {
    mapSGZ.set(os.ordem_servico, {
      id_os: os.ordem_servico,
      status: os.sgz_status
    });
  });

  // Mapear OS do Painel por número para acesso rápido
  const mapPainel = new Map();
  dadosPainel.forEach(os => {
    mapPainel.set(os.id_os, {
      id_os: os.id_os,
      status: os.status
    });
  });

  const divergencias: OSComparacao[] = [];
  const divergenciasStatus: OSComparacao[] = [];
  const ausentes: string[] = [];

  // Verificar OS que estão no SGZ mas não no Painel ou com status diferentes
  dadosSGZ.forEach(os => {
    const idOS = os.ordem_servico;
    const statusSGZ = os.sgz_status;
    
    // Se não existe no Painel
    if (!mapPainel.has(idOS)) {
      ausentes.push(idOS);
      
      divergencias.push({
        id_os: idOS,
        sgz_status: statusSGZ,
        divergente: true
      });
    } 
    // Se existe, verificar se o status é diferente
    else {
      const painelOS = mapPainel.get(idOS);
      if (statusSGZ !== painelOS.status) {
        divergenciasStatus.push({
          id_os: idOS,
          sgz_status: statusSGZ,
          painel_status: painelOS.status,
          divergente: true
        });
        
        divergencias.push({
          id_os: idOS,
          sgz_status: statusSGZ,
          painel_status: painelOS.status,
          divergente: true
        });
      }
    }
  });

  return {
    totalSGZ: dadosSGZ.length,
    totalPainel: dadosPainel.length,
    ausentes,
    divergencias,
    divergenciasStatus
  };
};
