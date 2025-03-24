
import React from 'react';
import { Link } from 'react-router-dom';
import PersonalInfoFields from './form/PersonalInfoFields';
import PositionFields from './form/PositionFields';
import PasswordFields from './form/PasswordFields';
import RegisterButton from './form/RegisterButton';
import { useRegisterForm } from './hooks/useRegisterForm';
import { RegisterFormProps } from './types';

const RegisterForm: React.FC<RegisterFormProps> = ({
  roles,
  areas,
  loadingOptions
}) => {
  const {
    formData,
    password,
    setPassword,
    showRequirements,
    setShowRequirements,
    requirements,
    errors,
    loading,
    handleChange,
    handleSubmit
  } = useRegisterForm();

  // Debug
  React.useEffect(() => {
    console.log('RegisterForm received props:');
    console.log('Roles:', roles);
    console.log('Areas:', areas);
    console.log('Loading options:', loadingOptions);
  }, [roles, areas, loadingOptions]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="loading-spinner animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full">
      <h2 className="text-2xl font-bold mb-2 text-slate-900">Solicitar Acesso</h2>
      <p className="text-[#6B7280] mb-6">Preencha o formulário abaixo para criar sua conta.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <PersonalInfoFields 
            name={formData.name} 
            email={formData.email} 
            birthday={formData.birthday} 
            whatsapp={formData.whatsapp} 
            errors={errors} 
            handleChange={handleChange} 
          />
          
          <PositionFields 
            role={formData.role} 
            area={formData.area} 
            roles={roles} 
            areas={areas} 
            loadingOptions={loadingOptions} 
            errors={errors} 
            handleChange={(name, value) => handleChange(name, value)} 
          />
          
          <PasswordFields 
            password={password} 
            confirmPassword={formData.confirmPassword} 
            setPassword={setPassword} 
            setShowRequirements={setShowRequirements} 
            showRequirements={showRequirements} 
            requirements={requirements} 
            errors={errors} 
            handleChange={handleChange} 
          />
          
          <RegisterButton isLoading={loading} />
        </div>
      </form>
      
      <p className="mt-6 text-center text-sm text-[#6B7280]">
        Já tem uma conta? <Link to="/login" className="text-[#f57c35] font-semibold hover:underline">Entrar</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
