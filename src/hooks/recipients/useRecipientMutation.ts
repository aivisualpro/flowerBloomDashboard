// hooks/brands/useBrandsMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRecipient, deleteRecipient, updateRecipient } from '../../api/recipients';

export function useAddRecipient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: any) => createRecipient(formData),
    retry: 0,                      // ⬅️ important
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipients', 'recipient'] });
    },
  });
}

export function useUpdateRecipient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: any }) => updateRecipient(id, formData),
    retry: 0,                      // ⬅️ important
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipients', 'recipient'] });
    },
  });
}

export function useDeleteRecipient() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecipient(id),

    // Optimistic update for instant UI feedback
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["recipients"] });
      const previous = qc.getQueryData(["recipients"]);

      qc.setQueryData(["recipients"], (old: { rows: any[] } | undefined) => {
        if (!old) return old;
        const getId = (r: any) => r?.id ?? r?._id;
        return { ...old, rows: (old.rows || []).filter((r) => getId(r) !== id) };
      });

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(["recipients"], ctx.previous);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipients"] });
    },
  });
}