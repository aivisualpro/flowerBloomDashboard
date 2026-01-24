import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryType, updateCategoryType, deleteCategoryType } from "../../api/categoryTypes";
import { CategoryType } from "@/types";

const categoriesKey = (params = {}) => ["categoryTypes", params];

export function useAddCategoryType(params: any = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => createCategoryType(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriesKey(params) });
    },
  });
}

export function useUpdateCategoryType(id?: string | string[], params: any = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateCategoryType(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriesKey(params) });
      qc.invalidateQueries({ queryKey: ["categoryType", id] });
    },
  });
}

export function useDeleteCategoryType(params: any = {}) {
  const qc = useQueryClient();
  return useMutation({
    // id is passed when calling mutate/mutateAsync
    mutationFn: (id: string) => deleteCategoryType(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKey(params) }),
  });
}
