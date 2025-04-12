
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

interface UploadHistoryCardProps {
  sgzData: any[] | null;
  painelData: any[] | null;
  lastUpdate: string | null;
}

const UploadHistoryCard: React.FC<UploadHistoryCardProps> = ({
  sgzData,
  painelData,
  lastUpdate
}) => {
  const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : null;
  const dataSource = localStorage.getItem('demo-data-source') || 'unknown';
  
  const getStatusIcon = (data: any[] | null) => {
    if (!data) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    if (data.length === 0) return <XCircle className="h-4 w-4 text-red-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Histórico de Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {getStatusIcon(sgzData)}
              <span className="ml-2 font-medium">SGZ</span>
            </div>
            <div className="text-sm text-gray-600">
              {sgzData ? `${sgzData.length} registros` : 'Nenhum dado'}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {getStatusIcon(painelData)}
              <span className="ml-2 font-medium">Painel</span>
            </div>
            <div className="text-sm text-gray-600">
              {painelData ? `${painelData.length} registros` : 'Nenhum dado'}
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Última atualização
              </div>
              <div className="text-sm">
                {lastUpdateDate ? (
                  <span title={lastUpdateDate.toLocaleString()}>
                    {formatDistanceToNow(lastUpdateDate, { locale: ptBR, addSuffix: true })}
                  </span>
                ) : (
                  'Nunca'
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center text-sm text-gray-500">
                Fonte de dados
              </div>
              <div className="text-sm">
                {dataSource === 'upload' ? (
                  <span className="text-green-600 font-medium">Upload</span>
                ) : dataSource === 'supabase' ? (
                  <span className="text-blue-600 font-medium">Supabase</span>
                ) : (
                  <span className="text-orange-600 font-medium">Demo</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadHistoryCard;
