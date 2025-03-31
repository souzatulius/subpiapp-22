
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
interface DemoDataContextType {
  sgzData: any[] | null;
  painelData: any[] | null;
  isLoading: boolean;
  hasData: boolean;
  refreshData: () => Promise<void>;
}

// Create the context with default values
const DemoDataContext = createContext<DemoDataContextType>({
  sgzData: null,
  painelData: null,
  isLoading: true,
  hasData: false,
  refreshData: async () => {}
});

// Custom hook to use the context
export const useDemoData = () => useContext(DemoDataContext);

// Provider component
interface DemoDataProviderProps {
  children: ReactNode;
}

const DemoDataProvider: React.FC<DemoDataProviderProps> = ({ children }) => {
  const [sgzData, setSgzData] = useState<any[] | null>(null);
  const [painelData, setPainelData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to load demo data
  const loadDemoData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate demo SGZ data
      const demoSgzData = generateDemoSgzData();
      setSgzData(demoSgzData);
      
      // Generate demo Painel data
      const demoPainelData = generateDemoPainelData();
      setPainelData(demoPainelData);
    } catch (error) {
      console.error("Error loading demo data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh data (reload the demo data)
  const refreshData = async () => {
    await loadDemoData();
  };
  
  // Load demo data on mount
  useEffect(() => {
    loadDemoData();
  }, []);
  
  return (
    <DemoDataContext.Provider value={{ 
      sgzData, 
      painelData, 
      isLoading, 
      hasData: Boolean(sgzData?.length || painelData?.length),
      refreshData
    }}>
      {children}
    </DemoDataContext.Provider>
  );
};

// Helper functions to generate demo data
function generateDemoSgzData() {
  // Generate sample SGZ data for demonstration
  const distritos = ['Butantã', 'Pinheiros', 'Lapa', 'Vila Mariana', 'Mooca'];
  const tiposServico = ['Tapa-buraco', 'Poda de árvore', 'Limpeza de bueiro', 'Reparo de calçada', 'Sinalização'];
  const status = ['Concluído', 'Em andamento', 'Pendente', 'Cancelado'];
  const empresas = ['Empresa A', 'Empresa B', 'Empresa C'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    id: `demo-sgz-${i}`,
    sgz_distrito: distritos[Math.floor(Math.random() * distritos.length)],
    sgz_bairro: `Bairro ${Math.floor(Math.random() * 15) + 1}`,
    sgz_tipo_servico: tiposServico[Math.floor(Math.random() * tiposServico.length)],
    sgz_status: status[Math.floor(Math.random() * status.length)],
    sgz_empresa: empresas[Math.floor(Math.random() * empresas.length)],
    sgz_criado_em: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    sgz_modificado_em: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000),
    sgz_dias_ate_status_atual: Math.floor(Math.random() * 30),
    ordem_servico: `OS-${100000 + i}`
  }));
}

function generateDemoPainelData() {
  // Generate sample Painel data for demonstration
  const distritos = ['Butantã', 'Pinheiros', 'Lapa', 'Vila Mariana', 'Mooca'];
  const tiposServico = ['Tapa-buraco', 'Poda de árvore', 'Limpeza de bueiro', 'Reparo de calçada', 'Sinalização'];
  const status = ['Concluído', 'Em andamento', 'Pendente', 'Cancelado'];
  const departamentos = ['SPUA', 'SPO', 'STLP', 'STSP'];
  
  return Array.from({ length: 80 }, (_, i) => ({
    id: `demo-painel-${i}`,
    id_os: `OS-${100000 + i}`,
    distrito: distritos[Math.floor(Math.random() * distritos.length)],
    tipo_servico: tiposServico[Math.floor(Math.random() * tiposServico.length)],
    status: status[Math.floor(Math.random() * status.length)],
    departamento: departamentos[Math.floor(Math.random() * departamentos.length)],
    data_abertura: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    data_fechamento: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000),
    responsavel_real: `Responsável ${Math.floor(Math.random() * 10) + 1}`
  }));
}

export default DemoDataProvider;
