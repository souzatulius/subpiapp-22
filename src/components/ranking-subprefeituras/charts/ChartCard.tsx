
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Printer, Download } from 'lucide-react';
import { ChartData } from '../types';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import IndicatorCard from './IndicatorCard';
import HorizontalBarChart from './HorizontalBarChart';
import GroupedBarChart from './GroupedBarChart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ChartCardProps {
  chart: ChartData;
  onToggleVisibility: (chartId: string) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ chart, onToggleVisibility }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  // Handle print
  const handlePrint = () => {
    if (!cardRef.current) return;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; padding: 20px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h2>${chart.title}</h2>`);
    
    // Clone the chart area, remove buttons, and add to print window
    const chartArea = cardRef.current.querySelector('.chart-area')?.cloneNode(true) as HTMLElement;
    if (chartArea) {
      // Remove any buttons or interactive elements
      const buttons = chartArea.querySelectorAll('button');
      buttons.forEach(button => button.remove());
      
      printWindow.document.body.appendChild(chartArea);
    }
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
  
  // Handle download as image
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    
    const chartArea = cardRef.current.querySelector('.chart-area');
    if (!chartArea) return;
    
    try {
      const canvas = await html2canvas(chartArea as HTMLElement);
      const imageData = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `${chart.title.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
    }
  };
  
  // Handle download as PDF
  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    
    const chartArea = cardRef.current.querySelector('.chart-area');
    if (!chartArea) return;
    
    try {
      const canvas = await html2canvas(chartArea as HTMLElement);
      const imageData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      
      pdf.setFontSize(16);
      pdf.text(chart.title, 14, 15);
      pdf.addImage(imageData, 'PNG', 10, 25, width - 20, height - 10);
      pdf.save(`${chart.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };
  
  if (!chart.visible) {
    return (
      <Card className="shadow-sm bg-gray-50 opacity-70 hover:opacity-100 transition-opacity">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-500 line-clamp-2">{chart.title}</CardTitle>
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center">
          <p className="text-gray-400 text-center">Gráfico oculto</p>
        </CardContent>
        <CardFooter className="flex justify-end pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleVisibility(chart.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Mostrar
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return <BarChart data={chart.data} />;
      case 'pie':
        return <PieChart data={chart.data} />;
      case 'line':
        return <LineChart data={chart.data} />;
      case 'indicator':
        return <IndicatorCard data={chart.data} />;
      case 'horizontalBar':
        return <HorizontalBarChart data={chart.data} />;
      case 'groupedBar':
        return <GroupedBarChart data={chart.data} />;
      default:
        return <div>Tipo de gráfico não suportado</div>;
    }
  };
  
  return (
    <Card ref={cardRef} className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{chart.title}</CardTitle>
      </CardHeader>
      <CardContent className="chart-area pt-0 min-h-[250px]">
        {renderChart()}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-1" />
            Imprimir
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onToggleVisibility(chart.id)}
        >
          <EyeOff className="h-4 w-4 mr-1" />
          Ocultar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChartCard;
