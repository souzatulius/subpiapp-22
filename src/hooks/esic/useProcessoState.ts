
import { useState } from 'react';
import { ESICProcesso } from '@/types/esic';

interface FilterOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  coordenacao?: string;
  dataInicio?: string;
  dataFim?: string;
}

export const useProcessoState = () => {
  const [processos, setProcessos] = useState<ESICProcesso[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedProcesso, setSelectedProcesso] = useState<ESICProcesso | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    status: '',
    coordenacao: '',
    dataInicio: '',
    dataFim: '',
  });

  return {
    processos,
    setProcessos,
    total,
    setTotal,
    selectedProcesso,
    setSelectedProcesso,
    filterOptions,
    setFilterOptions
  };
};
