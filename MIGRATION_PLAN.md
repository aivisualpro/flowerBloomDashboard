
# Next.js Migration Plan

## 1. Project Reconfiguration
- [ ] Update `package.json`:
    - Remove `vite`, `@vitejs/plugin-react`, `react-router-dom`.
    - Add `next`, `typescript`, `@types/react`, `@types/node`, `@types/react-dom`.
    - Update scripts to `dev`, `build`, `start`, `lint`.
- [ ] Create `next.config.mjs` and `tsconfig.json`.

## 2. Directory Structure (App Router)
- [ ] Create `src/app` directory.
- [ ] Create Root Layout: `src/app/layout.tsx` (Global Providers, CSS).
- [ ] define Route Groups:
    - `(auth)`: Guest routes (Login, Register).
    - `(dashboard)`: Protected routes (Dashboard, Products, Orders, etc.).

## 3. Migration of Routes
### Auth Routes
- [ ] `src/app/(auth)/login/page.tsx` -> Replaces `views/auth/login.jsx`.
- [ ] `src/app/(auth)/register/page.tsx` -> Replaces `views/auth/register.jsx`.
- [ ] Create `src/app/(auth)/layout.tsx` for GuestLayout.

### Dashboard Routes
- [ ] Create `src/app/(dashboard)/layout.tsx` -> Replaces `layouts/AdminLayout`.
    - Replace `Outlet` with `children`.
- [ ] Migrate Dashboard Homepage to `src/app/(dashboard)/page.tsx`.
- [ ] Migrate `Products`:
    - `src/app/(dashboard)/products/page.tsx` (List)
    - `src/app/(dashboard)/products/add/page.tsx` (Add)
    - `src/app/(dashboard)/products/edit/[id]/page.tsx` (Edit)
- [ ] Migrate `Orders`, `Brands`, `Categories`... (Systematic copy & refactor).

## 4. Component Refactoring
- [ ] Convert `.jsx` files to `.tsx`.
- [ ] Replace `useNavigate` (react-router) with `useRouter` (next/navigation).
- [ ] Replace `NavLink` / `Link` (react-router) with `Link` (next/link).
- [ ] Remove `BrowserRouter`, `Routes`, `Route` from `App.jsx` / `index.jsx` (Obsolete).
- [ ] Fix `img` tags to `Image` component (Optional but recommended).
- [ ] Add `"use client"` directive to components using hooks (`useState`, `useEffect`).

## 5. API & Data Fetching
- [ ] Ensure `config.js` and API calls work in Next.js Environment (Done previously, but verify).
- [ ] Address `axios` errors (likely due to missing backend).

## 6. TypeScript Integration
- [ ] define basic interfaces for Data Models (Product, Order, etc.).
- [ ] Fix strict mode errors (or set `noImplicitAny: false` temporarily to get it running).

## 7. Cleanup
- [ ] Remove unused `vite.config.mjs`, `index.html`, `jsconfig.json`.
