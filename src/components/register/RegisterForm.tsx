
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailSuffix from '@/components/EmailSuffix';
import { useRegisterForm } from './hooks/useRegisterForm';
import PersonalInfoFields from './form/PersonalInfoFields';
import PositionFields from './form/PositionFields';
import PasswordFields from './form/PasswordFields';
import RegisterButton from './form/RegisterButton';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const RegisterForm = ({ roles, areas, coordenacoes, loadingOptions }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCoord, setSelectedCoord] = useState('');
  
  const { 
    formData,
    password,
    setPassword,
    showRequirements,
    setShowRequirements,
    requirements,
    errors,
    loading: isLoading,
    handleChange,
    handleSubmit
  } = useRegisterForm();
  
  // Função para rolar até o formulário em dispositivos móveis
  const scrollToForm = () => {
    if (isMobile && formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full">
      <Link to="/login" className="inline-flex items-center text-[#f57c35] hover:text-[#f57c35] mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao login
      </Link>

      <h2 className="text-2xl font-bold mb-2 text-slate-900">Cadastre-se</h2>
      <p className="text-[#6B7280] mb-6">Preencha seus dados para solicitar acesso à plataforma.</p>

      {/* Mobile button removed as requested */}

      {loadingOptions ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003570]"></div>
        </div>
      ) : (
        <form id="register-form" ref={formRef} onSubmit={handleSubmit}>
          <div className="space-y-6">
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
              coordenacao={formData.coordenacao}
              roles={roles}
              areas={areas}
              coordenacoes={coordenacoes}
              loadingOptions={loadingOptions}
              errors={errors}
              handleChange={handleChange}
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
            
            <RegisterButton isLoading={isLoading} />
          </div>
          
          <p className="mt-6 text-center text-sm text-[#6B7280]">
            Já tem uma conta? <Link to="/login" className="text-[#f57c35] font-semibold hover:underline">Entrar</Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
