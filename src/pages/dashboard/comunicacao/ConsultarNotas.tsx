
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Download, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface NotaOficial {
  id: string;
  titulo: string;
  texto: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
  autor: {
    nome_completo: string;
  };
  areas_coordenacao: {
    nome: string;
  };
}

const ConsultarNotas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notas, setNotas] = useState<NotaOficial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchNotas = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('notas_oficiais')
          .select(`
            *,
            autor:autor_id(nome_completo),
            areas_coordenacao:area_coordenacao_id(nome)
          `)
          .order('criado_em', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Transform the data to match the NotaOficial interface
          const transformedData: NotaOficial[] = data.map(item => ({
            id: item.id,
            titulo: item.titulo,
            texto: item.texto,
            status: item.status,
            criado_em: item.criado_em,
            atualizado_em: item.atualizado_em,
            autor: {
              nome_completo: item.autor?.nome_completo || 'Não informado'
            },
            areas_coordenacao: {
              nome: item.areas_coordenacao?.nome || 'Não informada'
            }
          }));
          
          setNotas(transformedData);
        }
      } catch (error) {
        console.error('Erro ao buscar notas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotas();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('notas-table');
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("notas-oficiais.pdf");
  };

  // Apply filters
  const filteredNotas = notas.filter(nota => {
    // Filter by search query (title or text)
    const matchesSearch = searchQuery === '' || 
      nota.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nota.texto.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === '' || nota.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultar Notas Oficiais</h1>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Buscar por título ou conteúdo..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-500" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os status</SelectItem>
                        <SelectItem value="rascunho">Rascunho</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="publicado">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" onClick={handleExportPDF}>
                    <Download size={18} className="mr-2" />
                    Exportar PDF
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border rounded-md p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-1" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto" id="notas-table">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredNotas.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            Nenhuma nota encontrada.
                          </td>
                        </tr>
                      ) : (
                        filteredNotas.map((nota) => (
                          <tr key={nota.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{nota.titulo}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{nota.autor.nome_completo}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{nota.areas_coordenacao.nome}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${nota.status === 'aprovado' ? 'bg-green-100 text-green-800' : ''}
                                ${nota.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${nota.status === 'rascunho' ? 'bg-gray-100 text-gray-800' : ''}
                                ${nota.status === 'publicado' ? 'bg-blue-100 text-blue-800' : ''}
                              `}>
                                {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(nota.criado_em)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConsultarNotas;
