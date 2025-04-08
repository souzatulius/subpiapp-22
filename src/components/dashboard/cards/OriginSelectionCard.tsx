
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserCircle, Building, Users, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OriginOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
}

interface OriginSelectionCardProps {
  title?: string;
  options?: OriginOption[];
}

const defaultOptions: OriginOption[] = [
  {
    id: 'imprensa',
    title: 'Imprensa',
    icon: <UserCircle className="h-6 w-6 text-blue-600" />,
    path: '/dashboard/comunicacao/cadastrar-demanda'
  },
  {
    id: 'institucional',
    title: 'Institucional',
    icon: <Building className="h-6 w-6 text-purple-600" />,
    path: '/dashboard/comunicacao/cadastrar-demanda'
  },
  {
    id: 'demandas_populacao',
    title: 'População',
    icon: <Users className="h-6 w-6 text-green-600" />,
    path: '/dashboard/comunicacao/cadastrar-demanda'
  },
  {
    id: 'telefone',
    title: 'Telefone',
    icon: <Phone className="h-6 w-6 text-orange-600" />,
    path: '/dashboard/comunicacao/cadastrar-demanda'
  },
  {
    id: 'email',
    title: 'Email',
    icon: <Mail className="h-6 w-6 text-red-600" />,
    path: '/dashboard/comunicacao/cadastrar-demanda'
  }
];

export const OriginSelectionCard: React.FC<OriginSelectionCardProps> = ({
  title = "Cadastro de Demandas",
  options = defaultOptions
}) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleOriginSelect = (option: OriginOption) => {
    setSelectedId(option.id);
    setLoading(true);
    
    // Simulate a brief loading state before redirecting
    setTimeout(() => {
      navigate(`${option.path}?origem_id=${option.id}`);
    }, 600);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">De onde vem a solicitação?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {options.map((option) => (
            <motion.div
              key={option.id}
              onClick={() => !loading && handleOriginSelect(option)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border-2 transition-all",
                selectedId === option.id 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              )}
            >
              <div className="text-gray-600 mb-3">
                {selectedId === option.id && loading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center">
                    {option.icon}
                  </div>
                )}
              </div>
              <div className="text-center text-sm font-medium">
                {option.title}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OriginSelectionCard;
