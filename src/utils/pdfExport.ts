
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Define class names for elements that should be hidden during PDF export
const elementsToHide = [
  '.navigation',
  '.button',
  'button:not(.keep-in-pdf)',
  '.sidebar',
  'header',
  '.header',
  '.filter',
  '.filters',
  '.control',
  '.controls',
  '#mobile-nav',
  '.mobile-nav',
  '.toolbar',
  '.actions',
  '[role="dialog"]',
  '.dialog',
  'footer',
  '.footer',
  '.upload-section', // Hide the upload section
];

// Custom style to add to the document during export
const exportStyles = `
  /* Hide navigation, buttons, and controls */
  .navigation, .button, button:not(.keep-in-pdf), 
  .sidebar, header, .header, .filter, .filters,
  .control, .controls, #mobile-nav, .mobile-nav,
  .toolbar, .actions, [role="dialog"], .dialog,
  footer, .footer, .upload-section {
    display: none !important;
  }

  /* Focus on content */
  .pdf-content, .chart-container {
    margin: 0 auto;
    transform: scale(0.8); /* Scale to 80% */
    transform-origin: top center;
    width: 125% !important; /* Compensate for scaling */
  }

  /* Improved presentation of charts */
  .chart-card, .card {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 1rem;
  }

  /* Hide tooltips */
  .tooltip, [role="tooltip"], .recharts-tooltip-wrapper {
    display: none !important;
  }

  /* Make background white */
  body, .main-content {
    background-color: white !important;
  }

  /* Show only title and main content */
  .title-container, .welcome-card {
    margin: 20px 0;
    text-align: center;
  }
  
  /* Ensure cards don't break across pages */
  .sortable-chart-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

export const exportToPDF = async (pageTitle: string) => {
  // Add temporary stylesheet for PDF generation
  const styleElement = document.createElement('style');
  styleElement.id = 'pdf-export-styles';
  styleElement.innerHTML = exportStyles;
  document.head.appendChild(styleElement);

  try {
    // Target the main content area
    const contentElement = document.querySelector('.pdf-content') || document.querySelector('main');
    
    if (!contentElement) {
      throw new Error('Could not find content element to export');
    }

    // Add export class to mark content for PDF
    contentElement.classList.add('exporting-pdf');

    // Prepare the PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add title to the first page
    pdf.setFontSize(18);
    pdf.text(pageTitle, pageWidth / 2, 20, { align: 'center' });

    // Capture the rendered content
    const canvas = await html2canvas(contentElement as HTMLElement, { 
      scale: 1.5, // Higher quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: 1200, // Fixed width for consistency
      onclone: (documentClone) => {
        // Hide elements in the cloned document that should not appear in the PDF
        elementsToHide.forEach(selector => {
          const elements = documentClone.querySelectorAll(selector);
          elements.forEach(el => {
            (el as HTMLElement).style.display = 'none';
          });
        });
        
        // Also specifically hide the upload section
        const uploadSection = documentClone.querySelector('.p-4.bg-white.border-orange-200:first-of-type');
        if (uploadSection) {
          (uploadSection as HTMLElement).style.display = 'none';
        }
      }
    });

    // Calculate the number of pages needed
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    const pageCount = Math.ceil(imgHeight / pageHeight);
    
    // Convert to image and add to PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 30, pageWidth, imgHeight);

    // For longer content, ensure proper pagination
    if (pageCount > 1) {
      for (let i = 1; i < pageCount; i++) {
        pdf.addPage();
        pdf.addImage(
          imgData,
          'JPEG',
          0,
          -(pageHeight * i) + 30, // offset for each page
          pageWidth,
          imgHeight
        );
      }
    }

    // Save the PDF
    pdf.save(`${pageTitle.replace(/\s/g, '_')}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    // Remove the temporary style element
    const styleElement = document.getElementById('pdf-export-styles');
    if (styleElement) {
      styleElement.remove();
    }

    // Remove export class
    const contentElement = document.querySelector('.exporting-pdf');
    if (contentElement) {
      contentElement.classList.remove('exporting-pdf');
    }
  }
};

// Simpler function for printing with proper styles
export const printWithStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.id = 'print-export-styles';
  styleElement.innerHTML = exportStyles;
  document.head.appendChild(styleElement);

  window.print();

  // Remove styles after printing dialog closes
  setTimeout(() => {
    const styleEl = document.getElementById('print-export-styles');
    if (styleEl) styleEl.remove();
  }, 1000);
};
