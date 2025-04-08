
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ListStart, CalendarDays } from 'lucide-react';

interface UploadSectionProps {
  onUploadStart: () => void;
  onUploadComplete: (id: string, data: any[]) => void;
  onPainelUploadComplete: (id: string, data: any[]) => void;
  isUploading: boolean;
  user: any;
}

const UploadSection = ({
  onUploadStart,
  onUploadComplete,
  onPainelUploadComplete,
  isUploading,
  user
}: UploadSectionProps) => {
  // Simulate file upload logic
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'sgz' | 'painel') => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart();

    // Simulate processing delay
    setTimeout(() => {
      const mockId = `upload-${Date.now()}`;
      const mockData = Array(50).fill(0).map((_, i) => ({
        id: i,
        status: ['concluido', 'pendente', 'cancelado'][Math.floor(Math.random() * 3)],
        data: new Date().toISOString(),
        servico: ['Poda de Árvore', 'Tapa Buraco', 'Limpeza de Bueiro'][Math.floor(Math.random() * 3)]
      }));
      
      if (type === 'sgz') {
        onUploadComplete(mockId, mockData);
      } else {
        onPainelUploadComplete(mockId, mockData);
      }
      
      // Reset the file input
      event.target.value = '';
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* SGZ Upload */}
      <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <ListStart className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="text-sm font-medium text-gray-700 mb-1">Planilha SGZ</h3>
        <p className="text-xs text-gray-500 mb-3 text-center">
          Upload do arquivo Excel exportado do SGZ
        </p>
        <input
          type="file"
          id="sgzFile"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'sgz')}
          disabled={isUploading}
        />
        <label htmlFor="sgzFile">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            disabled={isUploading}
            asChild
          >
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Carregando...' : 'Selecionar Arquivo'}
            </span>
          </Button>
        </label>
      </div>

      {/* Painel Upload */}
      <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <CalendarDays className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="text-sm font-medium text-gray-700 mb-1">Painel da Zeladoria</h3>
        <p className="text-xs text-gray-500 mb-3 text-center">
          Upload do arquivo Excel do Painel da Zeladoria
        </p>
        <input
          type="file"
          id="painelFile"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'painel')}
          disabled={isUploading}
        />
        <label htmlFor="painelFile">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            disabled={isUploading}
            asChild
          >
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Carregando...' : 'Selecionar Arquivo'}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
};

export default UploadSection;
