
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterX, Filter } from 'lucide-react';
import { ChartFilters } from './types';
import { supabase } from '@/integrations/supabase/client';

interface RankingFiltersProps {
  onFilterChange: (filters: ChartFilters) => void;
  initialFilters?: ChartFilters;
}

const RankingFilters: React.FC<RankingFiltersProps> = ({ 
  onFilterChange,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<ChartFilters>(initialFilters);
  const [distritos, setDistritos] = useState<string[]>([]);
  const [bairros, setBairros] = useState<string[]>([]);
  const [classificacoes, setClassificacoes] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  
  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch unique districts
        const { data: distritosData } = await supabase
          .from('ordens_servico')
          .select('distrito')
          .not('distrito', 'is', null)
          .order('distrito');
          
        if (distritosData) {
          const uniqueDistritos = [...new Set(distritosData.map(d => d.distrito))];
          setDistritos(uniqueDistritos.filter(Boolean) as string[]);
        }
        
        // Fetch unique neighborhoods
        const { data: bairrosData } = await supabase
          .from('ordens_servico')
          .select('bairro')
          .not('bairro', 'is', null)
          .order('bairro');
          
        if (bairrosData) {
          const uniqueBairros = [...new Set(bairrosData.map(b => b.bairro))];
          setBairros(uniqueBairros.filter(Boolean) as string[]);
        }
        
        // Fetch unique classifications
        const { data: classificacoesData } = await supabase
          .from('ordens_servico')
          .select('classificacao')
          .not('classificacao', 'is', null)
          .order('classificacao');
          
        if (classificacoesData) {
          const uniqueClassificacoes = [...new Set(classificacoesData.map(c => c.classificacao))];
          setClassificacoes(uniqueClassificacoes.filter(Boolean) as string[]);
        }
        
        // Fetch unique statuses
        const { data: statusData } = await supabase
          .from('ordens_servico')
          .select('status')
          .not('status', 'is', null)
          .order('status');
          
        if (statusData) {
          const uniqueStatus = [...new Set(statusData.map(s => s.status))];
          setStatusOptions(uniqueStatus.filter(Boolean) as string[]);
        }
      } catch (error) {
        console.error('Erro ao carregar opções de filtro:', error);
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (key: keyof ChartFilters, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({});
    onFilterChange({});
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange(filters);
  };
  
  // Handle filter distrito change based on bairro selection
  useEffect(() => {
    if (filters.bairro) {
      // Fetch the district for this neighborhood
      const fetchDistritoForBairro = async () => {
        const { data } = await supabase
          .from('ordens_servico')
          .select('distrito')
          .eq('bairro', filters.bairro)
          .not('distrito', 'is', null)
          .limit(1);
          
        if (data && data.length > 0 && data[0].distrito) {
          handleFilterChange('distrito', data[0].distrito);
        }
      };
      
      fetchDistritoForBairro();
    }
  }, [filters.bairro]);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* District filter */}
          <div className="space-y-2">
            <Label htmlFor="distrito">Distrito</Label>
            <Select
              value={filters.distrito || ""}
              onValueChange={(value) => handleFilterChange('distrito', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os distritos</SelectItem>
                {distritos.map((distrito) => (
                  <SelectItem key={distrito} value={distrito}>
                    {distrito}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Neighborhood filter */}
          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Select
              value={filters.bairro || ""}
              onValueChange={(value) => handleFilterChange('bairro', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os bairros</SelectItem>
                {bairros.map((bairro) => (
                  <SelectItem key={bairro} value={bairro}>
                    {bairro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Classification filter */}
          <div className="space-y-2">
            <Label htmlFor="classificacao">Classificação</Label>
            <Select
              value={filters.classificacao || ""}
              onValueChange={(value) => handleFilterChange('classificacao', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma classificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as classificações</SelectItem>
                {classificacoes.map((classificacao) => (
                  <SelectItem key={classificacao} value={classificacao}>
                    {classificacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Status filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => handleFilterChange('status', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date range filters */}
          <div className="space-y-2">
            <Label htmlFor="dataDe">Data inicial</Label>
            <Input
              id="dataDe"
              type="date"
              value={filters.dataDe || ""}
              onChange={(e) => handleFilterChange('dataDe', e.target.value || null)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataAte">Data final</Label>
            <Input
              id="dataAte"
              type="date"
              value={filters.dataAte || ""}
              onChange={(e) => handleFilterChange('dataAte', e.target.value || null)}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
          >
            <FilterX className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
          <Button 
            onClick={handleApplyFilters}
          >
            <Filter className="mr-2 h-4 w-4" />
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingFilters;
