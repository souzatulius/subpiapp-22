
import React, { useEffect } from 'react';
import AuthLayout from '@/components/AuthLayout';
import RegisterForm from '@/components/register/RegisterForm';
import { useRegisterOptions } from '@/hooks/useRegisterOptions';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { SelectOption } from '@/components/register/types';

const Register = () => {
  const { roles, areas, coordenacoes, loadingOptions } = useRegisterOptions();
  const { session } = useAuth();
  const navigate = useNavigate();
  
  // Debug
  useEffect(() => {
    console.log('Register page loaded');
    console.log('Roles:', roles);
    console.log('Areas:', areas);
    console.log('Coordenacoes:', coordenacoes);
    console.log('Loading options:', loadingOptions);
  }, [roles, areas, coordenacoes, loadingOptions]);
  
  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  // Map roles to the expected format
  const formattedRoles = roles.map((role: SelectOption) => ({
    id: role.id,
    nome: role.value
  }));

  // Map areas and coordenacoes to the expected format
  const formattedAreas = areas.map((area: SelectOption) => ({
    id: area.id,
    descricao: area.value
  }));

  const formattedCoordenacoes = coordenacoes.map((coord: SelectOption) => ({
    id: coord.id,
    descricao: coord.value
  }));
  
  return (
    <AuthLayout>
      <RegisterForm 
        roles={formattedRoles} 
        areas={formattedAreas}
        coordenacoes={formattedCoordenacoes}
        loadingOptions={loadingOptions} 
      />
    </AuthLayout>
  );
};

export default Register;
