
import React from 'react';
import DataTable from '../data-table/DataTable';
import { useNeighborhoodOperations } from './hooks/useNeighborhoodOperations';
import NeighborhoodEditDialog from './neighborhood-components/NeighborhoodEditDialog';
import { getNeighborhoodColumns, renderNeighborhoodForm } from './neighborhood-components/NeighborhoodTableConfig';

interface NeighborhoodsTabProps {
  neighborhoods: any[];
  districts: any[];
  loadingNeighborhoods: boolean;
  fetchNeighborhoods: () => Promise<void>;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const NeighborhoodsTab: React.FC<NeighborhoodsTabProps> = ({
  neighborhoods,
  districts,
  loadingNeighborhoods,
  fetchNeighborhoods,
  isSubmitting,
  setIsSubmitting,
}) => {
  const {
    isEditNeighborhoodOpen,
    setIsEditNeighborhoodOpen,
    editingNeighborhood,
    setEditingNeighborhood,
    handleAddNeighborhood,
    handleEditNeighborhood,
    handleDeleteNeighborhood,
  } = useNeighborhoodOperations({
    fetchNeighborhoods,
    setIsSubmitting,
  });

  // Neighborhoods table configuration
  const neighborhoodColumns = getNeighborhoodColumns();

  return (
    <>
      <DataTable
        title="Bairros"
        data={neighborhoods}
        columns={neighborhoodColumns}
        onAdd={() => {}}
        onEdit={(neighborhood) => {
          setEditingNeighborhood(neighborhood);
          setIsEditNeighborhoodOpen(true);
        }}
        onDelete={handleDeleteNeighborhood}
        filterPlaceholder="Filtrar bairros..."
        renderForm={(onClose) => renderNeighborhoodForm({
          onSubmit: handleAddNeighborhood,
          onClose,
          isSubmitting,
          districts
        })}
        isLoading={loadingNeighborhoods}
      />
      
      {/* Edit Neighborhood Dialog */}
      <NeighborhoodEditDialog
        isOpen={isEditNeighborhoodOpen}
        onOpenChange={setIsEditNeighborhoodOpen}
        editingNeighborhood={editingNeighborhood}
        onSubmit={handleEditNeighborhood}
        isSubmitting={isSubmitting}
        districts={districts}
      />
    </>
  );
};

export default NeighborhoodsTab;
