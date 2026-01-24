// hooks/brands/useBrandsMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOccasion, deleteOccasion, updateOccasion } from '../../api/occasions';

export function useAddOccasion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: any) => createOccasion(formData),
    retry: 0,                      // ⬅️ important
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['occasions', 'occasion'] });
    },
  });
}

export function useUpdateOccasion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: any }) => updateOccasion(id, formData),
    retry: 0,                      // ⬅️ important
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['occasions', 'occasion'] });
    },
  });
}

export function useDeleteOccasion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOccasion(id),

    // Optimistic update for instant UI feedback
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["occasions"] });
      const previous = qc.getQueryData(["occasions"]);

      qc.setQueryData(["occasions"], (old: any) => {
        if (!old) return old;
        const getId = (r: any) => r?.id ?? r?._id;
        return { ...old, rows: (old.rows || []).filter((r: any) => getId(r) !== id) };
      });

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(["occasions"], ctx.previous);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["occasions"] });
    },
  });
}