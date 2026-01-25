// src/hooks/categories/useCategoryMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory, deleteCategory } from "../../api/categories";

const categoriesKey = (params: any = {}) => ["categories", params];

export function useAddCategory(params = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createCategory(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriesKey(params) });
    },
  });
}

interface UpdateCategoryPayload {
  id: string;
  formData: FormData;
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: UpdateCategoryPayload) => updateCategory(id, formData),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: categoriesKey() });
      qc.invalidateQueries({ queryKey: ["category", id] });
    },
  });
}

export function useDeleteCategory(params = {}) {
  const qc = useQueryClient();
  return useMutation({
    // id is passed when calling mutate/mutateAsync
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKey(params) }),
  });
}
