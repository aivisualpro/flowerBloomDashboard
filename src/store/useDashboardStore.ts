import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL as BASE } from '@/config';

interface DashboardState {
  products: any[];
  orders: any[];
  customers: any[];
  categories: any[];
  colors: any[];
  occasions: any[];
  packaging: any[];
  recipes: any[];
  brands: any[];
  recipients: any[];
  subCategories: any[];
  categoryTypes: any[];
  isInitialized: boolean;
  isLoading: boolean;
  
  init: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  products: [],
  orders: [],
  customers: [],
  categories: [],
  colors: [],
  occasions: [],
  packaging: [],
  recipes: [],
  brands: [],
  recipients: [],
  subCategories: [],
  categoryTypes: [],
  isInitialized: false,
  isLoading: false,

  init: async () => {
    if (get().isInitialized || get().isLoading) return;
    set({ isLoading: true });

    try {
      const [
        prodRes, ordRes, custRes, catRes, 
        colRes, occRes, packRes, recRes,
        brandRes, recipRes, subcatRes, catTypesRes
      ] = await Promise.allSettled([
        axios.get(`${BASE}/product/lists`),
        axios.get(`${BASE}/orders/lists`),
        axios.get(`${BASE}/user/lists`), // Changed from /user/customer/lists to /user/lists to fix 404
        axios.get(`${BASE}/category/lists`),
        axios.get(`${BASE}/color/lists`),
        axios.get(`${BASE}/occasion/lists`),
        axios.get(`${BASE}/packaging/lists`),
        Promise.reject('no recipe API'), // recipe API route not yet created
        axios.get(`${BASE}/brand/lists`),
        axios.get(`${BASE}/recipient/lists`),
        axios.get(`${BASE}/subCategory/lists`),
        axios.get(`${BASE}/categoryType/lists`)
      ]);

      const getSafeData = (res: any) => {
        if (res.status !== 'fulfilled' || !res.value?.data?.data) return [];
        const raw = Array.isArray(res.value.data.data) ? res.value.data.data : res.value.data.data.rows || [];
        // Normalize MongoDB _id → id so all views can use item.id
        return raw.map((item: any) => ({ ...item, id: item.id || item._id }));
      };

      set({
        products: getSafeData(prodRes),
        orders: getSafeData(ordRes),
        customers: getSafeData(custRes),
        categories: getSafeData(catRes),
        colors: getSafeData(colRes),
        occasions: getSafeData(occRes),
        packaging: getSafeData(packRes),
        recipes: getSafeData(recRes),
        brands: getSafeData(brandRes),
        recipients: getSafeData(recipRes),
        subCategories: getSafeData(subcatRes),
        categoryTypes: getSafeData(catTypesRes),
        isInitialized: true,
        isLoading: false
      });
    } catch (e) {
      console.error("Dashboard Prefetch Error", e);
      set({ isLoading: false });
    }
  },

  refresh: async () => {
    set({ isInitialized: false });
    await get().init();
  }
}));
