
import React from 'react';
import AuthLayout from '@/components/AuthLayout';
import RegisterForm from '@/components/register/RegisterForm';
import RegisterLeftContent from '@/components/register/RegisterLeftContent';
import { useRegisterOptions } from '@/hooks/useRegisterOptions';

const Register = () => {
  const { roles, areas, loadingOptions } = useRegisterOptions();
  
  return (
    <AuthLayout leftContent={<RegisterLeftContent />}>
      <RegisterForm 
        roles={roles} 
        areas={areas} 
        loadingOptions={loadingOptions} 
      />
    </AuthLayout>
  );
};

export default Register;
