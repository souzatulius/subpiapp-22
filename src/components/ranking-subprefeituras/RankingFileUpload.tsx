
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, AlertTriangle, FileSpreadsheet, CheckCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RankingFileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  lastUpdate: string | null;
  isUploading?: boolean;
  isSuccess?: boolean;
  successFileName?: string;
}

const RankingFileUpload: React.FC<RankingFileUploadProps> = ({ 
  onFileUpload, 
  lastUpdate,
  isUploading = false,
  isSuccess = false,
  successFileName = ''
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Check if it's an Excel file
    if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
      alert('Por favor, envie apenas arquivos Excel (.xls ou .xlsx)');
      return;
    }
    
    await onFileUpload(file);
  }, [onFileUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    disabled: isUploading
  });
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            ${isSuccess ? 'border-green-400 bg-green-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            ) : isSuccess ? (
              <CheckCircle className="h-10 w-10 text-green-500" />
            ) : (
              <UploadCloud className="h-10 w-10 text-blue-500" />
            )}
            
            <div className="space-y-1">
              <h3 className="text-lg font-medium">
                {isDragActive 
                  ? 'Solte o arquivo aqui' 
                  : isUploading 
                    ? 'Processando arquivo...' 
                    : isSuccess
                      ? 'Arquivo carregado com sucesso!'
                      : 'Carregar Planilha de Ordens de Serviço'
                }
              </h3>
              
              {!isUploading && !isSuccess && (
                <p className="text-sm text-gray-500">
                  Arraste e solte um arquivo Excel ou clique para selecionar
                </p>
              )}
              
              {isSuccess && successFileName && (
                <p className="text-sm text-gray-600">
                  {successFileName}
                </p>
              )}
            </div>
            
            {!isUploading && (
              <Button className="mt-2" disabled={isUploading}>
                {isSuccess ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Carregar novo arquivo
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Selecionar Arquivo
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="flex items-center text-yellow-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Apenas arquivos .xls ou .xlsx são aceitos</span>
          </div>
          
          {lastUpdate && (
            <div className="text-gray-500">
              Última atualização: {lastUpdate}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingFileUpload;
