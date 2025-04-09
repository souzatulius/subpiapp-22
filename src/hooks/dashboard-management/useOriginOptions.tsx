
import React from 'react';
import { Building2, Users, Newspaper, Phone, Mail, Globe } from 'lucide-react';
import { OriginOption } from '@/types/dashboard';

export const useOriginOptions = () => {
  const originOptions: OriginOption[] = [
    {
      id: 'imprensa',
      title: 'Imprensa',
      icon: <Newspaper className="h-8 w-8" />,
      path: '/dashboard/comunicacao/cadastrar'
    },
    {
      id: 'cidadao',
      title: 'Cidadão',
      icon: <Users className="h-8 w-8" />,
      path: '/dashboard/comunicacao/cadastrar'
    },
    {
      id: 'gabinete',
      title: 'Gabinete',
      icon: <Building2 className="h-8 w-8" />,
      path: '/dashboard/comunicacao/cadastrar'
    },
    {
      id: 'telefone',
      title: 'Telefone',
      icon: <Phone className="h-8 w-8" />,
      path: '/dashboard/comunicacao/cadastrar'
    },
    {
      id: 'email',
      title: 'E-mail',
      icon: <Mail className="h-8 w-8" />,
      path: '/dashboard/comunicacao/cadastrar'
    },
    {
      id: 'site',
      title: 'Site/Redes',
      icon: <Globe className="h-8 w-8" />,
      path: '/dashboard/comunicacao/cadastrar'
    }
  ];

  return { originOptions };
};
