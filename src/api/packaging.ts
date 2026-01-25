// src/api/categories.js
import axios from "axios";

// Build base once (no shared api instance)
import { API_BASE_URL as BASE } from '@/config';

// ---- 1) LIST ----
export async function getPackagingLists() {
  const res = await axios.get(`${BASE}/packaging/lists`);
  return res.data;
}

// ---- 2) DETAIL ----
export async function getPackagingById(id: string) {
  const res = await axios.get(`${BASE}/packaging/lists/${id}`);
  return res.data?.data ?? res.data ?? {};
}

// ---- 3) CREATE ----
export async function createPackaging(payload: any) {
  const res = await axios.post(`${BASE}/packaging`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 4) UPDATE ----
export async function updatePackaging(id: string, payload: any) {
  const res = await axios.put(`${BASE}/packaging/update/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ---- 5) DELETE ----
export async function deletePackaging(id: string) {
  const res = await axios.delete(`${BASE}/packaging/delete/${id}`);
  return res.data;
}
