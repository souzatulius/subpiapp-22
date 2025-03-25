
import React, { useState } from 'react';
import { useProblemsData, useProblemOperations, Problem, Area } from '@/hooks/useProblems';
import DataTable from './data-table/DataTable';
import TemaForm from './temas/TemaForm';
import TemaEditDialog from './temas/TemaEditDialog';

const Temas = () => {
  const { problems, areas, isLoading, fetchProblems } = useProblemsData();
  const { isSubmitting, isDeleting, addProblem, updateProblem, deleteProblem } = useProblemOperations(fetchProblems);
  
  const [editingTema, setEditingTema] = useState<Problem | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openEditForm = (tema: Problem) => {
    setEditingTema(tema);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingTema(null);
  };

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  const handleEdit = async (data: { descricao: string; area_coordenacao_id: string }) => {
    if (!editingTema) return Promise.reject(new Error('Nenhum tema selecionado'));
    
    try {
      await updateProblem(editingTema.id, data);
      closeEditForm();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleEdit:', error);
      return Promise.reject(error);
    }
  };

  const handleAdd = async (data: { descricao: string; area_coordenacao_id: string }) => {
    try {
      await addProblem(data);
      closeAddForm();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleAdd:', error);
      return Promise.reject(error);
    }
  };

  // Fix: Properly extract the ID when deleting a tema
  const handleDelete = (tema: Problem) => {
    return deleteProblem(tema.id);
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'area_coordenacao',
      header: 'Área de Coordenação',
      render: (row: Problem) => row.areas_coordenacao?.descricao || '-',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: Problem) => new Date(row.criado_em || '').toLocaleDateString('pt-BR'),
    },
  ];

  const renderForm = (onClose: () => void) => {
    return (
      <TemaForm
        onSubmit={handleAdd}
        onCancel={onClose}
        areas={areas as any}
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <div>
      <DataTable
        title="Temas"
        data={problems}
        columns={columns}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={handleDelete}
        filterPlaceholder="Filtrar temas..."
        renderForm={renderForm}
        isLoading={isLoading}
      />
      
      <TemaEditDialog
        isOpen={isEditFormOpen}
        onClose={closeEditForm}
        tema={editingTema}
        areas={areas as any}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Temas;
