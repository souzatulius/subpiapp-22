import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast"
import { signUp } from '@/services/authService';
import { useCargos } from '@/hooks/useCargos';
import { useCoordenacoes } from '@/hooks/useCoordenacoes';
import { useSupervisoesTecnicas } from '@/hooks/useSupervisoesTecnicas';

const formSchema = z.object({
  nome_completo: z.string().min(2, {
    message: "Nome completo deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  whatsapp: z.string().optional(),
  cargo: z.string().min(1, {
    message: "Cargo é obrigatório.",
  }),
  coordenacao: z.string().min(1, {
    message: "Coordenação é obrigatória.",
  }),
  supervisao_tecnica: z.string().optional(),
})

interface FormValues extends z.infer<typeof formSchema> {}

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast()
  const { cargos, isLoading: isLoadingCargos } = useCargos();
  const { coordenacoes, isLoading: isLoadingCoordenacoes } = useCoordenacoes();
  const { supervisoesTecnicas, isLoading: isLoadingSupervisoes } = useSupervisoesTecnicas();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_completo: "",
      email: "",
      password: "",
      whatsapp: "",
      cargo: "",
      coordenacao: "",
      supervisao_tecnica: "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Modified to pass email, password, and userData separately
      const { data, error } = await signUp(
        values.email, 
        values.password, 
        {
          nome_completo: values.nome_completo,
          whatsapp: values.whatsapp,
          cargo_id: values.cargo,
          coordenacao_id: values.coordenacao,
          supervisao_tecnica_id: values.supervisao_tecnica
        }
      );
      
      if (error) {
        setError(error.message);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado para a página de login.",
        })
        navigate("/login");
      }
    } catch (err: any) {
      console.error("Erro ao criar conta:", err);
      setError("Ocorreu um erro ao criar a conta. Por favor, tente novamente.");
      toast({
        title: "Erro ao criar conta",
        description: err.message || "Ocorreu um erro ao criar a conta. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_completo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Digite sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu WhatsApp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cargo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cargos?.map((cargo) => (
                    <SelectItem key={cargo.id} value={cargo.id}>{cargo.descricao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coordenacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordenação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma coordenação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {coordenacoes?.map((coordenacao) => (
                    <SelectItem key={coordenacao.id} value={coordenacao.id}>{coordenacao.descricao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supervisao_tecnica"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supervisão Técnica (opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma supervisão técnica" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supervisoesTecnicas?.map((supervisao) => (
                    <SelectItem key={supervisao.id} value={supervisao.id}>{supervisao.descricao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>

        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </form>
    </Form>
  )
}

export default RegisterForm;
