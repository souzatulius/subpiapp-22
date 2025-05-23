
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Upload, Clock, Database, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUploadState } from '@/hooks/ranking/useUploadState';

interface UploadHistoryCardProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  lastUpdate: string | null;
  isRefreshing?: boolean;
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Nunca';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
};

const UploadHistoryCard: React.FC<UploadHistoryCardProps> = ({ 
  sgzData, 
  painelData,
  lastUpdate,
  isRefreshing = false
}) => {
  // State to store the actual data counts
  const [sgzCount, setSgzCount] = useState<number>(0);
  const [painelCount, setPainelCount] = useState<number>(0);
  const { lastRefreshTime, dataSource } = useUploadState();
  
  // Format last update time from the uploadState
  const formattedLastRefresh = lastRefreshTime 
    ? (typeof lastRefreshTime === 'string' 
       ? formatDate(lastRefreshTime) 
       : formatDate(lastRefreshTime.toISOString()))
    : formatDate(lastUpdate);
  
  // Update counts when data changes
  useEffect(() => {
    if (Array.isArray(sgzData)) {
      setSgzCount(sgzData.length);
    } else {
      setSgzCount(0);
    }
    
    if (Array.isArray(painelData)) {
      setPainelCount(painelData.length);
    } else {
      setPainelCount(0);
    }
  }, [sgzData, painelData]);
  
  // Read data source with fallback to localStorage
  const currentDataSource = dataSource || localStorage.getItem('demo-data-source') || 'unknown';
  
  // Synchronize with localStorage every time the component renders
  useEffect(() => {
    const storedDataSource = localStorage.getItem('demo-data-source');
    if (storedDataSource && storedDataSource !== currentDataSource) {
      console.log(`Data source mismatch: state=${currentDataSource}, localStorage=${storedDataSource}`);
    }
  }, [currentDataSource]);
  
  // Determine the source badge color and text
  let sourceColor = 'bg-gray-500';
  let sourceText = 'Desconhecida';
  
  if (currentDataSource === 'mock') {
    sourceColor = 'bg-amber-500';
    sourceText = 'Demonstração';
  } else if (currentDataSource === 'upload') {
    sourceColor = 'bg-green-500';
    sourceText = 'Upload Manual';
  } else if (currentDataSource === 'supabase') {
    sourceColor = 'bg-blue-500';
    sourceText = 'Base de Dados';
  }
  
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Histórico de Dados
          </span>
          <Badge className={`${sourceColor} text-white`}>{sourceText}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          <li className="flex justify-between items-center text-sm py-1 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <Database className="h-4 w-4 mr-2 text-gray-500" />
              SGZ Registros
            </span>
            <span className="font-medium">{isRefreshing ? '...' : sgzCount}</span>
          </li>
          <li className="flex justify-between items-center text-sm py-1 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <Database className="h-4 w-4 mr-2 text-gray-500" />
              Painel Registros
            </span>
            <span className="font-medium">{isRefreshing ? '...' : painelCount}</span>
          </li>
          <li className="flex justify-between items-center text-sm py-1">
            <span className="text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              Última Atualização
            </span>
            <span className="font-medium text-xs">
              {isRefreshing ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                formattedLastRefresh
              )}
            </span>
          </li>
          <li className="flex justify-between items-center text-sm py-1">
            <span className="text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              Fonte de Dados
            </span>
            <span className="font-medium text-xs capitalize">{currentDataSource}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default UploadHistoryCard;
