
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRealData } from './RealDataProvider';

interface DemoDataProviderProps {
  children: ReactNode;
}

const DemoDataProvider: React.FC<DemoDataProviderProps> = ({ children }) => {
  const [demoSgzData, setDemoSgzData] = useState<any[]>([]);
  const [demoPainelData, setDemoPainelData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Generate mock SGZ data
    const generateMockSgzData = () => {
      const districts = ['Centro', 'Leste', 'Norte', 'Oeste', 'Sul', 'Sudeste', 'Noroeste'];
      const serviceTypes = ['Tapa-buraco', 'Poda de árvore', 'Limpeza', 'Iluminação', 'Pavimentação'];
      const status = ['pendente', 'em-andamento', 'concluido', 'cancelado'];
      const departments = ['CPO', 'CPDU', 'AMB', 'CPL', 'CRO'];
      
      const mockData = [];
      
      for (let i = 0; i < 500; i++) {
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180));
        
        const currentStatus = status[Math.floor(Math.random() * status.length)];
        const daysToStatus = Math.floor(Math.random() * 30);
        
        mockData.push({
          id: `OS-${i + 1000}`,
          sgz_ordem_servico: `OS-${i + 1000}`,
          sgz_distrito: districts[Math.floor(Math.random() * districts.length)],
          sgz_tipo_servico: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
          sgz_status: currentStatus,
          sgz_coordenacao: departments[Math.floor(Math.random() * departments.length)],
          sgz_criado_em: createdDate.toISOString(),
          sgz_modificado_em: new Date(createdDate.getTime() + (daysToStatus * 24 * 60 * 60 * 1000)).toISOString(),
          sgz_dias_ate_status_atual: daysToStatus,
          sgz_descricao: `Demanda de teste ${i + 1}`
        });
      }
      
      setDemoSgzData(mockData);
    };
    
    // Generate mock Painel data
    const generateMockPainelData = () => {
      setDemoPainelData([
        { id: 1, name: 'Painel Data 1' },
        { id: 2, name: 'Painel Data 2' },
        { id: 3, name: 'Painel Data 3' }
      ]);
    };
    
    setTimeout(() => {
      generateMockSgzData();
      generateMockPainelData();
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Override the real data context with demo data
  const overriddenValue = {
    sgzData: demoSgzData,
    painelData: demoPainelData,
    isLoading,
    hasData: demoSgzData.length > 0 || demoPainelData.length > 0,
    refreshData: async () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    },
    lastUpdated: new Date()
  };
  
  return (
    <RealDataContext.Provider value={overriddenValue}>
      {children}
    </RealDataContext.Provider>
  );
};

// Re-export the same context
const RealDataContext = createContext<any>(null);

export default DemoDataProvider;
