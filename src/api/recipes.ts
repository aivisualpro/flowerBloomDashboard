// src/api/recipes.ts
import axios from "axios";

// Build base once (no shared api instance)
import { API_BASE_URL as BASE } from '@/config';

// ---- 1) LIST ----
export async function getRecipesLists(params: any = {}) {
  // accepts: { from?, to?, page?, limit? }
  const res = await axios.get(`${BASE}/recipe/lists`, { params });
  return res.data;
}

// ---- 2) NAMES ----
export async function getRecipeNames() {
  const res = await axios.get(`${BASE}/recipe/names`);
  return res.data;
}

// ---- 2) DETAIL ----
export async function getRecipeById(id: string) {
  const res = await axios.get(`${BASE}/recipe/lists/${id}`);
  return res.data?.data ?? res.data ?? {};
}

// ---- 3) CREATE ----
export async function createRecipe(payload: any) {
  const res = await axios.post(`${BASE}/recipe`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 4) UPDATE ----
export async function updateRecipe(id: string, payload: any) {
  const res = await axios.put(`${BASE}/recipe/update/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 5) DELETE ----
export async function deleteRecipe(id: string) {
  const res = await axios.delete(`${BASE}/recipe/delete/${id}`);
  return res.data;
}