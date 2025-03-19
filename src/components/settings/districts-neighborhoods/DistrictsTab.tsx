
import React from 'react';
import DataTable from '../data-table/DataTable';
import { useDistrictOperations } from './hooks/useDistrictOperations';
import DistrictEditDialog from './district-components/DistrictEditDialog';
import { getDistrictColumns, renderDistrictForm } from './district-components/DistrictTableConfig';

interface DistrictsTabProps {
  districts: any[];
  loadingDistricts: boolean;
  fetchDistricts: () => Promise<void>;
  fetchNeighborhoods: () => Promise<void>;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const DistrictsTab: React.FC<DistrictsTabProps> = ({
  districts,
  loadingDistricts,
  fetchDistricts,
  fetchNeighborhoods,
  isSubmitting,
  setIsSubmitting,
}) => {
  const {
    isEditDistrictOpen,
    setIsEditDistrictOpen,
    editingDistrict,
    setEditingDistrict,
    handleAddDistrict,
    handleEditDistrict,
    handleDeleteDistrict,
  } = useDistrictOperations({
    fetchDistricts,
    fetchNeighborhoods,
    setIsSubmitting,
  });

  // Districts table configuration
  const districtColumns = getDistrictColumns();

  return (
    <>
      <DataTable
        title="Distritos"
        data={districts}
        columns={districtColumns}
        onAdd={() => {}}
        onEdit={(district) => {
          setEditingDistrict(district);
          setIsEditDistrictOpen(true);
        }}
        onDelete={handleDeleteDistrict}
        filterPlaceholder="Filtrar distritos..."
        renderForm={(onClose) => renderDistrictForm({
          onSubmit: handleAddDistrict,
          onClose,
          isSubmitting
        })}
        isLoading={loadingDistricts}
      />
      
      {/* Edit District Dialog */}
      <DistrictEditDialog
        isOpen={isEditDistrictOpen}
        onOpenChange={setIsEditDistrictOpen}
        editingDistrict={editingDistrict}
        onSubmit={handleEditDistrict}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default DistrictsTab;
