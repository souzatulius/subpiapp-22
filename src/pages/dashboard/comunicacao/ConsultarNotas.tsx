
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, FileText, Download, Eye, Printer } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NotaOficial } from '@/components/dashboard/forms/types';

const ConsultarNotas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [notasOficiais, setNotasOficiais] = useState<NotaOficial[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchNotas();
  }, [filterStatus]);

  const fetchNotas = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('notas_oficiais')
        .select(`
          *,
          autor:autor_id(nome_completo),
          areas_coordenacao:area_coordenacao_id(descricao)
        `)
        .order('criado_em', { ascending: false });
      
      if (filterStatus !== 'todos') {
        query = query.eq('status', filterStatus);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Transform the data to match the NotaOficial interface
      const transformedData: NotaOficial[] = data?.map(item => ({
        id: item.id,
        titulo: item.titulo,
        texto: item.texto,
        status: item.status,
        criado_em: item.criado_em,
        autor_id: item.autor_id,
        aprovador_id: item.aprovador_id,
        area_coordenacao_id: item.area_coordenacao_id,
        demanda_id: item.demanda_id,
        autor: item.autor && typeof item.autor === 'object' ? 
          { nome_completo: item.autor.nome_completo || 'Não informado' } : 
          { nome_completo: 'Não informado' },
        areas_coordenacao: item.areas_coordenacao && typeof item.areas_coordenacao === 'object' ? 
          { descricao: item.areas_coordenacao.descricao || 'Não informada' } : 
          { descricao: 'Não informada' }
      })) || [];
      
      setNotasOficiais(transformedData);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      toast({
        title: "Erro ao carregar notas",
        description: "Não foi possível buscar as notas oficiais. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewNote = (nota: NotaOficial) => {
    // Implementar visualização detalhada da nota
    // Por enquanto, apenas exibe um alerta
    alert(`Visualizando nota: ${nota.titulo}`);
  };

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Gerando PDF",
        description: "Aguarde enquanto preparamos seu documento...",
      });

      const tableSection = document.querySelector('.notas-table') as HTMLElement;
      if (!tableSection) {
        throw new Error("Não foi possível encontrar a tabela de notas");
      }

      const canvas = await html2canvas(tableSection);
      const imgData = canvas.toDataURL('image/png');
      
      // Cria um novo documento PDF
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Adiciona título
      pdf.setFontSize(16);
      pdf.text('Relatório de Notas Oficiais', pdfWidth / 2, 15, { align: 'center' });
      
      // Adiciona data
      pdf.setFontSize(10);
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pdfWidth / 2, 22, { align: 'center' });
      
      // Adiciona imagem da tabela
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 10, 25, imgWidth, imgHeight);
      
      // Salva o PDF
      pdf.save('notas-oficiais-relatorio.pdf');
      
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

  const filteredNotas = notasOficiais.filter(nota => 
    nota.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (nota.autor?.nome_completo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (nota.areas_coordenacao?.descricao || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'aprovado':
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case 'pendente':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case 'rejeitado':
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultar Notas Oficiais</h1>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Buscar notas oficiais..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os status</SelectItem>
                        <SelectItem value="aprovado">Aprovadas</SelectItem>
                        <SelectItem value="pendente">Pendentes</SelectItem>
                        <SelectItem value="rejeitado">Rejeitadas</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExportPDF} title="Exportar PDF">
                      <Download className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">PDF</span>
                    </Button>
                    <Button variant="outline" onClick={handlePrint} title="Imprimir">
                      <Printer className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Imprimir</span>
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border overflow-hidden notas-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Área</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex justify-center items-center">
                              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                              Carregando notas oficiais...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredNotas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-gray-500">Nenhuma nota oficial encontrada.</p>
                            <Button 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => navigate('/dashboard/comunicacao/criar-nota-oficial')}
                            >
                              Criar nova nota
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNotas.map((nota) => (
                          <TableRow key={nota.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                {nota.titulo}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(nota.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>{nota.autor?.nome_completo || 'Não informado'}</TableCell>
                            <TableCell>{nota.areas_coordenacao?.descricao || 'Não informada'}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={getStatusBadgeStyles(nota.status)}
                              >
                                {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleViewNote(nota)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Visualizar</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={handleExportPDF}
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConsultarNotas;
