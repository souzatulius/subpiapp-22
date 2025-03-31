
import React from 'react';
import { Building, MessageSquare, Phone, Mail, Users, Flag, Newspaper } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const useOriginIcon = (origem: any, className: string = "h-5 w-5") => {
  // Se o registro tiver um ícone definido, usá-lo
  if (origem && origem.icone) {
    // Verificar se é um ícone do Lucide
    if (Object.keys(LucideIcons).includes(origem.icone)) {
      const IconComponent = LucideIcons[origem.icone as keyof typeof LucideIcons] as React.ElementType;
      return <IconComponent className={className} />;
    }
    
    // Se não for um ícone do Lucide, pode ser uma URL de imagem
    return (
      <img 
        src={origem.icone} 
        alt="Ícone" 
        className={className}
        onError={(e) => {
          // Fallback para ícone padrão se a imagem falhar
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }
  
  // Mapeamento padrão baseado na descrição
  const iconMap: Record<string, React.ReactNode> = {
    "Imprensa": <Newspaper className={className} />,
    "SMSUB": <Building className={className} />,
    "SECOM": <MessageSquare className={className} />,
    "Telefone": <Phone className={className} />,
    "Email": <Mail className={className} />,
    "Ouvidoria": <Users className={className} />,
  };
  
  return origem && origem.descricao && iconMap[origem.descricao] 
    ? iconMap[origem.descricao] 
    : <Flag className={className} />;
};
