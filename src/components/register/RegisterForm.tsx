
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import PasswordRequirements from '@/components/PasswordRequirements';
import { transformName } from '@/utils/stringUtils';
import EmailSuffix from '@/components/EmailSuffix';

// Schema definition for form validation
const registerSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter ao menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .regex(/[a-z]/, 'Senha deve ter ao menos uma letra minúscula')
    .regex(/[A-Z]/, 'Senha deve ter ao menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve ter ao menos um número')
    .regex(/[^a-zA-Z0-9]/, 'Senha deve ter ao menos um caractere especial'),
  role: z.string().min(1, 'Selecione um cargo'),
  area: z.string().min(1, 'Selecione uma área'),
  coordenacao: z.string().min(1, 'Selecione uma coordenação')
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  roles: { id: string; nome: string }[];
  areas: { id: string; descricao: string }[];
  coordenacoes: { id: string; descricao: string }[];
  loadingOptions: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ roles, areas, coordenacoes, loadingOptions }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSuffix, setEmailSuffix] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      area: '',
      coordenacao: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);

      // Combine email with the official domain suffix
      const fullEmail = `${values.email}@smsub.prefeitura.sp.gov.br`;

      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: fullEmail,
        password: values.password,
        options: {
          data: {
            first_name: transformName(values.firstName),
            last_name: transformName(values.lastName),
            role_id: values.role,
            area_id: values.area,
            coordenacao_id: values.coordenacao,
            full_name: `${transformName(values.firstName)} ${transformName(values.lastName)}`,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('email')) {
          setError('email', { message: 'Este email já está em uso.' });
        } else {
          toast({
            title: 'Erro no cadastro',
            description: error.message,
            variant: 'destructive',
          });
        }
        setIsSubmitting(false);
        return;
      }

      if (data) {
        // Redirect to email verification page
        navigate('/email-verified');
      }
    } catch (error: any) {
      console.error('Unexpected error during registration:', error);
      toast({
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full">
      <h2 className="text-2xl font-bold mb-2 text-slate-900">Crie sua conta</h2>
      <p className="text-gray-600 mb-6">
        Preencha o formulário abaixo para solicitar acesso ao sistema
      </p>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row w-full gap-4">
          {/* First name field */}
          <div className="w-full">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              id="firstName"
              {...register('firstName')}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last name field */}
          <div className="w-full">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Sobrenome
            </label>
            <input
              id="lastName"
              {...register('lastName')}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email with suffix field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <EmailSuffix
            id="email"
            value={emailSuffix}
            onChange={setEmailSuffix}
            suffix="@smsub.prefeitura.sp.gov.br"
            error={!!errors.email}
            placeholder="seu.email"
            registerField={register('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={passwordVisible ? 'text' : 'password'}
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
            >
              {passwordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          <PasswordRequirements password={passwordVisible ? "" : "********"} />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Role selector */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Cargo
          </label>
          <select
            id="role"
            {...register('role')}
            disabled={loadingOptions}
            className={`w-full px-4 py-2 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione um cargo</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.nome}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
        </div>

        {/* Area selector */}
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
            Área
          </label>
          <select
            id="area"
            {...register('area')}
            disabled={loadingOptions}
            className={`w-full px-4 py-2 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.area ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione uma área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.descricao}
              </option>
            ))}
          </select>
          {errors.area && <p className="mt-1 text-sm text-red-500">{errors.area.message}</p>}
        </div>

        {/* Coordenação selector */}
        <div>
          <label htmlFor="coordenacao" className="block text-sm font-medium text-gray-700 mb-1">
            Coordenação
          </label>
          <select
            id="coordenacao"
            {...register('coordenacao')}
            disabled={loadingOptions}
            className={`w-full px-4 py-2 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.coordenacao ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione uma coordenação</option>
            {coordenacoes.map((coord) => (
              <option key={coord.id} value={coord.id}>
                {coord.descricao}
              </option>
            ))}
          </select>
          {errors.coordenacao && (
            <p className="mt-1 text-sm text-red-500">{errors.coordenacao.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#003570] text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-900 transition-colors flex justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              Enviando...
            </>
          ) : (
            'Cadastrar'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-[#f57c35] hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
