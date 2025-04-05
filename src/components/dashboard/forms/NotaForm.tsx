
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Send, X, Upload, Trash2, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotaFormData, NotaFormSchema } from './schemas/notaFormSchema';
import { useProblemasOptions } from '@/hooks/useProblemasOptions';
import { useTemasOptions } from '@/hooks/useTemasOptions';
import ProblemSelector from './components/ProblemSelector';
import { useReleaseForm } from '@/hooks/useReleaseForm';

const NotaForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { problemas } = useProblemasOptions();
  const { temas } = useTemasOptions();
  
  // State for file handling
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const { isSubmitting, submitRelease } = useReleaseForm();
  
  // Initialize form with default values
  const form = useForm<NotaFormData>({
    resolver: zodResolver(NotaFormSchema),
    defaultValues: {
      titulo: '',
      conteudo: '',
      problema_id: '',
      tema_id: '',
      status: 'pendente'
    }
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  // Clear selected file
  const handleClearFile = () => {
    setFile(null);
  };
  
  // Handle form submission
  const onSubmit = async (data: NotaFormData) => {
    try {
      const success = await submitRelease(data, file);
      
      if (success) {
        toast({
          title: "Nota oficial criada com sucesso",
          description: "A nota oficial foi enviada para revisão e publicação",
          variant: "default"
        });
        
        // Navigate to consultar-notas page
        navigate('/dashboard/comunicacao/consultar-notas');
      }
    } catch (error: any) {
      console.error('Erro ao criar nota oficial:', error);
    }
  };
  
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Informações da Nota Oficial</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Título da Nota</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="border-gray-300 rounded-xl focus-visible:ring-blue-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tema_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Tema</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 rounded-xl focus-visible:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {temas.map((tema) => (
                          <SelectItem key={tema.id} value={tema.id}>
                            {tema.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="problema_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Problema</FormLabel>
                    <FormControl>
                      <ProblemSelector
                        value={field.value}
                        onChange={field.onChange}
                        problemas={problemas}
                        className="border-gray-300 rounded-xl focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="conteudo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Conteúdo da Nota</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-h-[200px] border-gray-300 rounded-xl focus-visible:ring-blue-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel className="text-gray-700 block mb-2">Anexo (opcional)</FormLabel>
              
              {!file ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Paperclip className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 mb-3">Clique para anexar um arquivo à nota oficial</p>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="rounded-xl"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Arquivo
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center">
                    <Paperclip className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="font-medium text-sm">{file.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFile}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/comunicacao')}
                className="rounded-xl"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Nota
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotaForm;
