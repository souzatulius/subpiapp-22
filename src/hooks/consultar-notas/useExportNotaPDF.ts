
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { toast } from '@/components/ui/use-toast';
import { NotaOficial } from '@/types/nota';

export const useExportNotaPDF = (formatDate: (dateStr: string) => string) => {
  const [exporting, setExporting] = useState(false);

  const exportNotaToPDF = async (nota: NotaOficial) => {
    if (!nota) return;
    
    setExporting(true);
    try {
      // Criar um novo documento PDF
      const doc = new jsPDF();
      
      // Configurar estilo do documento
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      
      // Título
      doc.text('NOTA OFICIAL', 105, 20, { align: 'center' });
      
      // Configurar texto normal
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      // Informações da nota
      // Usar o valor efetivo ou um valor padrão quando a propriedade não existir
      const autorNome = nota.autor?.nome_completo || 'Autor desconhecido';
      const areaNome = nota.supervisao_tecnica?.descricao || 'Área não especificada';
      const dataFormated = formatDate(nota.criado_em || '');
      
      // Título da nota
      doc.setFont('helvetica', 'bold');
      doc.text(`Título: ${nota.titulo}`, 20, 40);
      
      // Metadados
      doc.setFont('helvetica', 'normal');
      doc.text(`Autor: ${autorNome}`, 20, 50);
      doc.text(`Área: ${areaNome}`, 20, 60);
      doc.text(`Data: ${dataFormated}`, 20, 70);
      doc.text(`Status: ${nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}`, 20, 80);
      
      // Conteúdo
      doc.setFont('helvetica', 'bold');
      doc.text('Conteúdo:', 20, 100);
      
      doc.setFont('helvetica', 'normal');
      
      // Quebrar linhas longas para melhor formatação
      const splitText = doc.splitTextToSize(nota.texto, 170);
      doc.text(splitText, 20, 110);
      
      // Gerar o PDF
      doc.save(`nota_oficial_${nota.id}.pdf`);
      
      toast({
        title: "Exportação concluída",
        description: "A nota foi exportada como PDF."
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar a nota como PDF.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return { exportNotaToPDF, exporting };
};
