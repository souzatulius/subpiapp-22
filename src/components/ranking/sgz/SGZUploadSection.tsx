
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, Trash2, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadInfo, UploadProgress } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SGZUploadSectionProps {
  onUpload: (file: File) => Promise<void>;
  lastUpload: UploadInfo | null;
  onDelete: () => Promise<void>;
  isLoading: boolean;
  uploadProgress: UploadProgress;
  resetProgress: () => void;
}

const SGZUploadSection: React.FC<SGZUploadSectionProps> = ({ 
  onUpload, 
  lastUpload, 
  onDelete,
  isLoading,
  uploadProgress,
  resetProgress
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      resetProgress();
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getProgressStatusText = () => {
    switch (uploadProgress.status) {
      case 'uploading':
        return 'Enviando arquivo...';
      case 'processing':
        return 'Processando planilha...';
      case 'success':
        return 'Planilha processada com sucesso!';
      case 'error':
        return uploadProgress.error || 'Erro ao processar planilha';
      default:
        return '';
    }
  };

  const getEstimatedTimeText = () => {
    if (!uploadProgress.estimatedTimeRemaining || uploadProgress.estimatedTimeRemaining <= 0) {
      return '';
    }
    
    const seconds = Math.round(uploadProgress.estimatedTimeRemaining);
    if (seconds < 60) {
      return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
    } else {
      const minutes = Math.ceil(seconds / 60);
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }
  };

  const renderUploadStatus = () => {
    if (uploadProgress.status === 'idle') return null;
    
    return (
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {uploadProgress.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
            {uploadProgress.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
            {(uploadProgress.status === 'uploading' || uploadProgress.status === 'processing') && 
              <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />
            }
            <span className={`text-sm font-medium ${
              uploadProgress.status === 'success' ? 'text-green-600' : 
              uploadProgress.status === 'error' ? 'text-red-600' : 
              'text-orange-600'
            }`}>
              {getProgressStatusText()}
            </span>
          </div>
          {getEstimatedTimeText() && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>Tempo estimado: {getEstimatedTimeText()}</span>
            </div>
          )}
        </div>
        
        <Progress 
          value={uploadProgress.progress} 
          className={`h-2 ${
            uploadProgress.status === 'success' ? 'bg-green-100' : 
            uploadProgress.status === 'error' ? 'bg-red-100' : 
            'bg-orange-100'
          }`} 
        />
        
        {uploadProgress.message && (
          <p className="text-xs text-gray-500">{uploadProgress.message}</p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Planilha SGZ</CardTitle>
        <CardDescription>
          Carregue uma planilha Excel com dados das ordens de serviço da zeladoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              className="max-w-md"
              disabled={isLoading || uploadProgress.status === 'uploading' || uploadProgress.status === 'processing'}
            />
            <Button 
              onClick={handleUploadClick} 
              disabled={!selectedFile || isLoading || uploadProgress.status === 'uploading' || uploadProgress.status === 'processing'}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Carregar Planilha
            </Button>
          </div>
          
          {renderUploadStatus()}
          
          {lastUpload && (
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-sm">{lastUpload.fileName}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-3 w-3" />
                    {lastUpload.uploadDate} ({formatDistanceToNow(new Date(lastUpload.uploadDate), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })})
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500" 
                  onClick={onDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SGZUploadSection;
