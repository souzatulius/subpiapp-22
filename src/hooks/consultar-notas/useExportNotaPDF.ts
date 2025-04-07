
import { useState } from 'react';
import { NotaOficial } from '@/types/nota';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/use-toast';

export const useExportNotaPDF = (formatDate: (date: string) => string) => {
  const [exporting, setExporting] = useState(false);

  const exportNotaToPDF = async (nota: NotaOficial) => {
    if (!nota) return;
    
    try {
      setExporting(true);
      
      // Create a temporary div for rendering the PDF content
      const pdfContent = document.createElement('div');
      pdfContent.style.width = '210mm';
      pdfContent.style.padding = '15mm';
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      
      // Format data
      const autorNome = nota.autor?.nome_completo || "Autor desconhecido";
      const areaNome = nota.area_coordenacao?.descricao || 
                      nota.supervisao_tecnica?.descricao || 
                      "Área não especificada";
      const dataCriacao = nota.criado_em || nota.created_at || "";
      const textoConteudo = nota.texto || nota.conteudo || "";
      
      // Create content HTML
      pdfContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 18px; margin-bottom: 10px;">NOTA OFICIAL</h1>
          <p style="font-size: 12px;">Prefeitura de São Paulo</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 16px; margin-bottom: 15px;">${nota.titulo}</h2>
          <div style="font-size: 12px; color: #555; margin-bottom: 10px;">
            <div style="margin-bottom: 5px;">
              <strong>Autor:</strong> ${autorNome}
            </div>
            <div style="margin-bottom: 5px;">
              <strong>Área:</strong> ${areaNome}
            </div>
            <div style="margin-bottom: 5px;">
              <strong>Data:</strong> ${formatDate(dataCriacao)}
            </div>
          </div>
        </div>
        <div style="border-top: 1px solid #ddd; padding-top: 15px; font-size: 14px; line-height: 1.5;">
          ${textoConteudo.replace(/\n/g, '<br />')}
        </div>
      `;
      
      document.body.appendChild(pdfContent);
      
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      
      // A4 dimensions in pixels at 2x scale factor
      const pageWidth = 210 * 2 * 2.83;
      const pageHeight = 297 * 2 * 2.83;
      
      const pdf = new jsPDF('p', 'px', [pageWidth / 2, pageHeight / 2]);
      
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        0, 
        0, 
        pageWidth / 2, 
        (contentHeight * pageWidth) / (contentWidth * 2)
      );
      
      // Generate filename
      const filename = `nota_${nota.id.substring(0, 8)}_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      // Download PDF
      pdf.save(filename);
      
      // Clean up
      document.body.removeChild(pdfContent);
      
      toast({
        title: 'PDF gerado com sucesso',
        description: `O arquivo ${filename} foi baixado.`
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Não foi possível gerar o arquivo PDF.',
        variant: 'destructive'
      });
    } finally {
      setExporting(false);
    }
  };

  return { exportNotaToPDF, exporting };
};
