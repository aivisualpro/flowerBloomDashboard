// src/api/categories.js
import axios from "axios";

// Build base once (no shared api instance)
import { API_BASE_URL as BASE } from 'config';
// const BASE = "http://localhost:5000/api/v1";

// ---- 1) LIST ----
export async function getOverviewCards() {
  const res = await axios.get(`${BASE}/analytics/overview`);
  return res.data;
}
export async function getSales() {
  const res = await axios.get(`${BASE}/analytics/sales`);
  return res.data;
}
export async function getCounts() {
  const res = await axios.get(`${BASE}/analytics/counts`);
  return res.data;
}