
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
  
  // Transform coordenacoes to include sigla information
  const enrichedCoordenacoes: SelectOption[] = coordenacoes.map(coord => ({
    ...coord,
    sigla: getSiglaFromCoord(coord)
  }));
  
  // Helper function to extract sigla from coordenacao if available
  function getSiglaFromCoord(coord: SelectOption): string {
    // Check if the value contains a sigla in parentheses
    const match = coord.label?.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return '';
  }
  
  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <RegisterForm 
          roles={roles} 
          areas={areas}
          coordenacoes={enrichedCoordenacoes}
          loadingOptions={loadingOptions} 
        />
      </div>
    </AuthLayout>
  );
};

export default Register;
