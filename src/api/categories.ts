// src/api/categories.js
import axios from "axios";

// Build base once (no shared api instance)
import { API_BASE_URL as BASE } from '@/config';
// const BASE = "http://localhost:5000/api/v1";

// ---- 1) LIST ----
export async function getCategoriesLists(params: any = {}) {
  const res = await axios.get(`${BASE}/category/lists`, { params });
  return res.data;
}

// ---- 2) DETAIL ----
export async function getCategoryById(id: string) {
  const res = await axios.get(`${BASE}/category/lists`, { params: { id } });
  return res.data;
}

// ---- 3) CREATE ----
export async function createCategory(payload: any) {
  const res = await axios.post(`${BASE}/category`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 4) UPDATE ----
export async function updateCategory(id: string, payload: any) {
  const res = await axios.put(`${BASE}/category/update/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 5) DELETE ----
export async function deleteCategory(id: string) {
  const res = await axios.delete(`${BASE}/category/delete/${id}`);
  return res.data;
}
