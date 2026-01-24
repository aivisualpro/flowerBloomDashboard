// src/api/categoryTypes.ts
import axios from "axios";
import { CategoryType } from "@/types";

// Build base once (no shared api instance)
import { API_BASE_URL as BASE } from '@/config';

// ---- 1) LIST ----
export async function getCategoryTypesLists(params: any = {}) {
  const res = await axios.get(`${BASE}/categoryType/lists`, { params });
  return res.data;
}

// ---- 2) DETAIL ----
export async function getCategoryTypeById(id: string) {
  const res = await axios.get(`${BASE}/categoryType/lists/${id}`);
  return res.data?.data ?? res.data ?? {};
}

// ---- 3) CREATE ----
export async function createCategoryType(payload: Partial<CategoryType>) {
  const res = await axios.post(`${BASE}/categoryType`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// ---- 4) UPDATE ----
export async function updateCategoryType(id: string, payload: Partial<CategoryType>) {
  const res = await axios.put(`${BASE}/categoryType/update/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// ---- 5) DELETE ----
export async function deleteCategoryType(id: string) {
  const res = await axios.delete(`${BASE}/categoryType/delete/${id}`);
  return res.data;
}
