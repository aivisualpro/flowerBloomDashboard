// src/hooks/categories/useCategories.js
import { useQuery } from "@tanstack/react-query";
import { getSubCategoriesLists } from "../../api/subCategories";

const categoriesKey = (params = {}) => ["subCategories", params];

export function useSubCategories(params = {}) {
  return useQuery({
    queryKey: categoriesKey(params),
    queryFn: () => getSubCategoriesLists(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    select: (payload: any) => {
      const items: any[] = Array.isArray(payload?.data) ? payload.data : [];

      const rows = items.map((it: any, idx: number) => ({
        id: it._id || it.id || idx,
        name: it.name || "",
        ar_name: it.ar_name || "",
        slug: it.slug || "",
        isActive: it.isActive || "",
        image: it.image || it.imageUrl || "",
        parent: it?.category || null,
      }));

      return {
        rows,
        success: payload?.success ?? true,
        message: payload?.message ?? "",
      };
    },
  });
}
