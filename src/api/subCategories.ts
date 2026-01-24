// src/api/subCategories.ts
import axios from "axios";
import { SubCategory } from "@/types";

// Build base once (no shared api instance)
import { API_BASE_URL as BASE } from '@/config';

// ---- 1) LIST ----
export async function getSubCategoriesLists(params: any = {}) {
  const res = await axios.get(`${BASE}/subCategory/lists`, { params });
  return res.data;
}

// ---- 2) DETAIL ----
export async function getSubCategoryById(id: string) {
  const res = await axios.get(`${BASE}/subCategory/lists/${id}`);
  return res.data?.data ?? res.data ?? {};
}

// ---- 3) CREATE ----
export async function createSubCategory(payload: any) {
  const res = await axios.post(`${BASE}/subCategory`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 4) UPDATE ----
export async function updateSubCategory(id: string, payload: any) {
  const res = await axios.put(`${BASE}/subCategory/update/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 5) DELETE ----
export async function deleteSubCategory(id: string) {
  const res = await axios.delete(`${BASE}/subCategory/delete/${id}`);
  return res.data;
}
