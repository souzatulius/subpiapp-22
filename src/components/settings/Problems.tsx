
import React, { useState } from 'react';
import DataTable from './data-table/DataTable';
import ProblemForm from './problems/ProblemForm';
import ProblemEditDialog from './problems/ProblemEditDialog';
import { useProblems, Problem } from '@/hooks/useProblems';

const Problems = () => {
  const {
    problems,
    areas,
    loading,
    isSubmitting,
    addProblem,
    updateProblem,
    deleteProblem
  } = useProblems();
  
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
    
    await updateProblem(editingProblem.id, data);
    closeEditForm();
    return Promise.resolve();
  };

  const handleAdd = async (data: { descricao: string; area_coordenacao_id: string }) => {
    await addProblem(data);
    closeAddForm();
    return Promise.resolve();
  };

  const columns = [
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'areas_coordenacao',
      header: 'Área de Coordenação',
      render: (row: any) => row.areas_coordenacao?.descricao || '-',
    },
    {
      key: 'criado_em',
      header: 'Data de Criação',
      render: (row: any) => new Date(row.criado_em).toLocaleDateString('pt-BR'),
    },
  ];

  const renderForm = (onClose: () => void) => (
    <ProblemForm
      onSubmit={handleAdd}
      onCancel={onClose}
      areas={areas}
      isSubmitting={isSubmitting}
    />
  );

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
        isLoading={loading}
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
