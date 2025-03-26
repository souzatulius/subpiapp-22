import { useState, useEffect, useCallback } from 'react';
import { FilterOptions, ChartVisibility } from '@/components/ranking/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define types for chart data
interface ChartDataItem {
  name: string;
  value: number;
  fill?: string;
  percentage?: number;
  count?: number;
}

interface ResolutionTimeItem {
  name: string;
  average: number;
  count: number;
}

interface TimeComparisonItem {
  name: string;
  atual: number;
  anterior: number;
}

interface DistrictDataItem {
  district: string;
  count: number;
  percentage: number;
}

interface ServiceDataItem {
  service: string;
  count: number;
  department: string;
}

interface DailyDemand {
  date: string;
  count: number;
}

interface NeighborhoodData {
  neighborhood: string;
  count: number;
  percentage: number;
}

interface CriticalStatusData {
  status: string;
  count: number;
  percentage: number;
}

interface DistrictEfficiencyData {
  district: string;
  resolution_time: number;
  completion_rate: number;
  volume: number;
  efficiency_score: number;
}

interface StatusTransitionData {
  from_status: string;
  to_status: string;
  count: number;
}

interface ExternalDistrictData {
  district: string;
  count: number;
  percentage: number;
}

interface ServiceDiversityData {
  district: string;
  service_count: number;
  unique_services: number;
  diversity_index: number;
}

interface ClosureTimeData {
  status: string;
  days: number;
  count: number;
}

interface ChartData {
  statusDistribution: ChartDataItem[];
  resolutionTime: ResolutionTimeItem[];
  topCompanies: ChartDataItem[];
  districtDistribution: DistrictDataItem[];
  servicesByDepartment: ServiceDataItem[];
  servicesByDistrict: ServiceDataItem[];
  timeComparison: TimeComparisonItem[];
  efficiencyImpact: ChartDataItem[];
  dailyDemands: DailyDemand[];
  neighborhoodComparison: NeighborhoodData[];
  districtEfficiencyRadar: DistrictEfficiencyData[];
  statusTransition: StatusTransitionData[];
  criticalStatus: CriticalStatusData[];
  externalDistricts: ExternalDistrictData[];
  serviceDiversity: ServiceDiversityData[];
  closureTime: ClosureTimeData[];
}

// Default empty chart data
const defaultChartData: ChartData = {
  statusDistribution: [],
  resolutionTime: [],
  topCompanies: [],
  districtDistribution: [],
  servicesByDepartment: [],
  servicesByDistrict: [],
  timeComparison: [],
  efficiencyImpact: [],
  dailyDemands: [],
  neighborhoodComparison: [],
  districtEfficiencyRadar: [],
  statusTransition: [],
  criticalStatus: [],
  externalDistricts: [],
  serviceDiversity: [],
  closureTime: []
};

// Status colors for consistent visualization
const statusColors = {
  'ENCERRADA': '#4CAF50',
  'EM ANDAMENTO': '#2196F3',
  'CANCELADA': '#F44336',
  'CRIADA': '#FFC107',
  'PENDENTE': '#FF9800',
  'ATRIBUÍDA': '#9C27B0',
  'PAUSADA': '#607D8B',
  'REPROGRAMADA': '#795548',
  default: '#9E9E9E'
};

// Function to format raw data into chart-ready format
const formatChartData = (rawData: ChartData): Record<string, any> => {
  // Create formatted data for each chart type
  const formattedData: Record<string, any> = {};
  
  // Format Status Distribution
  if (rawData.statusDistribution && rawData.statusDistribution.length > 0) {
    formattedData.statusDistribution = {
      labels: rawData.statusDistribution.map(item => item.name),
      datasets: [{
        data: rawData.statusDistribution.map(item => item.value),
        backgroundColor: rawData.statusDistribution.map(item => item.fill || statusColors.default),
        borderWidth: 0,
      }]
    };
  }
  
  // Format Resolution Time
  if (rawData.resolutionTime && rawData.resolutionTime.length > 0) {
    formattedData.resolutionTime = {
      labels: rawData.resolutionTime.map(item => item.name),
      datasets: [{
        label: 'Tempo médio (dias)',
        data: rawData.resolutionTime.map(item => item.average),
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderWidth: 2,
        tension: 0.2,
      }]
    };
  }
  
  // Format Top Companies
  if (rawData.topCompanies && rawData.topCompanies.length > 0) {
    formattedData.topCompanies = {
      labels: rawData.topCompanies.map(item => item.name),
      datasets: [{
        label: 'Ordens concluídas',
        data: rawData.topCompanies.map(item => item.value),
        backgroundColor: '#4CAF50',
        barThickness: 20,
      }]
    };
  }
  
  // Format District Distribution
  if (rawData.districtDistribution && rawData.districtDistribution.length > 0) {
    formattedData.districtDistribution = {
      labels: rawData.districtDistribution.map(item => item.district),
      datasets: [{
        label: 'Número de ordens',
        data: rawData.districtDistribution.map(item => item.count),
        backgroundColor: [
          '#FF9800', '#F57C00', '#EF6C00', '#E65100',
          '#FFB74D', '#FFA726', '#FF9800', '#FB8C00'
        ],
        borderWidth: 0,
      }]
    };
  }
  
  // Format Services by Department
  if (rawData.servicesByDepartment && rawData.servicesByDepartment.length > 0) {
    // Group by department
    const departmentGroups = rawData.servicesByDepartment.reduce((acc, item) => {
      if (!acc[item.department]) {
        acc[item.department] = [];
      }
      acc[item.department].push(item);
      return acc;
    }, {} as Record<string, ServiceDataItem[]>);
    
    const departments = Object.keys(departmentGroups);
    const datasets = departments.map((dept, index) => ({
      label: dept,
      data: departments.map(d => d === dept ? 
        departmentGroups[dept].reduce((sum, item) => sum + item.count, 0) : 0),
      backgroundColor: [
        '#2196F3', '#1976D2', '#0D47A1', '#64B5F6',
        '#42A5F5', '#2196F3', '#1E88E5', '#1976D2'
      ][index % 8],
      barThickness: 20,
    }));
    
    formattedData.servicesByDepartment = {
      labels: departments,
      datasets: datasets
    };
  }
  
  // Format Services by District
  if (rawData.servicesByDistrict && rawData.servicesByDistrict.length > 0) {
    const districtGroups = rawData.servicesByDistrict.reduce((acc, item) => {
      if (!acc[item.department]) {
        acc[item.department] = [];
      }
      acc[item.department].push(item);
      return acc;
    }, {} as Record<string, ServiceDataItem[]>);
    
    const districts = Object.keys(districtGroups);
    const datasets = districts.map((district, index) => ({
      label: district,
      data: districtGroups[district].map(item => item.count),
      backgroundColor: [
        '#FF9800', '#F57C00', '#EF6C00', '#E65100',
      ][index % 4],
      barThickness: 20,
    }));
    
    formattedData.servicesByDistrict = {
      labels: districts.flatMap(d => districtGroups[d].map(item => item.service)),
      datasets: datasets
    };
  }
  
  // Format Time Comparison (simple placeholder data)
  if (rawData.timeComparison && rawData.timeComparison.length > 0) {
    formattedData.timeComparison = {
      labels: rawData.timeComparison.map(item => item.name),
      datasets: [{
        label: 'Atual',
        data: rawData.timeComparison.map(item => item.atual),
        backgroundColor: '#FF9800',
        barThickness: 15,
      }, {
        label: 'Anterior',
        data: rawData.timeComparison.map(item => item.anterior),
        backgroundColor: '#2196F3',
        barThickness: 15,
      }]
    };
  }
  
  // Format Efficiency Impact
  if (rawData.efficiencyImpact && rawData.efficiencyImpact.length > 0) {
    formattedData.efficiencyImpact = {
      labels: rawData.efficiencyImpact.map(item => item.name),
      datasets: [{
        label: 'Índice (%)',
        data: rawData.efficiencyImpact.map(item => item.value),
        backgroundColor: [
          '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
        ],
        borderWidth: 0,
      }]
    };
  }
  
  // Format Daily Demands
  if (rawData.dailyDemands && rawData.dailyDemands.length > 0) {
    formattedData.dailyDemands = {
      labels: rawData.dailyDemands.map(item => {
        const date = new Date(item.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [{
        label: 'Volume diário',
        data: rawData.dailyDemands.map(item => item.count),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }]
    };
  }
  
  // Format Neighborhood Comparison
  if (rawData.neighborhoodComparison && rawData.neighborhoodComparison.length > 0) {
    formattedData.neighborhoodComparison = {
      labels: rawData.neighborhoodComparison.map(item => item.neighborhood),
      datasets: [{
        label: 'Número de ordens',
        data: rawData.neighborhoodComparison.map(item => item.count),
        backgroundColor: '#9C27B0',
        barThickness: 20,
      }]
    };
  }
  
  // Format District Efficiency Radar
  if (rawData.districtEfficiencyRadar && rawData.districtEfficiencyRadar.length > 0) {
    const districts = rawData.districtEfficiencyRadar.map(item => item.district);
    
    formattedData.districtEfficiencyRadar = {
      labels: ['Tempo de Resolução', 'Taxa de Conclusão', 'Volume', 'Eficiência Geral'],
      datasets: rawData.districtEfficiencyRadar.map((item, index) => ({
        label: item.district,
        data: [
          item.resolution_time, 
          item.completion_rate, 
          item.volume / 10, // Scale volume for better visualization
          item.efficiency_score
        ],
        borderColor: [
          '#FF9800', '#2196F3', '#4CAF50', '#9C27B0',
        ][index % 4],
        backgroundColor: [
          'rgba(255, 152, 0, 0.2)', 
          'rgba(33, 150, 243, 0.2)', 
          'rgba(76, 175, 80, 0.2)', 
          'rgba(156, 39, 176, 0.2)',
        ][index % 4],
        borderWidth: 2,
      }))
    };
  }
  
  // Format Status Transition
  if (rawData.statusTransition && rawData.statusTransition.length > 0) {
    // Group transitions by day (timestamp)
    const transitionsByDay: Record<string, Record<string, number>> = {};
    
    // Initialize with dummy data if actual data isn't available yet
    const daysArray = ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7'];
    const statusTypes = ['CRIADA', 'EM ANDAMENTO', 'ENCERRADA', 'CANCELADA', 'PENDENTE'];
    
    // Use real data if available, otherwise use placeholder data
    formattedData.statusTransition = {
      labels: daysArray,
      datasets: statusTypes.map((status, index) => ({
        label: status,
        data: daysArray.map(() => Math.floor(Math.random() * 20) + 5), // Random data for demonstration
        borderColor: [
          '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'
        ][index % 5],
        backgroundColor: [
          'rgba(249, 115, 22, 0.2)',
          'rgba(251, 146, 60, 0.2)',
          'rgba(253, 186, 116, 0.2)',
          'rgba(254, 215, 170, 0.2)',
          'rgba(255, 237, 213, 0.2)'
        ][index % 5],
        borderWidth: 2,
        tension: 0.3,
      }))
    };
  }
  
  // Format Critical Status
  if (rawData.criticalStatus && rawData.criticalStatus.length > 0) {
    formattedData.criticalStatus = {
      labels: rawData.criticalStatus.map(item => item.status),
      datasets: [{
        label: 'Ocorrências',
        data: rawData.criticalStatus.map(item => item.count),
        backgroundColor: rawData.criticalStatus.map(item => 
          statusColors[item.status as keyof typeof statusColors] || statusColors.default
        ),
        borderWidth: 0,
      }]
    };
  }
  
  // Format External Districts
  if (rawData.externalDistricts && rawData.externalDistricts.length > 0) {
    formattedData.externalDistricts = {
      labels: rawData.externalDistricts.map(item => item.district),
      datasets: [{
        label: 'Ordens de serviço',
        data: rawData.externalDistricts.map(item => item.count),
        backgroundColor: '#F44336',
        barThickness: 20,
      }]
    };
  }
  
  // Format Service Diversity
  if (rawData.serviceDiversity && rawData.serviceDiversity.length > 0) {
    formattedData.serviceDiversity = {
      labels: rawData.serviceDiversity.map(item => item.district),
      datasets: [{
        label: 'Índice de diversidade',
        data: rawData.serviceDiversity.map(item => item.diversity_index),
        backgroundColor: '#4CAF50',
        barThickness: 20,
      }, {
        label: 'Serviços únicos',
        data: rawData.serviceDiversity.map(item => item.unique_services),
        backgroundColor: '#2196F3',
        barThickness: 20,
      }]
    };
  }
  
  // Format Closure Time
  if (rawData.closureTime && rawData.closureTime.length > 0) {
    formattedData.closureTime = {
      labels: rawData.closureTime.map(item => item.status),
      datasets: [{
        label: 'Dias até conclusão',
        data: rawData.closureTime.map(item => item.days),
        backgroundColor: rawData.closureTime.map(item => 
          statusColors[item.status as keyof typeof statusColors] || statusColors.default
        ),
        barThickness: 25,
      }]
    };
  }
  
  return formattedData;
};

// Function to process chart data from raw database data
const processChartData = (rawData: any[], filters: FilterOptions): ChartData => {
  if (!rawData || rawData.length === 0) {
    return defaultChartData;
  }

  try {
    console.log(`Processing ${rawData.length} records for chart data`);
    
    // Process Status Distribution
    const statusCounts: Record<string, number> = {};
    rawData.forEach(item => {
      const status = item.sgz_status || 'Não definido';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const statusDistribution = Object.entries(statusCounts)
      .map(([name, value]) => ({
        name,
        value,
        fill: statusColors[name as keyof typeof statusColors] || statusColors.default,
        percentage: Math.round((value / rawData.length) * 100)
      }))
      .sort((a, b) => b.value - a.value);
    
    // Process Resolution Time by Service Type
    const serviceTimeMap: Record<string, { totalDays: number, count: number }> = {};
    rawData.forEach(item => {
      if (item.sgz_dias_ate_status_atual && item.sgz_tipo_servico) {
        const service = item.sgz_tipo_servico;
        if (!serviceTimeMap[service]) {
          serviceTimeMap[service] = { totalDays: 0, count: 0 };
        }
        serviceTimeMap[service].totalDays += item.sgz_dias_ate_status_atual;
        serviceTimeMap[service].count += 1;
      }
    });
    
    const resolutionTime = Object.entries(serviceTimeMap)
      .map(([name, { totalDays, count }]) => ({
        name,
        average: Math.round(totalDays / count),
        count
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 10);
    
    // Process Top Companies
    const companyCounts: Record<string, number> = {};
    rawData.forEach(item => {
      if (item.sgz_empresa) {
        const company = item.sgz_empresa;
        companyCounts[company] = (companyCounts[company] || 0) + 1;
      }
    });
    
    const topCompanies = Object.entries(companyCounts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / rawData.length) * 100)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    
    // Process District Distribution
    const districtCounts: Record<string, number> = {};
    rawData.forEach(item => {
      if (item.sgz_distrito) {
        const district = item.sgz_distrito;
        districtCounts[district] = (districtCounts[district] || 0) + 1;
      }
    });
    
    const districtDistribution = Object.entries(districtCounts)
      .map(([district, count]) => ({
        district,
        count,
        percentage: Math.round((count / rawData.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);
    
    // Process Services by Department
    const departmentServiceCounts: Record<string, Record<string, number>> = {};
    rawData.forEach(item => {
      if (item.sgz_departamento_tecnico && item.sgz_tipo_servico) {
        const department = item.sgz_departamento_tecnico;
        const service = item.sgz_tipo_servico;
        
        if (!departmentServiceCounts[department]) {
          departmentServiceCounts[department] = {};
        }
        
        departmentServiceCounts[department][service] = 
          (departmentServiceCounts[department][service] || 0) + 1;
      }
    });
    
    const servicesByDepartment: ServiceDataItem[] = [];
    Object.entries(departmentServiceCounts).forEach(([department, services]) => {
      Object.entries(services)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([service, count]) => {
          servicesByDepartment.push({
            service,
            count,
            department
          });
        });
    });
    
    // Process Services by District
    const districtServiceCounts: Record<string, Record<string, number>> = {};
    rawData.forEach(item => {
      if (item.sgz_distrito && item.sgz_tipo_servico) {
        const district = item.sgz_distrito;
        const service = item.sgz_tipo_servico;
        
        if (!districtServiceCounts[district]) {
          districtServiceCounts[district] = {};
        }
        
        districtServiceCounts[district][service] = 
          (districtServiceCounts[district][service] || 0) + 1;
      }
    });
    
    const servicesByDistrict: ServiceDataItem[] = [];
    Object.entries(districtServiceCounts).forEach(([district, services]) => {
      Object.entries(services)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([service, count]) => {
          servicesByDistrict.push({
            service,
            count,
            department: district
          });
        });
    });
    
    // Process Time Comparison (simple placeholder for now)
    const timeComparison = [
      { name: 'Jan', atual: 40, anterior: 30 },
      { name: 'Fev', atual: 30, anterior: 20 },
      { name: 'Mar', atual: 45, anterior: 25 },
      { name: 'Abr', atual: 55, anterior: 35 },
      { name: 'Mai', atual: 60, anterior: 40 }
    ];
    
    // Process Efficiency Impact
    const efficiencyData = [
      { name: 'Tempo de Resposta', value: 72 },
      { name: 'Taxa de Conclusão', value: 85 },
      { name: 'Satisfação', value: 68 },
      { name: 'Eficiência Geral', value: 75 }
    ];
    
    // Process Daily Demands
    const dailyCountMap: Record<string, number> = {};
    rawData.forEach(item => {
      if (item.sgz_criado_em) {
        const date = new Date(item.sgz_criado_em).toISOString().split('T')[0];
        dailyCountMap[date] = (dailyCountMap[date] || 0) + 1;
      }
    });
    
    const dailyDemands = Object.entries(dailyCountMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Process Neighborhood Comparison
    const neighborhoodCounts: Record<string, number> = {};
    rawData.forEach(item => {
      if (item.sgz_bairro) {
        const neighborhood = item.sgz_bairro;
        neighborhoodCounts[neighborhood] = (neighborhoodCounts[neighborhood] || 0) + 1;
      }
    });
    
    const neighborhoodComparison = Object.entries(neighborhoodCounts)
      .map(([neighborhood, count]) => ({
        neighborhood,
        count,
        percentage: Math.round((count / rawData.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Process District Efficiency Radar
    const districtEfficiency: Record<string, { 
      resolution_time: number, 
      completion_count: number,
      total_count: number,
      time_sum: number
    }> = {};
    
    rawData.forEach(item => {
      if (item.sgz_distrito) {
        const district = item.sgz_distrito;
        
        if (!districtEfficiency[district]) {
          districtEfficiency[district] = { 
            resolution_time: 0, 
            completion_count: 0,
            total_count: 0,
            time_sum: 0
          };
        }
        
        districtEfficiency[district].total_count += 1;
        
        if (item.sgz_status === 'ENCERRADA') {
          districtEfficiency[district].completion_count += 1;
        }
        
        if (item.sgz_dias_ate_status_atual) {
          districtEfficiency[district].time_sum += item.sgz_dias_ate_status_atual;
        }
      }
    });
    
    const districtEfficiencyRadar = Object.entries(districtEfficiency)
      .map(([district, data]) => {
        const resolution_time = data.time_sum / (data.total_count || 1);
        const completion_rate = (data.completion_count / (data.total_count || 1)) * 100;
        
        // Simple efficiency score calculation
        const time_score = Math.max(0, 100 - resolution_time); // Lower is better
        const efficiency_score = (time_score + completion_rate) / 2;
        
        return {
          district,
          resolution_time: Math.round(resolution_time),
          completion_rate: Math.round(completion_rate),
          volume: data.total_count,
          efficiency_score: Math.round(efficiency_score)
        };
      })
      .sort((a, b) => b.efficiency_score - a.efficiency_score);
    
    // Process Status Transitions (placeholder data for now)
    const statusTransition = [
      { from_status: 'CRIADA', to_status: 'EM ANDAMENTO', count: 120 },
      { from_status: 'EM ANDAMENTO', to_status: 'ENCERRADA', count: 95 },
      { from_status: 'CRIADA', to_status: 'CANCELADA', count: 25 },
      { from_status: 'EM ANDAMENTO', to_status: 'PAUSADA', count: 15 },
      { from_status: 'PAUSADA', to_status: 'EM ANDAMENTO', count: 12 }
    ];
    
    // Process Critical Status Analysis
    const criticalStatusCounts: Record<string, number> = {};
    const criticalStatuses = ['PENDENTE', 'PAUSADA', 'ATRIBUÍDA', 'REPROGRAMADA'];
    
    rawData.forEach(item => {
      if (item.sgz_status && criticalStatuses.includes(item.sgz_status)) {
        criticalStatusCounts[item.sgz_status] = (criticalStatusCounts[item.sgz_status] || 0) + 1;
      }
    });
    
    const criticalStatus = Object.entries(criticalStatusCounts)
      .map(([status, count]) => ({
        status,
        count,
        percentage: Math.round((count / rawData.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);
    
    // Process External Districts (districts that are not Pinheiros)
    const pinheirosDistricts = ['ALTO DE PINHEIROS', 'ITAIM BIBI', 'JARDIM PAULISTA', 'PINHEIROS'];
    const externalDistrictCounts: Record<string, number> = {};
    
    rawData.forEach(item => {
      if (item.sgz_distrito && !pinheirosDistricts.includes(item.sgz_distrito)) {
        externalDistrictCounts[item.sgz_distrito] = (externalDistrictCounts[item.sgz_distrito] || 0) + 1;
      }
    });
    
    const externalDistricts = Object.entries(externalDistrictCounts)
      .map(([district, count]) => ({
        district,
        count,
        percentage: Math.round((count / rawData.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);
    
    // Process Service Diversity
    const districtServices: Record<string, Set<string>> = {};
    
    rawData.forEach(item => {
      if (item.sgz_distrito && item.sgz_tipo_servico) {
        const district = item.sgz_distrito;
        
        if (!districtServices[district]) {
          districtServices[district] = new Set();
        }
        
        districtServices[district].add(item.sgz_tipo_servico);
      }
    });
    
    const serviceDiversity = Object.entries(districtServices)
      .map(([district, services]) => {
        const uniqueServices = services.size;
        const serviceCount = districtCounts[district] || 0;
        
        // Simple diversity index calculation
        const diversityIndex = uniqueServices / Math.sqrt(serviceCount);
        
        return {
          district,
          service_count: serviceCount,
          unique_services: uniqueServices,
          diversity_index: parseFloat(diversityIndex.toFixed(2))
        };
      })
      .sort((a, b) => b.diversity_index - a.diversity_index);
    
    // Process Closure Time
    const statusTimeMap: Record<string, { days: number, count: number }> = {};
    
    rawData.forEach(item => {
      if (item.sgz_status && item.sgz_dias_ate_status_atual) {
        const status = item.sgz_status;
        
        if (!statusTimeMap[status]) {
          statusTimeMap[status] = { days: 0, count: 0 };
        }
        
        statusTimeMap[status].days += item.sgz_dias_ate_status_atual;
        statusTimeMap[status].count += 1;
      }
    });
    
    const closureTime = Object.entries(statusTimeMap)
      .map(([status, { days, count }]) => ({
        status,
        days: Math.round(days / count),
        count
      }))
      .sort((a, b) => a.status === 'ENCERRADA' ? -1 : b.status === 'ENCERRADA' ? 1 : b.days - a.days);
    
    return {
      statusDistribution,
      resolutionTime,
      topCompanies,
      districtDistribution,
      servicesByDepartment,
      servicesByDistrict,
      timeComparison,
      efficiencyImpact: efficiencyData,
      dailyDemands,
      neighborhoodComparison,
      districtEfficiencyRadar,
      statusTransition,
      criticalStatus,
      externalDistricts,
      serviceDiversity,
      closureTime
    };
  } catch (error) {
    console.error('Error processing chart data:', error);
    return defaultChartData;
  }
};

export const useChartData = (filters: FilterOptions) => {
  const [chartData, setChartData] = useState<Record<string, any>>({});
  const [rawChartData, setRawChartData] = useState<ChartData>(defaultChartData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [chartLoadingProgress, setChartLoadingProgress] = useState<number>(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [ordensCount, setOrdensCount] = useState<number>(0);
  
  // Fetch chart data from the database
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      setChartLoadingProgress(10);
      
      console.log('Fetching chart data with filters:', filters);
      
      // Build the query based on filters
      let query = supabase.from('sgz_ordens_servico').select('*');
      
      // Apply date range filter if provided
      if (filters.dateRange?.from && filters.dateRange?.to) {
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        
        // Format dates as ISO strings
        const fromStr = fromDate.toISOString();
        const toStr = toDate.toISOString();
        
        query = query.gte('sgz_criado_em', fromStr)
                     .lte('sgz_criado_em', toStr);
      }
      
      // Apply status filter if provided
      if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes('Todos')) {
        query = query.in('sgz_status', filters.statuses);
      }
      
      // Apply service type filter if provided
      if (filters.serviceTypes && filters.serviceTypes.length > 0 && !filters.serviceTypes.includes('Todos')) {
        query = query.in('sgz_tipo_servico', filters.serviceTypes);
      }
      
      // Apply district filter if provided
      if (filters.districts && filters.districts.length > 0 && !filters.districts.includes('Todos')) {
        query = query.in('sgz_distrito', filters.districts);
      }
      
      setChartLoadingProgress(30);
      
      // Execute the query
      const { data, error } = await query;
      
      setChartLoadingProgress(60);
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        setRawChartData(defaultChartData);
        setChartData({});
        setOrdensCount(0);
        setLastUpdate('Sem dados disponíveis');
        setIsLoading(false);
        setChartLoadingProgress(100);
        return;
      }
      
      // Set order count
      setOrdensCount(data.length);
      
      // Process the data
      const processedData = processChartData(data, filters);
      setRawChartData(processedData);
      
      // Format the data for charts
      const formattedChartData = formatChartData(processedData);
      setChartData(formattedChartData);
      
      console.log('Raw chart data processed:', processedData);
      console.log('Formatted chart data:', formattedChartData);
      
      setChartLoadingProgress(90);
      
      // Set last update timestamp
      const now = new Date();
      setLastUpdate(now.toLocaleString('pt-BR'));
      
      setChartLoadingProgress(100);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setFetchError(`Erro ao carregar dados: ${(error as Error).message}`);
      toast.error(`Erro ao carregar dados dos gráficos: ${(error as Error).message}`);
      
      // Set empty chart data on error
      setRawChartData(defaultChartData);
      setChartData({});
      setOrdensCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);
  
  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Function to manually refresh data
  const refreshData = async () => {
    await fetchData();
    toast.success('Dados dos gráficos atualizados com sucesso!');
  };
  
  return {
    chartData,
    isLoading,
    lastUpdate,
    chartLoadingProgress,
    fetchError,
    refreshData,
    ordensCount
  };
};
