import React, { useState, useEffect } from 'react';
import { useProblemsData, useProblemOperations } from '@/hooks/problems';
import { Problem } from '@/types/problem';
import { SupervisaoTecnica } from '@/types/common';
import DataTable from './data-table/DataTable';
import ProblemForm from './problems/ProblemForm';
import ProblemEditDialog from './problems/ProblemEditDialog';
import { renderIcon } from './problems/renderIcon';

const Problems = () => {
  const { problems, areas, isLoading, fetchProblems } = useProblemsData();
  const { isSubmitting, isDeleting, addProblem, updateProblem, deleteProblem } = useProblemOperations(fetchProblems);
  
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  useEffect(() => {
    console.log('Problems component loaded');
  }, []);

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

  const handleEdit = async (data: { descricao: string; supervisao_tecnica_id: string; icone?: string }) => {
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

  const handleAdd = async (data: { descricao: string; supervisao_tecnica_id: string; icone?: string }) => {
    try {
      await addProblem(data);
      closeAddForm();
      return Promise.resolve();
    } catch (error) {
      console.error('Error in handleAdd:', error);
      return Promise.reject(error);
    }
  };

  const handleDelete = (problem: Problem) => {
    return deleteProblem(problem.id);
  };

  const columns = [
    {
      key: 'icone',
      header: 'Ícone',
      render: (row: Problem) => renderIcon(row.icone),
      width: '60px'
    },
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'supervisao_tecnica',
      header: 'Supervisão Técnica',
      render: (row: Problem) => row.supervisao_tecnica?.descricao || '-',
    }
  ];

  const renderForm = (onClose: () => void) => {
    return (
      <ProblemForm
        onSubmit={handleAdd}
        onCancel={onClose}
        areas={areas as SupervisaoTecnica[]}
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
        onDelete={handleDelete}
        filterPlaceholder="Filtrar problemas..."
        renderForm={renderForm}
        isLoading={isLoading}
      />
      
      <ProblemEditDialog
        isOpen={isEditFormOpen}
        onClose={closeEditForm}
        problem={editingProblem}
        areas={areas as SupervisaoTecnica[]}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Problems;
