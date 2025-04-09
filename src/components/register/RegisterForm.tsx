
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { SelectOption } from './types';
import { useRegisterForm } from './hooks/useRegisterForm';
import PasswordFields from './form/PasswordFields';
import PersonalInfoFields from './form/PersonalInfoFields';
import PositionFields from './form/PositionFields';

interface RegisterFormProps {
  roles: SelectOption[];
  areas: SelectOption[];
  coordenacoes: SelectOption[];
  loadingOptions?: boolean;
}

const RegisterForm = ({ 
  roles, 
  areas,
  coordenacoes,
  loadingOptions = false 
}: RegisterFormProps) => {
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

  // Used to track form progress and steps
  const [step, setStep] = useState(1);
  
  const nextStep = () => {
    // Basic validation before proceeding
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.birthday || !formData.whatsapp) {
        // Show errors for missing fields
        const newErrors: Record<string, boolean> = {};
        if (!formData.name) newErrors.name = true;
        if (!formData.email) newErrors.email = true;
        if (!formData.birthday) newErrors.birthday = true;
        if (!formData.whatsapp) newErrors.whatsapp = true;
        
        // You need to modify handleChange to add setErrors function
        Object.keys(newErrors).forEach(key => {
          // This will show the errors
          handleChange(key as any, '');
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.role || !formData.coordenacao) {
        // Show errors for missing fields
        const newErrors: Record<string, boolean> = {};
        if (!formData.role) newErrors.role = true;
        if (!formData.coordenacao) newErrors.coordenacao = true;
        
        // You need to modify handleChange to add setErrors function
        Object.keys(newErrors).forEach(key => {
          // This will show the errors
          handleChange(key as any, '');
        });
        return;
      }
    }
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="w-full max-w-xl space-y-6 bg-white p-8 rounded-xl shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Cadastro de Usuário</h1>
        <p className="text-sm text-gray-500 mt-1">
          Preencha as informações abaixo para criar sua conta
        </p>
      </div>
      
      <Separator />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Informações Pessoais</h2>
            
            <PersonalInfoFields 
              name={formData.name}
              email={formData.email}
              birthday={formData.birthday}
              whatsapp={formData.whatsapp}
              errors={errors}
              handleChange={handleChange}
            />
            
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                onClick={nextStep}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 2: Position Information */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Informações Profissionais</h2>
            
            <PositionFields 
              role={formData.role}
              area={formData.area}
              coordenacao={formData.coordenacao}
              roles={roles}
              areas={areas}
              coordenacoes={coordenacoes}
              loadingOptions={loadingOptions}
              errors={errors}
              handleChange={(name, value) => handleChange(name, value)}
            />
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={prevStep}
              >
                Voltar
              </Button>
              <Button 
                type="button" 
                onClick={nextStep}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Password */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Segurança</h2>
            
            <PasswordFields 
              password={password}
              setPassword={setPassword}
              confirmPassword={formData.confirmPassword}
              showRequirements={showRequirements}
              setShowRequirements={setShowRequirements}
              requirements={requirements}
              errors={errors}
              handleChange={handleChange}
            />
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={prevStep}
              >
                Voltar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : 'Criar conta'}
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-center text-sm">
          <p className="text-gray-500">
            Já possui uma conta?{' '}
            <Link to="/login" className="text-orange-500 font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
