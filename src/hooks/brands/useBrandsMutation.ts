// hooks/brands/useBrandsMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrand, deleteBrand, updateBrand } from '../../api/brands';
import { useDashboardStore } from '../../store/useDashboardStore';

export function useAddBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: any) => createBrand(formData),
    retry: 0,                      // ⬅️ important
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['brands'] });
      useDashboardStore.getState().refresh();
    },
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: any }) => updateBrand(id, formData),
    retry: 0,                      // ⬅️ important
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['brands'] });
      useDashboardStore.getState().refresh();
    },
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    retry: 0,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['brands'] });
      useDashboardStore.getState().refresh();
    },
  });
}
