
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NotaOficial } from '@/types/nota';

export const useExportNotaPDF = (formatDate: (dateString: string) => string) => {
  const [exporting, setExporting] = useState(false);

  const exportNotaToPDF = async (nota: NotaOficial) => {
    setExporting(true);
    try {
      // Criar um elemento virtual para renderizar a nota
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.width = '800px';
      element.style.background = 'white';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      
      // Adicionar conteúdo da nota
      const titulo = document.createElement('h1');
      titulo.style.fontSize = '24px';
      titulo.style.marginBottom = '10px';
      titulo.style.color = '#003570';
      titulo.textContent = nota.titulo || 'Nota Oficial';
      
      const dataElement = document.createElement('p');
      dataElement.style.fontSize = '14px';
      dataElement.style.color = '#666';
      dataElement.textContent = `Data: ${formatDate(nota.criado_em || nota.created_at || '')}`;
      
      const autorElement = document.createElement('p');
      autorElement.style.fontSize = '14px';
      autorElement.style.color = '#666';
      autorElement.textContent = `Autor: ${nota.autor?.nome_completo || 'Não especificado'}`;
      
      const textoElement = document.createElement('div');
      textoElement.style.marginTop = '20px';
      textoElement.style.fontSize = '14px';
      textoElement.style.lineHeight = '1.6';
      textoElement.innerHTML = nota.texto?.replace(/\n/g, '<br>') || '';
      
      // Adicionar os elementos ao container
      element.appendChild(titulo);
      element.appendChild(dataElement);
      element.appendChild(autorElement);
      element.appendChild(textoElement);
      
      // Adicionar à página para renderização
      document.body.appendChild(element);
      
      // Renderizar para canvas e exportar para PDF
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      // Remover elemento da página
      document.body.removeChild(element);
      
      // Gerar PDF
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`nota_oficial_${nota.id}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar nota para PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  return { exportNotaToPDF, exporting };
};
