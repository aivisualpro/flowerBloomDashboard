// hooks/recipes/useRecipeMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRecipe, deleteRecipe, updateRecipe } from '../../api/recipes';
import { useDashboardStore } from '../../store/useDashboardStore';

export function useAddRecipe() {
  const qc = useQueryClient();
  return useMutation<any, Error, FormData>({
    mutationFn: (formData) => createRecipe(formData),
    retry: 0,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] });
      qc.invalidateQueries({ queryKey: ['recipe'] });
      useDashboardStore.getState().refresh();
    },
  });
}

export function useUpdateRecipe() {
  const qc = useQueryClient();
  return useMutation<any, Error, { id: string; formData: FormData }>({
    mutationFn: ({ id, formData }) => updateRecipe(id, formData),
    retry: 0,
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['recipes'] });
      qc.invalidateQueries({ queryKey: ['recipe', id] });
      useDashboardStore.getState().refresh();
    },
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: (id: string) => deleteRecipe(id),

    // Optimistic update for instant UI feedback
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["recipes"] });
      const previous = qc.getQueryData(["recipes"]);

      qc.setQueryData<any>(["recipes"], (old: any) => {
        if (!old) return old;
        const getId = (r: any) => r?.id ?? r?._id;
        return { ...old, rows: (old.rows || []).filter((r: any) => getId(r) !== id) };
      });

      // Return a context object with the previous data
      return { previous };
    },

    // If the mutation fails, use the context to roll back
    onError: (_err, _id, ctx: any) => { // ctx is now typed as { previous: any }
      if (ctx?.previous) qc.setQueryData(["recipes"], ctx.previous);
    },

    // Always refetch after error or success:
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
      useDashboardStore.getState().refresh();
    },
  });
}