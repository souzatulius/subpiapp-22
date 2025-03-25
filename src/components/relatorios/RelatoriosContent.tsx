import React, { useState, useEffect } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useAdvancedFilters } from './hooks/useAdvancedFilters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export const RelatoriosContent = () => {
  const { toast } = useToast()
  const { filters, selectedFilters, handleFilterChange, clearFilter, clearAllFilters } = useAdvancedFilters();
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const handleDateChange = (dateRange: any) => {
    handleFilterChange('dateRange', dateRange);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
        <p className="text-gray-500">Visualize e filtre os dados para obter insights.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div>
          <Label htmlFor="distrito">Distrito</Label>
          <select
            id="distrito"
            className="w-full p-2 border rounded"
            value={filters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="itaim-bibi">Itaim Bibi</option>
            <option value="pinheiros">Pinheiros</option>
            <option value="jardim-paulista">Jardim Paulista</option>
            <option value="alto-de-pinheiros">Alto de Pinheiros</option>
          </select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="w-full p-2 border rounded"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="em-andamento">Em andamento</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>

        <div>
          <Label htmlFor="origem">Origem</Label>
          <select
            id="origem"
            className="w-full p-2 border rounded"
            value={filters.origin}
            onChange={(e) => handleFilterChange('origin', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="imprensa">Imprensa</option>
            <option value="vereadores">Vereadores</option>
            <option value="politicos">Políticos</option>
            <option value="interno">Demandas Internas</option>
            <option value="secom">SECOM</option>
          </select>
        </div>

        <div>
          <Label>Período</Label>
          <DateRangePicker dateRange={filters.dateRange || { from: new Date(), to: new Date() }} onRangeChange={handleDateChange} className="w-full" align="start" />
        </div>
      </div>

      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedFilters.map(filter => (
            <Badge key={filter.key} variant="secondary">
              {filter.label}: {filter.value}
              <Button variant="ghost" size="sm" onClick={() => clearFilter(filter.key)}>
                <span className="sr-only">Clear filter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </Button>
            </Badge>
          ))}
          <Button variant="link" size="sm" onClick={clearAllFilters}>
            Limpar todos os filtros
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead>Distrito</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Origem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">01/01/2024</TableCell>
              <TableCell>Itaim Bibi</TableCell>
              <TableCell>Pendente</TableCell>
              <TableCell>Imprensa</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">02/01/2024</TableCell>
              <TableCell>Pinheiros</TableCell>
              <TableCell>Em andamento</TableCell>
              <TableCell>Vereadores</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">03/01/2024</TableCell>
              <TableCell>Jardim Paulista</TableCell>
              <TableCell>Concluído</TableCell>
              <TableCell>Políticos</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
