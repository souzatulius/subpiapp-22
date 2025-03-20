
import React, { useState } from 'react';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, FileText, Download, Eye } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ConsultarNotas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Simulação de dados para exemplificar
  const notasOficiais = [
    { 
      id: 1, 
      titulo: "Nota sobre pavimentação da Zona Norte", 
      data: "20/10/2023", 
      autor: "João Silva", 
      status: "Aprovada"
    },
    { 
      id: 2, 
      titulo: "Nota sobre revitalização do centro histórico", 
      data: "15/10/2023", 
      autor: "Maria Oliveira", 
      status: "Pendente" 
    },
    { 
      id: 3, 
      titulo: "Nota sobre ampliação dos serviços de saúde", 
      data: "10/10/2023", 
      autor: "Carlos Mendes", 
      status: "Aprovada" 
    },
    { 
      id: 4, 
      titulo: "Nota sobre inauguração da nova biblioteca municipal", 
      data: "05/10/2023", 
      autor: "Ana Carolina", 
      status: "Aprovada" 
    },
    { 
      id: 5, 
      titulo: "Nota sobre ações ambientais no município", 
      data: "01/10/2023", 
      autor: "Paulo Roberto", 
      status: "Pendente" 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultar Notas Oficiais</h1>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Lista de Notas Oficiais</CardTitle>
              </CardHeader>
              <CardContent>
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
                  <Button variant="outline" className="md:w-auto flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notasOficiais.map((nota) => (
                        <TableRow key={nota.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              {nota.titulo}
                            </div>
                          </TableCell>
                          <TableCell>{nota.data}</TableCell>
                          <TableCell>{nota.autor}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={nota.status === "Aprovada" ? "outline" : "outline"}
                              className={
                                nota.status === "Aprovada" 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              }
                            >
                              {nota.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Visualizar</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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
