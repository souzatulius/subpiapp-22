
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
  
  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-full h-full">
        <RegisterForm 
          roles={roles} 
          areas={areas}
          coordenacoes={coordenacoes}
          loadingOptions={loadingOptions} 
        />
      </div>
    </AuthLayout>
  );
};

export default Register;
