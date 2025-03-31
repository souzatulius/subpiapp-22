
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LeftContentSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <img 
          src="/lovable-uploads/68db2d5a-d2b5-4bd5-98dd-09f54064eb10.png" 
          alt="Logo SUBPI" 
          className="w-[200px] h-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-[#003570] mb-4">
          Sistema Unificado de Banco de Problemas e Ideias
        </h1>
        <p className="text-[#111827] text-lg">
          Plataforma integrada para gerenciamento de demandas, comunicação e relatórios.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button 
          onClick={() => navigate('/login')} 
          className="bg-[#003570] hover:bg-[#00254d] text-white px-8 py-5 text-lg"
        >
          Acessar
          <ArrowRight className="ml-2" />
        </Button>
        
        <Button 
          onClick={() => navigate('/register')} 
          variant="outline" 
          className="border-[#003570] text-[#003570] hover:bg-[#e6eef7] px-8 py-5 text-lg"
        >
          Solicitar Acesso
        </Button>
      </div>
    </div>
  );
};

export default LeftContentSection;
