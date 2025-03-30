
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoDataContextType {
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  hasData: boolean;
}

const DemoDataContext = createContext<DemoDataContextType>({
  sgzData: null,
  painelData: null,
  isLoading: true,
  hasData: false
});

export const useDemoData = () => useContext(DemoDataContext);

export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sgzData, setSgzData] = useState<any[] | null>(null);
  const [painelData, setPainelData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulando um carregamento
    const loadDemoData = () => {
      setIsLoading(true);
      
      // Criar dados fictícios para SGZ
      const mockSgzData = generateSgzMockData();
      setSgzData(mockSgzData);
      
      // Criar dados fictícios para o Painel
      const mockPainelData = generatePainelMockData();
      setPainelData(mockPainelData);
      
      setIsLoading(false);
    };
    
    // Carrega os dados após um pequeno delay para simular API
    const timer = setTimeout(() => {
      loadDemoData();
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const hasData = Boolean(sgzData && sgzData.length > 0);
  
  return (
    <DemoDataContext.Provider value={{ sgzData, painelData, isLoading, hasData }}>
      {children}
    </DemoDataContext.Provider>
  );
};

// Funções para gerar dados fictícios
function generateSgzMockData() {
  const distritos = ['Pinheiros', 'Alto de Pinheiros', 'Itaim Bibi', 'Jardim Paulista'];
  const statusOptions = ['Fechado', 'Pendente', 'Cancelado', 'Em andamento'];
  const tiposServico = [
    'Tapa-buraco', 'Poda de árvore', 'Limpeza de bueiro', 
    'Reparo de calçada', 'Remoção de entulho', 'Sinalização viária',
    'Reparo de iluminação', 'Manutenção de praça'
  ];
  const departamentos = ['STLP', 'STM', 'STPO'];
  
  const mockData = [];
  
  // Gerar 150 registros de exemplo
  for (let i = 0; i < 150; i++) {
    const distrito = distritos[Math.floor(Math.random() * distritos.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const tipoServico = tiposServico[Math.floor(Math.random() * tiposServico.length)];
    const departamento = departamentos[Math.floor(Math.random() * departamentos.length)];
    
    // Data de criação aleatória nos últimos 30 dias
    const dataBase = new Date();
    dataBase.setDate(dataBase.getDate() - Math.floor(Math.random() * 30));
    
    // Entre 0 e 15 dias para resolver
    const diasResolucao = Math.floor(Math.random() * 16);
    
    const ordemServico = {
      id: `OS-${100000 + i}`,
      sgz_distrito: distrito,
      sgz_status: status,
      sgz_tipo_servico: tipoServico,
      sgz_departamento_tecnico: departamento,
      sgz_empresa: status === 'Cancelado' ? 'EXTERNA' : 'SUBPREFEITURA',
      sgz_criado_em: dataBase.toISOString(),
      sgz_modificado_em: new Date(dataBase.getTime() + diasResolucao * 24 * 60 * 60 * 1000).toISOString(),
      sgz_dias_ate_status_atual: diasResolucao,
      ordem_servico: `OS-${100000 + i}`,
      sgz_bairro: `Bairro ${distrito}`,
      planilha_referencia: 'demo-data'
    };
    
    mockData.push(ordemServico);
  }
  
  return mockData;
}

function generatePainelMockData() {
  const mockData = [];
  
  // Gerar 70 registros para o painel
  for (let i = 0; i < 70; i++) {
    // Usar alguns dos mesmos IDs do SGZ para permitir comparação
    const osId = `OS-${100000 + i}`;
    
    const dataAbertura = new Date();
    dataAbertura.setDate(dataAbertura.getDate() - Math.floor(Math.random() * 30));
    
    const temFechamento = Math.random() > 0.3; // 70% têm data de fechamento
    let dataFechamento = null;
    if (temFechamento) {
      dataFechamento = new Date(dataAbertura);
      dataFechamento.setDate(dataFechamento.getDate() + Math.floor(Math.random() * 10));
    }
    
    const distritos = ['Pinheiros', 'Alto de Pinheiros', 'Itaim Bibi', 'Jardim Paulista'];
    const distrito = distritos[Math.floor(Math.random() * distritos.length)];
    
    const responsavelOptions = ['SUBPREFEITURA', 'SABESP', 'ENEL', 'CET', 'COMGÁS'];
    const responsavel = responsavelOptions[Math.floor(Math.random() * responsavelOptions.length)];
    
    const tiposServico = [
      'Tapa-buraco', 'Poda de árvore', 'Limpeza de bueiro', 'Reparo de calçada'
    ];
    const tipoServico = tiposServico[Math.floor(Math.random() * tiposServico.length)];
    
    const status = temFechamento ? 'Fechado' : (Math.random() > 0.5 ? 'Pendente' : 'Em andamento');
    
    const painelItem = {
      id: `PAINEL-${i}`,
      id_os: osId,
      data_abertura: dataAbertura.toISOString(),
      data_fechamento: dataFechamento ? dataFechamento.toISOString() : null,
      status: status,
      distrito: distrito,
      responsavel_real: responsavel,
      tipo_servico: tipoServico,
      departamento: 'ZELADORIA'
    };
    
    mockData.push(painelItem);
  }
  
  return mockData;
}

export default DemoDataProvider;
