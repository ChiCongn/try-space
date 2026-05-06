# TrySpace AR-First Frontend Implementation Roadmap

Roadmap này bám theo BA nhưng giới hạn phạm vi hiện tại là **frontend-only React/Vite**. Ưu tiên số 1 là làm được trải nghiệm 3D/AR thuyết phục trước, sau đó mới mở rộng catalog, cart, save/share và polish.

Cấu trúc chuẩn của repo nằm ở [00-project-structure.md](./00-project-structure.md). Tất cả phase bên dưới giữ app Vite ở root, không tạo backend, Prisma, Express hoặc monorepo.

## AR-First Delivery Strategy

Thứ tự triển khai:

1. **Foundation tối thiểu**: dọn template Vite và tạo khung app đủ để gắn AR.
2. **AR vertical slice**: một sản phẩm mẫu, 3D viewer, nút AR, fallback, loading/error.
3. **AR product experience**: variant màu/vật liệu, thông số kích thước, CTA thử trong phòng.
4. **Catalog xung quanh AR**: danh sách/search/filter chỉ sau khi AR hoạt động.
5. **Cart + saved designs mock**: localStorage để hoàn thiện demo frontend.
6. **PWA + demo polish**: manifest, checklist thiết bị, demo script.

## Phase 0 - Frontend Foundation

**Branch:** `feat/frontend-foundation`

**Mục tiêu:** Chuẩn hóa cấu trúc React/Vite ở root repo, bỏ template Vite và tạo nền app cho AR-first demo.

**Files cần tạo/chỉnh:**

```text
src/app/App.tsx
src/app/routes.tsx
src/app/providers.tsx
src/components/layout/AppShell.tsx
src/components/ui/Button.tsx
src/components/ui/LoadingState.tsx
src/components/ui/EmptyState.tsx
src/shared/lib/storage.ts
src/shared/lib/money.ts
src/styles/index.css
src/main.tsx
src/App.tsx                 # có thể xóa hoặc chuyển nội dung sang src/app/App.tsx
src/App.css                 # có thể xóa sau khi chuyển styles
README.md
```

**Tính năng:**

- AppShell đơn giản có header, vùng nội dung chính và trạng thái responsive.
- Route/view switching nhẹ bằng React state hoặc URL hash, chưa cần React Router nếu chưa cần.
- Chuẩn bị layout cho màn hình AR demo.

**Acceptance criteria:**

- Không còn UI template Vite.
- App chạy bằng `npm run dev`.
- `npm run lint` pass.
- `npm run build` pass.

## Phase 1 - AR Vertical Slice

**Branch:** `feat/ar-vertical-slice`

**User stories:** US-01, US-03, US-04

**Mục tiêu:** Làm được demo 3D/AR sớm nhất với một sản phẩm mẫu.

**Files cần tạo/chỉnh:**

```text
src/features/ar/components/ModelViewer.tsx
src/features/ar/components/ArSupportNotice.tsx
src/features/ar/components/ArDemoPanel.tsx
src/features/ar/hooks/useModelViewer.ts
src/features/ar/types/model-viewer.d.ts
src/features/products/data/featuredProduct.ts
src/features/products/types.ts
src/features/products/pages/ArDemoPage.tsx
src/app/routes.tsx
public/models/
public/posters/
```

**Dependencies dự kiến:**

```bash
npm install @google/model-viewer three
npm install -D @types/three
```

**Tính năng:**

- Hiển thị một model GLB bằng `@google/model-viewer`.
- Bật AR modes: `webxr scene-viewer quick-look`.
- Desktop fallback là 3D orbit viewer.
- Loading, error, poster và retry state.
- Hiển thị thông số kích thước để nhấn mạnh tỉ lệ thật.

**Acceptance criteria:**

- Desktop xem được 3D viewer, canvas/model không blank.
- Mobile có nút vào AR khi browser hỗ trợ.
- Browser không hỗ trợ AR vẫn xem được 3D viewer.
- Model load lỗi không crash UI.
- Có checklist test thủ công cho Chrome desktop, Android Chrome, iOS Safari.

## Phase 2 - AR Product Experience

**Branch:** `feat/ar-product-experience`

**User stories:** US-02, US-10

**Mục tiêu:** Biến AR vertical slice thành trải nghiệm sản phẩm có thể demo.

**Files cần tạo/chỉnh:**

```text
src/features/ar/components/ArActionBar.tsx
src/features/ar/components/ArPlacementTips.tsx
src/features/products/components/VariantSelector.tsx
src/features/products/components/ProductSpecs.tsx
src/features/products/components/ProductHero.tsx
src/features/products/pages/ProductTryOnPage.tsx
src/features/products/data/products.ts
src/shared/lib/ids.ts
```

**Tính năng:**

- Chọn màu/vật liệu variant và phản ánh ngay trong viewer hoặc UI.
- Nếu asset chưa hỗ trợ đổi material runtime, lưu variant state và hiển thị poster/swatch/price đúng.
- CTA chính: "Thử trong phòng".
- CTA phụ: "Lưu thiết kế demo" và "Thêm vào giỏ" có thể là placeholder nếu cart chưa làm.
- Hướng dẫn ngắn khi camera/AR không khả dụng.

**Acceptance criteria:**

- Variant selection không reset model/viewer.
- UI mobile không che nút AR hoặc thông tin quan trọng.
- Tất cả CTA có trạng thái disabled/placeholder rõ ràng nếu feature sau chưa có.
- `npm run lint` và `npm run build` pass.

## Phase 3 - Product Catalog Around AR

**Branch:** `feat/product-catalog`

**User stories:** US-06, US-07, US-08, US-09

**Mục tiêu:** Mở rộng từ AR product demo thành catalog để người dùng chọn sản phẩm trước khi thử AR.

**Files cần tạo/chỉnh:**

```text
src/features/products/data/products.ts
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
- Product detail tái sử dụng AR viewer/variant từ Phase 1-2.

**Acceptance criteria:**

- Responsive từ 375px đến desktop.
- Empty state khi filter không có kết quả.
- Product detail mở được từ catalog.
- Từ product detail vào được AR/3D experience.

## Phase 4 - Cart Flow

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

- Add to cart từ product detail/AR product panel.
- Lưu product, variant, quantity, price addon.
- Update quantity, remove item, clear cart.
- Tổng tiền và checkout placeholder.
- Persist localStorage cho frontend-only demo.

**Acceptance criteria:**

- Reload page không mất giỏ hàng.
- Tổng tiền đúng khi đổi quantity/variant.
- Không cho quantity nhỏ hơn 1.
- Cart không phá luồng AR chính.

## Phase 5 - Mock Auth And Saved Designs

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

## Phase 6 - PWA And Demo Polish

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
- Demo script ưu tiên AR happy path.
- Checklist test thiết bị cho desktop, Android Chrome, iOS Safari.

**Acceptance criteria:**

- Lighthouse PWA cơ bản pass hoặc ghi rõ ngoại lệ HTTPS/local.
- Demo AR happy path chạy được trong 3-5 phút.
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
