
import React from 'react';
import AuthLayout from '@/components/AuthLayout';
import LoginForm from '@/components/login/LoginForm';
import LoginLeftContent from '@/components/login/LoginLeftContent';

const Login = () => {
  return (
    <AuthLayout leftContent={<LoginLeftContent />}>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
