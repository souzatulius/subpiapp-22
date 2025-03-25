
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Share2, FileSpreadsheet } from 'lucide-react';

const ActionsSection = () => {
  const handleExportExcel = () => {
    // In a production environment, this would trigger an Excel export
    console.log('Exportando dados para Excel...');
  };

  const handlePrintReport = () => {
    // In a production environment, this would trigger print
    console.log('Imprimindo relatório...');
    window.print();
  };

  const handleShare = () => {
    // In a production environment, this would open sharing options
    console.log('Compartilhando relatório...');
  };

  const handleDownloadTemplate = () => {
    // In a production environment, this would download a template
    console.log('Baixando modelo de planilha SGZ...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2 text-orange-700 border-orange-200 hover:bg-orange-50" onClick={handleExportExcel}>
            <Download size={16} />
            <span>Exportar Dados</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2 text-orange-700 border-orange-200 hover:bg-orange-50" onClick={handlePrintReport}>
            <Printer size={16} />
            <span>Imprimir Relatório</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2 text-orange-700 border-orange-200 hover:bg-orange-50" onClick={handleShare}>
            <Share2 size={16} />
            <span>Compartilhar</span>
          </Button>

          <Button variant="outline" className="flex items-center gap-2 text-orange-700 border-orange-200 hover:bg-orange-50" onClick={handleDownloadTemplate}>
            <FileSpreadsheet size={16} />
            <span>Baixar Modelo SGZ</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionsSection;
