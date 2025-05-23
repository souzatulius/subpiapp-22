
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const useExportPDF = () => {
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const element = document.getElementById('notas-table');
      if (!element) return;
      
      // Hide header and other elements during export
      const headerElements = document.querySelectorAll('header, .sidebar, .mobile-nav, footer');
      headerElements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      // Restore visibility
      headerElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
      
      const data = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      
      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("notas-oficiais.pdf");
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  return { handleExportPDF, exporting };
};
