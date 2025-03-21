
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/use-toast';

interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  criado_em: string;
  autor: {
    nome_completo: string;
  };
  area_coordenacao: {
    descricao: string;
  };
}

export const useExportNotaPDF = (formatDate: (date: string) => string) => {
  const [exporting, setExporting] = useState(false);

  const exportNotaToPDF = async (nota: NotaOficial) => {
    try {
      setExporting(true);
      
      // Create a temporary div to render the note content
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '600px';
      tempDiv.style.padding = '20px';
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Add the content
      tempDiv.innerHTML = `
        <div style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">
          <h1 style="color: #003570; font-size: 24px; margin-bottom: 10px;">${nota.titulo}</h1>
          <div style="color: #666; font-size: 12px;">
            <p>Autor: ${nota.autor?.nome_completo || 'Não informado'}</p>
            <p>Área: ${nota.area_coordenacao?.descricao || 'Não informada'}</p>
            <p>Data de criação: ${formatDate(nota.criado_em)}</p>
            <p>Status: ${nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}</p>
          </div>
        </div>
        <div style="font-size: 14px; line-height: 1.5;">
          ${nota.texto?.replace(/\n/g, '<br>') || ''}
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      // Convert the div to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      // Remove the temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      const imgWidth = pdfWidth;
      const imgHeight = imgWidth / ratio;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      // Save the PDF
      pdf.save(`nota-${nota.titulo.substring(0, 20)}.pdf`);
      
      toast({
        title: 'PDF gerado com sucesso',
        description: 'O PDF da nota foi gerado e baixado.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Ocorreu um erro ao gerar o PDF da nota.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  return { exportNotaToPDF, exporting };
};
