
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { registerUser, RegisterUserData } from '@/services/authService';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome_completo: '',
    whatsapp: '',
  });
  const [cargos, setCargos] = useState<SelectOption[]>([]);
  const [coordenacoes, setCoordenacoes] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [selectedCargo, setSelectedCargo] = useState('');
  const [selectedCoordenacao, setSelectedCoordenacao] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome_completo: '',
    cargo: '',
    coordenacao: '',
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch cargos
        const { data: cargosData, error: cargosError } = await supabase
          .from('cargos')
          .select('id, descricao')
          .order('descricao');
        
        if (cargosError) throw cargosError;
        setCargos(cargosData.map((cargo) => ({ 
          value: cargo.id, 
          label: cargo.descricao 
        })));

        // Fetch coordenacoes
        const { data: coordenacoesData, error: coordenacoesError } = await supabase
          .from('coordenacoes')
          .select('id, descricao')
          .order('descricao');
        
        if (coordenacoesError) throw coordenacoesError;
        setCoordenacoes(coordenacoesData.map((coord) => ({ 
          value: coord.id, 
          label: coord.descricao 
        })));

      } catch (error) {
        console.error('Error fetching options:', error);
        toast({
          title: "Erro ao carregar opções",
          description: "Não foi possível carregar as opções de cargo e coordenação.",
          variant: "destructive"
        });
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Fetch areas based on selected coordenacao
    const fetchAreas = async () => {
      if (!selectedCoordenacao) {
        setAreas([]);
        return;
      }

      try {
        const { data: areasData, error: areasError } = await supabase
          .from('supervisoes_tecnicas')
          .select('id, descricao')
          .eq('coordenacao_id', selectedCoordenacao)
          .order('descricao');
        
        if (areasError) throw areasError;
        setAreas(areasData.map((area) => ({ 
          value: area.id, 
          label: area.descricao 
        })));
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    };

    fetchAreas();
  }, [selectedCoordenacao]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      email: !formData.email ? 'Email é obrigatório' : '',
      password: !formData.password ? 'Senha é obrigatória' : 
               formData.password.length < 6 ? 'Senha deve ter pelo menos 6 caracteres' : '',
      confirmPassword: formData.password !== formData.confirmPassword ? 'Senhas não coincidem' : '',
      nome_completo: !formData.nome_completo ? 'Nome é obrigatório' : '',
      cargo: !selectedCargo ? 'Cargo é obrigatório' : '',
      coordenacao: !selectedCoordenacao ? 'Coordenação é obrigatória' : '',
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userData: RegisterUserData = {
        email: formData.email,
        password: formData.password,
        nome_completo: formData.nome_completo,
        cargo_id: selectedCargo,
        coordenacao_id: selectedCoordenacao,
        area_id: selectedArea || undefined,
        whatsapp: formData.whatsapp || undefined,
      };

      const { data, error } = await registerUser(userData);

      if (error) {
        throw error;
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar seu cadastro."
      });

      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao processar o cadastro.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-slate-900">Cadastre-se</h2>
      <p className="text-[#6B7280] mb-6">Preencha os dados para solicitar acesso.</p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu-email@exemplo.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome_completo}
              onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
              placeholder="Seu nome completo"
              className={errors.nome_completo ? 'border-red-500' : ''}
            />
            {errors.nome_completo && <p className="text-sm text-red-500">{errors.nome_completo}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Select 
              onValueChange={setSelectedCargo} 
              value={selectedCargo}
            >
              <SelectTrigger className={errors.cargo ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione seu cargo" />
              </SelectTrigger>
              <SelectContent>
                {cargos.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cargo && <p className="text-sm text-red-500">{errors.cargo}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coordenacao">Coordenação</Label>
            <Select 
              onValueChange={setSelectedCoordenacao} 
              value={selectedCoordenacao}
            >
              <SelectTrigger className={errors.coordenacao ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione sua coordenação" />
              </SelectTrigger>
              <SelectContent>
                {coordenacoes.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.coordenacao && <p className="text-sm text-red-500">{errors.coordenacao}</p>}
          </div>

          {areas.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="area">Supervisão Técnica (Opcional)</Label>
              <Select 
                onValueChange={setSelectedArea} 
                value={selectedArea}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua supervisão técnica" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp (Opcional)</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirme a senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <Button
            type="submit"
            className="w-full text-lg font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              'Solicitar Acesso'
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-base text-[#6B7280]">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-[#003570] font-semibold hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
