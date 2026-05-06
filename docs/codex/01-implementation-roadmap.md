# TrySpace Frontend Implementation Roadmap

Roadmap này bám theo BA nhưng giới hạn phạm vi hiện tại là **frontend-only React/Vite**. MVP tập trung luồng `Khám phá -> Xem AR -> Tùy biến -> Lưu -> Mua` bằng static data, mock service và localStorage.

Cấu trúc chuẩn của repo nằm ở [00-project-structure.md](./00-project-structure.md). Tất cả phase bên dưới mặc định giữ app Vite ở root, không chuyển sang monorepo.

## Phase 0 - Frontend Foundation

**Branch:** `feat/frontend-foundation`

**Mục tiêu:** Chuẩn hóa cấu trúc React/Vite ở root repo, bỏ template Vite và tạo nền app frontend.

**Files cần tạo/chỉnh:**

```text
src/app/App.tsx
src/app/routes.tsx
src/app/providers.tsx
src/components/layout/AppShell.tsx
src/components/ui/Button.tsx
src/shared/lib/storage.ts
src/shared/lib/money.ts
src/styles/index.css
src/main.tsx
src/App.tsx                 # có thể xóa hoặc chuyển nội dung sang src/app/App.tsx
src/App.css                 # có thể xóa sau khi chuyển styles
README.md
```

**Acceptance criteria:**

- Không còn UI template Vite.
- App chạy bằng `npm run dev`.
- `npm run lint` pass.
- `npm run build` pass.

## Phase 1 - Product Catalog UI

**Branch:** `feat/product-catalog`

**User stories:** US-06, US-07, US-08, US-09

**Files cần tạo/chỉnh:**

```text
src/features/products/data/products.ts
src/features/products/types.ts
src/features/products/store/productFilters.ts
src/features/products/components/ProductGrid.tsx
src/features/products/components/ProductCard.tsx
src/features/products/components/ProductFilters.tsx
src/features/products/components/ProductSearch.tsx
src/features/products/pages/ProductCatalogPage.tsx
src/features/products/pages/ProductDetailPage.tsx
src/app/routes.tsx
```

**Tính năng:**

- Danh mục ghế, bàn, kệ sách.
- Search theo tên/mô tả.
- Filter theo category, giá, màu, vật liệu.
- Sort giá tăng/giảm, mới nhất, phổ biến.
- Trang chi tiết sản phẩm có dimensions, price, variants, CTA AR và cart.

**Acceptance criteria:**

- Responsive từ 375px đến desktop.
- Empty state khi filter không có kết quả.
- Product detail mở được từ catalog.
- Build pass.

## Phase 2 - 3D Viewer And AR Entry

**Branch:** `feat/ar-viewer`

**User stories:** US-01, US-02, US-03, US-04, US-10

**Files cần tạo/chỉnh:**

```text
src/features/ar/components/ModelViewer.tsx
src/features/ar/components/ArSupportNotice.tsx
src/features/ar/hooks/useModelViewer.ts
src/features/ar/types/model-viewer.d.ts
src/features/products/components/VariantSelector.tsx
public/models/
public/posters/
```

**Dependencies dự kiến:**

```bash
npm install @google/model-viewer three
npm install -D @types/three
```

**Tính năng:**

- Hiển thị GLB bằng `model-viewer`.
- AR modes: `webxr scene-viewer quick-look`.
- Camera controls, auto rotate, poster, loading/error state.
- Variant đổi màu cơ bản qua material color hoặc phản ánh lựa chọn variant trong UI nếu asset chưa hỗ trợ runtime material.
- Fallback 3D viewer trên desktop/browser không hỗ trợ AR.

**Acceptance criteria:**

- Desktop xem được 3D viewer.
- Mobile hiển thị nút AR khi browser hỗ trợ.
- Nếu model lỗi, UI không crash.
- Có checklist thủ công cho Chrome desktop và mobile.

## Phase 3 - Cart Flow

**Branch:** `feat/cart-flow`

**User stories:** US-17, US-18, US-19

**Files cần tạo/chỉnh:**

```text
src/features/cart/types.ts
src/features/cart/store/cartStore.ts
src/features/cart/components/CartDrawer.tsx
src/features/cart/components/CartLineItem.tsx
src/features/cart/pages/CartPage.tsx
src/features/cart/pages/CheckoutPage.tsx
src/shared/lib/money.ts
```

**Tính năng:**

- Add to cart từ product detail và AR/product panel.
- Lưu variant, quantity, price addon.
- Update quantity, remove item, clear cart.
- Tổng tiền và checkout placeholder.
- Persist localStorage cho frontend-only demo.

**Acceptance criteria:**

- Reload page không mất giỏ hàng.
- Tổng tiền đúng khi đổi quantity/variant.
- Không cho quantity nhỏ hơn 1.

## Phase 4 - Mock Auth And Saved Designs

**Branch:** `feat/mock-auth-designs`

**User stories:** US-11, US-12, US-13, US-15, US-16

**Files cần tạo/chỉnh:**

```text
src/features/auth/types.ts
src/features/auth/store/authStore.ts
src/features/auth/components/LoginForm.tsx
src/features/auth/components/RegisterForm.tsx
src/features/auth/pages/AuthPage.tsx
src/features/designs/types.ts
src/features/designs/store/designStore.ts
src/features/designs/pages/DesignsPage.tsx
src/features/designs/pages/SharedDesignPage.tsx
src/features/designs/components/DesignSummary.tsx
src/shared/mocks/mockAuth.ts
src/shared/mocks/mockDesigns.ts
```

**Tính năng:**

- Auth mock bằng localStorage, không xử lý password thật.
- Chặn thao tác lưu design nếu chưa login mock.
- Lưu config design gồm product, variant, transform giả lập.
- Tạo share token local.
- Public shared design page có fallback demo data nếu token không có trong localStorage.

**Acceptance criteria:**

- Login/register/logout mock hoạt động.
- Save design yêu cầu login.
- Shared design route mở được trong cùng browser.
- UI nói rõ checkout/auth là demo nếu cần, không giả vờ có backend thật.

## Phase 5 - PWA And Demo Polish

**Branch:** `feat/pwa-demo-polish`

**Files cần tạo/chỉnh:**

```text
public/manifest.webmanifest
public/icons/
src/app/InstallPrompt.tsx
docs/demo-script.md
docs/test-checklist.md
```

**Tính năng:**

- Manifest, icon, theme color.
- Loading states, empty states, mobile polish.
- Demo script cho giảng viên/reviewer.
- Checklist test thiết bị.

**Acceptance criteria:**

- Lighthouse PWA cơ bản pass hoặc ghi rõ ngoại lệ HTTPS/local.
- Demo happy path chạy được trong 5 phút.
- `main` chỉ merge từ `dev` sau khi demo checklist pass.

## Release To Main

Chỉ làm khi `dev` đã ổn định:

```bash
git switch dev
npm run lint
npm run build
git switch main
git merge --no-ff dev
git tag v0.1.0
```
