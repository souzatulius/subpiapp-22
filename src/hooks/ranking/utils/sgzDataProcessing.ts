
import { SGZOrdemServico } from '@/components/ranking/types';

// Função para processar os dados e gerar as estruturas para os gráficos
export const processSGZData = (data: SGZOrdemServico[]) => {
  // 1. Distribuição por status
  const statusCounts = countByField(data, 'sgz_status');
  const statusDistributionData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Ordens de Serviço',
        data: Object.values(statusCounts),
        backgroundColor: generateColors(Object.keys(statusCounts).length, 'orange'),
        borderColor: 'rgba(200, 200, 200, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  // 2. Tempo médio entre criação e status atual
  const avgResolutionTime = calculateAverageResolutionTime(data);
  const resolutionTimeData = {
    labels: ['Tempo Médio', 'Meta'],
    datasets: [
      {
        label: 'Dias',
        data: [avgResolutionTime, 15], // Considerando 15 dias como meta
        backgroundColor: [
          avgResolutionTime > 15 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  // 3. Empresas com mais ordens Concluídas
  const completedByCompany = countByFieldWithFilter(
    data, 
    'sgz_fornecedor', 
    item => item.sgz_status === 'Concluído'
  );
  const companiesData = {
    labels: Object.keys(completedByCompany).slice(0, 10), // top 10
    datasets: [
      {
        label: 'Ordens Concluídas',
        data: Object.values(completedByCompany).slice(0, 10),
        backgroundColor: generateColors(10, 'orange'),
      },
    ],
  };

  // 4. Ordens por área da subprefeitura
  const areaCount = countByField(data, 'sgz_area_tecnica');
  const areaData = {
    labels: Object.keys(areaCount),
    datasets: [
      {
        label: 'Ordens de Serviço',
        data: Object.values(areaCount),
        backgroundColor: ['rgba(255, 159, 64, 0.5)', 'rgba(54, 162, 235, 0.5)'],
      },
    ],
  };

  // 5. Serviços mais realizados (STM/STLP)
  const stmServices = countByFieldWithFilter(
    data, 
    'sgz_tipo_servico', 
    item => item.sgz_area_tecnica === 'STM'
  );
  const stlpServices = countByFieldWithFilter(
    data, 
    'sgz_tipo_servico', 
    item => item.sgz_area_tecnica === 'STLP'
  );
  
  // Pegar os 10 serviços mais comuns para STM e STLP
  const topStmServices = getTopEntries(stmServices, 5);
  const topStlpServices = getTopEntries(stlpServices, 5);
  
  const servicesData = {
    labels: [...new Set([...topStmServices.map(e => e[0]), ...topStlpServices.map(e => e[0])])],
    datasets: [
      {
        label: 'STM',
        data: topStmServices.map(e => e[1]),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
      {
        label: 'STLP',
        data: topStlpServices.map(e => e[1]),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  // 6. Serviços por distrito
  const districtServices = {};
  data.forEach(item => {
    if (!districtServices[item.sgz_distrito]) {
      districtServices[item.sgz_distrito] = {};
    }
    
    if (!districtServices[item.sgz_distrito][item.sgz_tipo_servico]) {
      districtServices[item.sgz_distrito][item.sgz_tipo_servico] = 0;
    }
    
    districtServices[item.sgz_distrito][item.sgz_tipo_servico]++;
  });
  
  const districtData = {
    districts: Object.keys(districtServices),
    services: [...new Set(data.map(item => item.sgz_tipo_servico))].slice(0, 10),
    data: Object.entries(districtServices).map(([district, services]) => ({
      district,
      services: services as Record<string, number>,
    })),
  };

  return {
    statusDistribution: statusDistributionData,
    resolutionTime: resolutionTimeData,
    companiesCompleted: companiesData,
    areaDistribution: areaData,
    servicesDistribution: servicesData,
    districtServices: districtData,
    // Adicionaríamos os outros gráficos aqui
  };
};

// Funções auxiliares

function countByField(data: SGZOrdemServico[], field: keyof SGZOrdemServico) {
  return data.reduce((acc, item) => {
    const value = item[field] as string;
    if (!value) return acc;
    
    if (!acc[value]) {
      acc[value] = 0;
    }
    acc[value]++;
    return acc;
  }, {} as Record<string, number>);
}

function countByFieldWithFilter(
  data: SGZOrdemServico[], 
  field: keyof SGZOrdemServico,
  filter: (item: SGZOrdemServico) => boolean
) {
  return data.filter(filter).reduce((acc, item) => {
    const value = item[field] as string;
    if (!value) return acc;
    
    if (!acc[value]) {
      acc[value] = 0;
    }
    acc[value]++;
    return acc;
  }, {} as Record<string, number>);
}

function calculateAverageResolutionTime(data: SGZOrdemServico[]) {
  const items = data.filter(item => item.sgz_dias_ate_status_atual);
  if (items.length === 0) return 0;
  
  const sum = items.reduce((acc, item) => acc + (item.sgz_dias_ate_status_atual || 0), 0);
  return Math.round(sum / items.length);
}

function generateColors(count: number, baseColor: string) {
  if (baseColor === 'orange') {
    const colors = [
      'rgba(255, 159, 64, 0.9)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(255, 178, 102, 0.9)',
      'rgba(255, 178, 102, 0.8)',
      'rgba(255, 178, 102, 0.7)',
      'rgba(255, 178, 102, 0.6)',
      'rgba(255, 178, 102, 0.5)',
    ];
    
    // Se precisar de mais cores, gera dinamicamente
    if (count > colors.length) {
      for (let i = colors.length; i < count; i++) {
        const opacity = 0.9 - (i % 5) * 0.1;
        const shade = Math.floor(i / 5) * 20;
        colors.push(`rgba(255, ${159 + shade}, ${64 + shade}, ${opacity})`);
      }
    }
    
    return colors.slice(0, count);
  }
  
  // Caso padrão, gera cores aleatórias
  return Array(count).fill(0).map(() => 
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
  );
}

function getTopEntries(obj: Record<string, number>, limit: number): [string, number][] {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}
