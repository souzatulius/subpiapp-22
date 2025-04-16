
import React from 'react';
import AuthLayout from '@/components/AuthLayout';
import LoginForm from '@/components/login/LoginForm';

const Login = () => {
  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default Login;
