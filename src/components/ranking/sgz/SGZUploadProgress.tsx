
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileUp } from 'lucide-react';

interface SGZUploadProgressProps {
  progress: number;
}

const SGZUploadProgress: React.FC<SGZUploadProgressProps> = ({ progress }) => {
  const getProgressMessage = () => {
    if (progress < 30) return 'Analisando arquivo...';
    if (progress < 50) return 'Processando dados...';
    if (progress < 70) return 'Salvando ordens de serviço...';
    if (progress < 95) return 'Finalizando processamento...';
    return 'Concluindo...';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileUp className="h-5 w-5 mr-2 text-orange-500" />
          Processando planilha
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{getProgressMessage()}</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Por favor, aguarde enquanto processamos os dados da planilha. Isso pode levar alguns minutos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SGZUploadProgress;
