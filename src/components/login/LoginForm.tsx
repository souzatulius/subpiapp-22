
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { completeEmailWithDomain } from '@/lib/authUtils';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface LoginFormProps {
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirectTo = '/dashboard' }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, formState: { errors } } = useForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Campos obrigatórios", {
        description: "E-mail e senha são obrigatórios para realizar o login."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fullEmail = completeEmailWithDomain(email);
      
      const { error } = await signIn({
        email: fullEmail,
        password: password,
      });
      
      if (error) {
        console.error("Login failed:", error);
        
        if (error.message.includes('Email not confirmed')) {
          toast.error("Verificação Pendente", {
            description: "Por favor, verifique seu e-mail para ativar sua conta."
          });
        } else if (error.message.includes('Invalid login')) {
          toast.error("Credenciais inválidas", {
            description: "E-mail ou senha incorretos. Tente novamente."
          });
        } else {
          toast.error("Erro no Login", {
            description: error.message || "Ocorreu um erro ao tentar fazer login."
          });
        }
        return;
      }
      
      toast.success("Login realizado com sucesso!");
      navigate(redirectTo);
      
    } catch (error: any) {
      console.error("Exception during login:", error);
      toast.error("Erro inesperado", {
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail SUBPI</Label>
        <Input
          id="email"
          placeholder="Usuário ou e-mail completo"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          {...register('email', { required: true })}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white"
        />
        {errors.email && <p className="text-sm text-red-500">E-mail é obrigatório</p>}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Senha</Label>
          <Link to="/esqueci-senha" className="text-sm text-blue-600 hover:underline">
            Esqueci minha senha
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Senha de acesso"
            autoCapitalize="none"
            autoComplete="current-password"
            autoCorrect="off"
            {...register('password', { required: true })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">Senha é obrigatória</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center">
            <div className="spinner h-5 w-5 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mr-2"></div>
            <span>Entrando...</span>
          </div>
        ) : (
          "Entrar"
        )}
      </Button>

      <p className="text-center text-sm">
        Não tem uma conta?{" "}
        <Link to="/registrar" className="text-blue-600 hover:underline font-semibold">
          Crie agora
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
