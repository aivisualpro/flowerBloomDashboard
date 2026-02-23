// src/api/products.ts
import axios from "axios";

// Build base once (no shared api instance)
import { API_BASE_URL as BASE } from '@/config';

// ---- 1) LIST ----
export async function getProductsLists(params: any = {}) {
  // accepts: { stockStatus?, from?, to?, page?, limit? }
  const res = await axios.get(`${BASE}/product/lists`, { params });
  return res.data;
}

// ---- 2) NAMES ----
export async function getProductNames() {
  const res = await axios.get(`${BASE}/product/names`);
  return res.data;
}

// ---- 2) DETAIL ----
export async function getProductById(id: string) {
  const res = await axios.get(`${BASE}/product/lists/${id}`);
  return res.data?.data ?? res.data ?? {};
}

// ---- 3) CREATE ----
export async function createProduct(payload: any) {
  const res = await axios.post(`${BASE}/product`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 4) UPDATE ----
export async function updateProduct(id: string, payload: any) {
  const res = await axios.put(`${BASE}/product/update/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 5) DELETE ----
export async function deleteProduct(id: string) {
  const res = await axios.delete(`${BASE}/product/delete/${id}`);
  return res.data;
}
