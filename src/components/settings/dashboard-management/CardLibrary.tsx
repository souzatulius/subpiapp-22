
import React, { useState, useEffect } from 'react';
import { useCardLibrary } from '@/hooks/dashboard-management/useCardLibrary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionCardItem } from '@/types/dashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Copy, Filter } from 'lucide-react';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import { getColorClass } from '@/components/dashboard/card-customization/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface CardLibraryProps {
  onAddCard: (card: ActionCardItem) => void;
  selectedDepartment: string;
  selectedDashboardType: 'dashboard' | 'communication';
}

interface Department {
  id: string;
  descricao: string;
  sigla?: string;
}

const CardLibrary: React.FC<CardLibraryProps> = ({ 
  onAddCard, 
  selectedDepartment, 
  selectedDashboardType 
}) => {
  const { 
    cards, 
    loading, 
    searchQuery, 
    setSearchQuery, 
    filters, 
    setFilters,
    createCardFromTemplate, 
    createBlankCard 
  } = useCardLibrary(onAddCard);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Load departments for the filter
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('id, descricao, sigla')
          .order('descricao');
          
        if (error) throw error;
        setDepartments(data || []);
      } catch (error) {
        console.error('Error loading departments:', error);
      }
    };
    
    fetchDepartments();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };
  
  // Add a new blank card
  const handleAddNewCard = () => {
    const newCard = createBlankCard();
    onAddCard(newCard);
  };
  
  // Add a card from template
  const handleAddCardFromTemplate = (templateCard: ActionCardItem) => {
    const newCard = createCardFromTemplate(templateCard);
    onAddCard(newCard);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Biblioteca de Cards</span>
          <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-1" />
            Filtros
          </Button>
        </CardTitle>
        
        <div className="flex mb-2 gap-2 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar cards..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleAddNewCard}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 gap-3 mt-3 p-3 bg-gray-50 rounded-md">
            <div>
              <Label htmlFor="filter-type">Tipo</Label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="Tipo de card" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="standard">Padrão</SelectItem>
                  <SelectItem value="data_dynamic">Com dados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filter-tag">Tag</Label>
              <Select 
                value={filters.tag} 
                onValueChange={(value) => handleFilterChange('tag', value)}
              >
                <SelectTrigger id="filter-tag">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as tags</SelectItem>
                  <SelectItem value="quickDemand">Demanda rápida</SelectItem>
                  <SelectItem value="search">Busca</SelectItem>
                  <SelectItem value="overdueDemands">Demandas atrasadas</SelectItem>
                  <SelectItem value="pendingActions">Ações pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filter-dashboard">Dashboard</Label>
              <Select 
                value={filters.dashboard} 
                onValueChange={(value) => handleFilterChange('dashboard', value)}
              >
                <SelectTrigger id="filter-dashboard">
                  <SelectValue placeholder="Tipo de dashboard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="dashboard">Dashboard principal</SelectItem>
                  <SelectItem value="communication">Comunicação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filter-department">Coordenação</Label>
              <Select 
                value={filters.department} 
                onValueChange={(value) => handleFilterChange('department', value)}
              >
                <SelectTrigger id="filter-department">
                  <SelectValue placeholder="Coordenação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as coordenações</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.sigla || dept.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="max-h-[500px] overflow-y-auto pt-1">
        {loading ? (
          // Show loading skeletons
          Array(5).fill(0).map((_, i) => (
            <div key={`skeleton-${i}`} className="flex items-center gap-3 mb-3">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))
        ) : cards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum card encontrado.</p>
            <Button className="mt-2" variant="outline" size="sm" onClick={handleAddNewCard}>
              <Plus className="h-4 w-4 mr-1" />
              Criar novo
            </Button>
          </div>
        ) : (
          cards.map((card) => {
            const IconComponent = getIconComponentFromId(card.iconId);
            
            return (
              <div 
                key={card.id}
                className="flex justify-between items-center p-2 rounded-md mb-3 border hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-md flex items-center justify-center ${getColorClass(card.color)}`}>
                    {IconComponent && <IconComponent className="h-6 w-6" />}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{card.title}</div>
                    <div className="flex mt-1 gap-2">
                      <Badge variant="outline" className="text-xs py-0">
                        {card.type === 'standard' ? 'Padrão' : 'Dados'}
                      </Badge>
                      {card.isQuickDemand && (
                        <Badge variant="outline" className="text-xs py-0 bg-amber-50">
                          Demanda rápida
                        </Badge>
                      )}
                      {card.isSearch && (
                        <Badge variant="outline" className="text-xs py-0 bg-blue-50">
                          Busca
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleAddCardFromTemplate(card)}
                  title="Adicionar ao dashboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default CardLibrary;
