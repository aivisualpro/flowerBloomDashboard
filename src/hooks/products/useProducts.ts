import { useQuery } from "@tanstack/react-query";
import { getProductsLists, getProductNames } from "../../api/products";
import { Product } from "../../types";

const productsKey = (params: any = {}) => ["products", params];

export function useProducts(params: any = {}) {
  return useQuery({
    queryKey: productsKey(params),
    queryFn: () => getProductsLists(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    select: (payload: any) => {
      const items: Product[] = Array.isArray(payload?.data) ? payload.data : [];

      const rows = items.map((it, idx) => ({
        id: it._id || idx,
        featuredImage: it?.featuredImage || "",
        title: it.title || "",
        description: (it as any).description || "",
        price: it.price || 0,
        sku: it.sku || "",
        remainingStocks: (it as any).remainingStocks || 0,
        stockStatus: it.stockStatus || "in_stock",
        createdAt: (it as any).createdAt || "",
      }));

      return {
        rows,
        success: payload?.success ?? true,
        message: payload?.message ?? "",
      };
    },
  });
}

export function useProductNames() {
  return useQuery({
    queryKey: ["productNames"],
    queryFn: () => getProductNames(),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    select: (payload: any) => {
      const items = Array.isArray(payload?.data) ? payload.data : [];
      const rows = items.map((it: any) => ({
        _id: it._id,
        name: it.title || "",
      }));
      return {
        rows,
        success: payload?.success ?? true,
        message: payload?.message ?? "",
      };
    },
  });
}