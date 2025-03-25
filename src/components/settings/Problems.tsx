
import React, { useState } from 'react';
import { useProblemsData, useProblemOperations, Problem, Area } from '@/hooks/problems';
import DataTable from './data-table/DataTable';
import ProblemForm from './problems/ProblemForm';
import ProblemEditDialog from './problems/ProblemEditDialog';

const Problems = () => {
  const { problems, areas, isLoading, fetchProblems } = useProblemsData();
  const { isSubmitting, isDeleting, addProblem, updateProblem, deleteProblem } = useProblemOperations(fetchProblems);
  
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openEditForm = (problem: Problem) => {
    setEditingProblem(problem);
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditingProblem(null);
  };

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };

  const handleEdit = async (data: { descricao: string; area_coordenacao_id: string }) => {
    if (!editingProblem) return Promise.reject(new Error('Nenhum problema selecionado'));
    
    try {
      await updateProblem(editingProblem.id, data);
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

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'area_coordenacao',
      header: 'Área de Coordenação',
      render: (row: Problem) => row.area_coordenacao?.descricao || '-',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: Problem) => new Date(row.criado_em || '').toLocaleDateString('pt-BR'),
    },
  ];

  const renderForm = (onClose: () => void) => {
    return (
      <ProblemForm
        onSubmit={handleAdd}
        onCancel={onClose}
        areas={areas}
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <div>
      <DataTable
        title="Problemas"
        data={problems}
        columns={columns}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={deleteProblem}
        filterPlaceholder="Filtrar problemas..."
        renderForm={renderForm}
        isLoading={isLoading}
      />
      
      <ProblemEditDialog
        isOpen={isEditFormOpen}
        onClose={closeEditForm}
        problem={editingProblem}
        areas={areas}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Problems;
