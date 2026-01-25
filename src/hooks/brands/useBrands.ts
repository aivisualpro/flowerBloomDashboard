// src/hooks/categories/useCategories.js
import { useQuery } from "@tanstack/react-query";
import { getBrandsLists } from "../../api/brands";

const categoriesKey = (params = {}) => ["brands", params];

interface BrandData {
  _id?: string;
  id?: string;
  name?: string;
  ar_name?: string;
  slug?: string;
  isActive?: boolean;
  logo?: string;
  image?: string;
  countryCode?: string;
}

export function useBrands(params = {}) {
  return useQuery({
    queryKey: categoriesKey(params),
    queryFn: () => getBrandsLists(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    select: (payload) => {
      const items = Array.isArray(payload?.data) ? payload.data : [];

      const rows = items.map((it: BrandData, idx: number) => ({
        id: it._id || it.id || idx,
        name: it.name || "",
        ar_name: it.ar_name || "",
        slug: it.slug || "",
        isActive: it.isActive || "",
        logo: it?.logo || it?.image || "",
        countryCode: it?.countryCode || "",
      }));

      return {
        rows,
        success: payload?.success ?? true,
        message: payload?.message ?? "",
      };
    },
  });
}
