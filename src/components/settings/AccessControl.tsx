
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAccessControl } from './access-control/useAccessControl'; 
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const AccessControl: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    coordenacoes,
    permissions,
    coordinationPermissions,
    loading,
    saving,
    handleAddPermission,
    handleRemovePermission
  } = useAccessControl();
  
  // Filtra coordenações com base no termo de busca
  const filteredCoordenacoes = coordenacoes.filter(coordenacao => 
    coordenacao.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Carregando controle de acesso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Controle de Acesso</h1>
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar coordenação..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Coordenação</TableHead>
                  <TableHead>Permissões</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoordenacoes.map(coordenacao => (
                  <TableRow key={coordenacao.id}>
                    <TableCell className="font-medium">{coordenacao.descricao}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {permissions.map(permission => {
                          const hasPermission = coordinationPermissions[coordenacao.id]?.includes(permission.id);
                          
                          return (
                            <Button
                              key={permission.id}
                              size="sm"
                              variant={hasPermission ? "default" : "outline"}
                              className={`text-xs py-1 h-7 ${saving ? 'opacity-50' : ''}`}
                              onClick={() => {
                                if (hasPermission) {
                                  handleRemovePermission(coordenacao.id, permission.id);
                                } else {
                                  handleAddPermission(coordenacao.id, permission.id);
                                }
                              }}
                              disabled={saving}
                            >
                              {permission.name}
                            </Button>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCoordenacoes.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Nenhuma coordenação encontrada.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessControl;
