
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
  '.welcome-card', // Hide the welcome card (header card)
];

// Custom style to add to the document during export
const exportStyles = `
  /* Hide navigation, buttons, and controls */
  .navigation, .button, button:not(.keep-in-pdf), 
  .sidebar, header, .header, .filter, .filters,
  .control, .controls, #mobile-nav, .mobile-nav,
  .toolbar, .actions, [role="dialog"], .dialog,
  footer, .footer, .upload-section, .welcome-card {
    display: none !important;
  }

  /* Focus on content */
  .pdf-content, .chart-container {
    margin: 0 auto;
    transform: scale(0.8); /* Scale to 80% */
    transform-origin: top center;
    width: 125% !important; /* Compensate for scaling */
    padding-left: 8% !important; /* Add left margin */
    padding-right: 8% !important; /* Add right margin */
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
  
  /* Ensure cards don't break across pages */
  .sortable-chart-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Improved spacing */
  .space-y-6 {
    margin-top: 2rem !important;
  }

  /* Center content */
  .container, .max-w-7xl {
    margin-left: auto !important;
    margin-right: auto !important;
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
        
        // Also specifically hide the welcome card headers 
        const welcomeCards = documentClone.querySelectorAll('.welcome-card');
        welcomeCards.forEach(card => {
          (card as HTMLElement).style.display = 'none';
        });
        
        // Hide header and title elements specific to the ranking and relatorios pages
        const pageHeaderElements = documentClone.querySelectorAll('h1.text-2xl');
        pageHeaderElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });

        // Apply additional margin to content for better spacing
        const contentContainer = documentClone.querySelector('.pdf-content') || documentClone.querySelector('main');
        if (contentContainer) {
          (contentContainer as HTMLElement).style.paddingLeft = '8%';
          (contentContainer as HTMLElement).style.paddingRight = '8%';
        }
      }
    });

    // Calculate the number of pages needed
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    const pageCount = Math.ceil(imgHeight / pageHeight);
    
    // Convert to image and add to PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 10, pageWidth, imgHeight);

    // For longer content, ensure proper pagination
    if (pageCount > 1) {
      for (let i = 1; i < pageCount; i++) {
        pdf.addPage();
        pdf.addImage(
          imgData,
          'JPEG',
          0,
          -(pageHeight * i) + 10, // offset for each page
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
