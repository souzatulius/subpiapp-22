import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getColorClass } from '@/components/dashboard/card-customization/utils';
import DemandasChart from './DemandasChart';
interface OriginsDemandCardWrapperProps {
  className?: string;
  color?: string;
  title?: string;
  subtitle?: string;
}
const OriginsDemandCardWrapper: React.FC<OriginsDemandCardWrapperProps> = ({
  className = '',
  color = 'gray-light',
  title = 'Atividades em Andamento',
  subtitle = 'Demandas da semana por área técnica'
}) => {
  const navigate = useNavigate();
  const handleViewMoreClick = () => {
    navigate('/dashboard/comunicacao/relatorios');
  };
  const bgColorClass = getColorClass(color);
  return;
};
export default OriginsDemandCardWrapper;