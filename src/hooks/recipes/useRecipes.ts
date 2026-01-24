import { useQuery } from "@tanstack/react-query";
import { getRecipesLists, getRecipeNames } from "../../api/recipes";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  featuredImage: string;
  ingredients: string;
  instructions: string;
  status: string;
  createdAt: string;
}

const recipesKey = (params: any = {}) => ["recipes", params];

export function useRecipes(params: any = {}) {
  return useQuery({
    queryKey: recipesKey(params),
    queryFn: () => getRecipesLists(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    select: (payload: any) => {
      const items: Recipe[] = Array.isArray(payload?.data) ? payload.data : [];

      const rows = items.map((it, idx) => ({
        id: it._id || idx,
        featuredImage: it?.featuredImage || "",
        title: it.title || "",
        description: it.description || "",
        ingredients: it.ingredients || "",
        instructions: it.instructions || "",
        status: it.status || "active",
        createdAt: it.createdAt || "",
      }));

      return {
        rows,
        success: payload?.success ?? true,
        message: payload?.message ?? "",
      };
    },
  });
}

export function useRecipeNames() {
  return useQuery({
    queryKey: ["recipeNames"],
    queryFn: () => getRecipeNames(),
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