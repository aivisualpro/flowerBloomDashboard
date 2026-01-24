// hooks/brands/useBrandsMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, deleteProduct, updateProduct } from '../../api/products';

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation<any, Error, FormData>({
    mutationFn: (formData) => createProduct(formData),
    retry: 0,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation<any, Error, { id: string; formData: FormData }>({
    mutationFn: ({ id, formData }) => updateProduct(id, formData),
    retry: 0,
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product', id] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: (id: string) => deleteProduct(id),

    // Optimistic update for instant UI feedback
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["products"] });
      const previous = qc.getQueryData(["products"]);

      qc.setQueryData<any>(["products"], (old: any) => {
        if (!old) return old;
        const getId = (r: any) => r?.id ?? r?._id;
        return { ...old, rows: (old.rows || []).filter((r: any) => getId(r) !== id) };
      });

      // Return a context object with the previous data
      return { previous };
    },

    // If the mutation fails, use the context to roll back
    onError: (_err, _id, ctx: any) => { // ctx is now typed as { previous: any }
      if (ctx?.previous) qc.setQueryData(["products"], ctx.previous);
    },

    // Always refetch after error or success:
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}