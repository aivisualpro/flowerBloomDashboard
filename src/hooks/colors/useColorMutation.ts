import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColors as createColorApi,
  updateColors as updateColorApi,
  deleteColor as deleteColorApi,
} from "../../api/colors";

interface Color {
  id?: string;
  _id?: string;
  name?: string;
  slug?: string;
  value?: string;
  mode?: string;
}

const getId = (x: Color) => x?.id ?? x?._id;

export function useAddColor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => createColorApi(payload),
    onSuccess: (created: Color) => {
      // instant add
      qc.setQueryData(["colors", {}], (old: { rows: Color[] } | undefined) => {
        if (!old) return old;
        const rows = Array.isArray(old.rows) ? old.rows : [];
        const without = rows.filter((r: Color) => getId(r) !== getId(created));
        return { ...old, rows: [created, ...without] };
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
    retry: 0,
  });
}

export function useUpdateColor() {
  const qc = useQueryClient();
  return useMutation<Color, Error, { id: string; payload: any }>({
    mutationFn: ({ id, payload }) => updateColorApi(id, payload),
    onSuccess: (updated: Color, { id }: { id: string }) => {
      qc.setQueryData(["colors", {}], (old: { rows: Color[] } | undefined) => {
        if (!old) return old;
        const rows = Array.isArray(old.rows) ? old.rows : [];
        return {
          ...old,
          rows: rows.map((r: Color) => (getId(r) === getId(updated) ? { ...r, ...updated } : r)),
        };
      });
      qc.invalidateQueries({ queryKey: ["color", id] });
    },
    onSettled: (_res: any, _err: any, { id }: { id: string }) => {
      qc.invalidateQueries({ queryKey: ["colors"] });
      qc.invalidateQueries({ queryKey: ["color", id] });
    },
    retry: 0,
  });
}

export function useDeleteColor() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteColorApi(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["colors"] });
      const previous = qc.getQueryData(["colors", {}]);
      qc.setQueryData(["colors", {}], (old: { rows: Color[] } | undefined) => {
        if (!old) return old;
        const rows = Array.isArray(old.rows) ? old.rows : [];
        return { ...old, rows: rows.filter((r: Color) => getId(r) !== id) };
      });
      return { previous };
    },
    onError: (_e: any, _id: string, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(["colors", {}], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["colors"] });
    },
    retry: 0,
  });
}
