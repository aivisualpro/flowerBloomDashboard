import { useQuery } from "@tanstack/react-query";
import { getCategoriesLists } from "../../api/categories";
import { Category } from "../../types";

const categoriesKey = (params: any = {}) => ["categories", params];

export function useCategories(params: any = {}) {
  return useQuery({
    queryKey: categoriesKey(params),
    queryFn: () => getCategoriesLists(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    select: (payload: any) => {
      const items: Category[] = Array.isArray(payload?.data) ? payload.data : [];

      const rows = items.map((it, idx) => ({
        id: it._id || idx,
        name: it.name || "",
        ar_name: it.ar_name || "",
        slug: it.slug || "",
        isActive: it.isActive,
        image: it.image || "",
      }));

      return {
        rows,
        success: payload?.success ?? true,
        message: payload?.message ?? "",
      };
    },
  });
}
