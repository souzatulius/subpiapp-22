
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ActionsSection = () => {
  const { toast } = useToast();

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Gerando PDF",
        description: "Aguarde enquanto preparamos seu relatório...",
      });

      const chartsSection = document.querySelector('.charts-section') as HTMLElement;
      if (!chartsSection) {
        throw new Error("Não foi possível encontrar a seção de gráficos");
      }

      const canvas = await html2canvas(chartsSection);
      const imgData = canvas.toDataURL('image/png');
      
      // Cria um novo documento PDF
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Adiciona título
      pdf.setFontSize(16);
      pdf.text('Relatório de Ranking das Subs', pdfWidth / 2, 15, { align: 'center' });
      
      // Adiciona data
      pdf.setFontSize(10);
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pdfWidth / 2, 22, { align: 'center' });
      
      // Adiciona imagem dos gráficos
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 10, 25, imgWidth, imgHeight);
      
      // Salva o PDF
      pdf.save('ranking-subs-relatorio.pdf');
      
      toast({
        title: "PDF Gerado",
        description: "Seu relatório foi gerado e baixado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: error.message || "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end print:hidden">
      <Button variant="outline" onClick={handleExportPDF}>
        <Download className="mr-2 h-4 w-4" />
        Baixar Relatório em PDF
      </Button>
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Imprimir Gráficos
      </Button>
    </div>
  );
};

export default ActionsSection;
