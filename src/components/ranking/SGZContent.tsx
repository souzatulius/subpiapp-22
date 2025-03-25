
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useSGZData } from '@/hooks/ranking/useSGZData';
import SGZUploadSection from './sgz/SGZUploadSection';
import SGZFilters from './sgz/SGZFilters';
import SGZCharts from './sgz/SGZCharts';
import SGZUploadProgress from './sgz/SGZUploadProgress';

const SGZContent: React.FC = () => {
  const { user } = useAuth();
  const {
    lastUpload,
    isLoading,
    isUploading,
    uploadProgress,
    chartData,
    ordens,
    filters,
    handleFileUpload,
    deleteLastUpload,
    applyFilters,
    fetchLastUpload
  } = useSGZData(user);

  return (
    <div className="space-y-6">
      {isUploading ? (
        <SGZUploadProgress progress={uploadProgress} />
      ) : (
        <SGZUploadSection 
          onUpload={handleFileUpload} 
          lastUpload={lastUpload} 
          onDelete={deleteLastUpload} 
          isLoading={isLoading}
          onRefresh={fetchLastUpload}
        />
      )}
      
      <SGZFilters 
        filters={filters}
        onFiltersChange={applyFilters}
        isLoading={isLoading}
      />
      
      <SGZCharts 
        data={chartData}
        isLoading={isLoading}
      />
      
      {lastUpload && (
        <Card className="border-t pt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informações do último upload</CardTitle>
            <CardDescription>
              {lastUpload.qtd_ordens_processadas} ordens processadas, {lastUpload.qtd_ordens_validas} válidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Arquivo: {lastUpload.arquivo_nome}
            </p>
            <p className="text-sm text-muted-foreground">
              Data: {new Date(lastUpload.data_upload || '').toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SGZContent;
