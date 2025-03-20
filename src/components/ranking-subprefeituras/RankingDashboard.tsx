
import React, { useState } from 'react';
import useOrdensServico from './hooks/useOrdensServico';
import RankingFileUpload from './RankingFileUpload';
import RankingFilters from './RankingFilters';
import ChartCard from './charts/ChartCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download, RefreshCw, BarChart4, ListFilter } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const RankingDashboard: React.FC = () => {
  const {
    chartData,
    loading,
    uploadExcel,
    downloadExcel,
    downloadUploadedFile,
    uploadFile,
    fetchOrdens,
    setFilters,
    stats,
    calculateStats
  } = useOrdensServico();

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);
  const [isUpdatingCharts, setIsUpdatingCharts] = useState(false);

  const dashboardRef = React.useRef<HTMLDivElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setIsUploadSuccess(false);
    try {
      await uploadExcel(file);
      setIsUploadSuccess(true);
      setUploadedFileName(file.name);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleChartVisibility = (chartId: string) => {
    // This is a placeholder for the toggleChartVisibility function
    console.log('Toggle visibility for chart:', chartId);
  };

  const handleUpdateStats = async () => {
    setIsUpdatingStats(true);
    try {
      await calculateStats();
    } finally {
      setIsUpdatingStats(false);
    }
  };

  const handleUpdateCharts = async () => {
    setIsUpdatingCharts(true);
    try {
      await fetchOrdens();
    } finally {
      setIsUpdatingCharts(false);
    }
  };

  const handleExportAllToPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const visibleCharts = dashboardRef.current.querySelectorAll('.chart-card:not(.hidden)');
      if (!visibleCharts.length) return;
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // Add title
      pdf.setFontSize(18);
      pdf.text('Ranking das Subprefeituras - Relatório Completo', margin, margin + 5);
      const lastUpdate = new Date().toLocaleDateString('pt-BR');
      pdf.setFontSize(10);
      pdf.text(`Data da última atualização: ${lastUpdate}`, margin, margin + 10);
      let yPosition = margin + 20;
      for (let i = 0; i < visibleCharts.length; i++) {
        const chart = visibleCharts[i];
        const canvas = await html2canvas(chart as HTMLElement);
        const imgData = canvas.toDataURL('image/png');

        // Check if we need to add a new page
        if (i > 0) {
          pdf.addPage();
          yPosition = margin;
        }

        // Get chart title
        const titleElement = chart.querySelector('.chart-title');
        const title = titleElement ? titleElement.textContent || 'Gráfico' : `Gráfico ${i + 1}`;
        pdf.setFontSize(14);
        pdf.text(title, margin, yPosition);
        yPosition += 10;

        // Calculate image dimensions to fit the page
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }
      pdf.save('Ranking_Subprefeituras_Relatorio.pdf');
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
    }
  };

  const generateUpdatedCharts = (newFilters: any) => {
    setFilters(newFilters);
    fetchOrdens();
  };

  return (
    <div className="space-y-6" ref={dashboardRef}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#003570]">Ranking das Subprefeituras</h2>
          <p className="text-gray-500">
            Análise de ordens de serviço e distribuição por distrito
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExportAllToPDF}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>
      
      <RankingFileUpload 
        onFileUpload={handleUpload} 
        lastUpdate={new Date().toLocaleDateString('pt-BR')} 
        isUploading={isUploading}
        isSuccess={isUploadSuccess}
        successFileName={uploadedFileName}
      />
      
      {isUploadSuccess && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleUpdateStats} 
            disabled={isUpdatingStats}
            variant="secondary"
            className="flex-1"
          >
            {isUpdatingStats ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ListFilter className="mr-2 h-4 w-4" />
            )}
            Atualizar Apenas Números
          </Button>
          
          <Button 
            onClick={handleUpdateCharts}
            disabled={isUpdatingCharts}
            className="flex-1"
          >
            {isUpdatingCharts ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BarChart4 className="mr-2 h-4 w-4" />
            )}
            Atualizar Gráficos
          </Button>
        </div>
      )}
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Total de Ocorrências</div>
              <div className="text-2xl font-bold">{stats?.totalOrdens || 0}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Tempo Médio (dias)</div>
              <div className="text-2xl font-bold">{stats?.tempoMedioResolucao?.toFixed(1) || 0}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Total de Serviços</div>
              <div className="text-2xl font-bold">{Object.keys(stats?.totalPorClassificacao || {}).length}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Total de Distritos</div>
              <div className="text-2xl font-bold">{Object.keys(stats?.totalPorDistrito || {}).length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <RankingFilters onFilterChange={generateUpdatedCharts} />
      
      {loading ? (
        <div className="grid place-items-center h-40">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-gray-500">Carregando dados...</p>
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhum dado disponível</h3>
            <p className="text-gray-500">
              Carregue uma planilha com dados de ordens de serviço para visualizar os gráficos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {chartData.map(chart => (
            <div key={chart.id} className={`chart-card ${chart.visible ? '' : 'hidden'}`}>
              <ChartCard chart={chart} onToggleVisibility={() => toggleChartVisibility(chart.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RankingDashboard;
