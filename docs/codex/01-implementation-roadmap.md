# TrySpace Implementation Roadmap

Roadmap này bám theo BA: MVP tập trung luồng `Khám phá -> Xem AR -> Tùy biến -> Lưu -> Mua`. Thứ tự ưu tiên là Must Have trước, các phần Could Have chỉ làm sau khi demo chính ổn định.

## Phase 0 - Project Foundation

**Branch:** `feat/project-foundation`

**Mục tiêu:** Chuẩn hóa cấu trúc project để Codex và Git làm việc lâu dài không rối.

**Files cần tạo/chỉnh:**

```text
apps/web/                     # di chuyển app Vite hiện tại vào đây
apps/api/                     # scaffold Express TypeScript
packages/shared/              # type/schema dùng chung
package.json                  # npm workspaces + scripts root
tsconfig.base.json
.env.example
.gitignore
docker-compose.yml
README.md
```

**Lệnh đề xuất:**

```bash
git switch dev
git pull --ff-only
git switch -c feat/project-foundation
npm install
npm run lint
npm run build
git add .
git commit -m "chore: set up tryspace monorepo foundation"
git switch dev
git merge --no-ff feat/project-foundation
```

**Acceptance criteria:**

- `npm install` cài dependency cho workspaces.
- `npm run dev:web` chạy frontend.
- `npm run dev:api` chạy API health check.
- `npm run lint` và `npm run build` pass.

## Phase 1 - Product Catalog UI

**Branch:** `feat/product-catalog`

**User stories:** US-06, US-07, US-08, US-09

**Files cần tạo/chỉnh:**

```text
apps/web/src/data/products.ts
apps/web/src/types/product.ts
apps/web/src/components/layout/AppShell.tsx
apps/web/src/components/product/ProductGrid.tsx
apps/web/src/components/product/ProductCard.tsx
apps/web/src/components/product/ProductFilters.tsx
apps/web/src/pages/ProductCatalogPage.tsx
apps/web/src/pages/ProductDetailPage.tsx
apps/web/src/App.tsx
apps/web/src/index.css
```

**Tính năng:**

- Danh mục ghế, bàn, kệ sách.
- Search theo tên/mô tả.
- Filter theo category, giá, màu, vật liệu.
- Sort giá tăng/giảm, mới nhất, phổ biến.
- Trang chi tiết sản phẩm có dimensions, variant, CTA AR và cart.

**Acceptance criteria:**

- Responsive từ 375px đến desktop.
- Empty state khi filter không có kết quả.
- Không còn nội dung template Vite.
- Build pass.

## Phase 2 - 3D Viewer And AR Entry

**Branch:** `feat/ar-viewer`

**User stories:** US-01, US-02, US-03, US-04, US-10

**Files cần tạo/chỉnh:**

```text
apps/web/src/components/ar/ModelViewer.tsx
apps/web/src/components/ar/ArSupportNotice.tsx
apps/web/src/components/product/VariantSelector.tsx
apps/web/src/hooks/useModelViewer.ts
apps/web/src/types/model-viewer.d.ts
apps/web/public/models/
apps/web/public/posters/
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
- Variant đổi màu cơ bản qua material color hoặc swap model/texture nếu asset hỗ trợ.
- Fallback 3D viewer trên desktop/browser không hỗ trợ AR.

**Acceptance criteria:**

- Desktop xem được 3D viewer.
- Mobile hiển thị nút AR khi browser hỗ trợ.
- Nếu model lỗi, UI không crash.
- Có test hoặc checklist thủ công cho Chrome desktop và mobile.

## Phase 3 - Cart Flow

**Branch:** `feat/cart-flow`

**User stories:** US-17, US-18, US-19

**Files cần tạo/chỉnh:**

```text
apps/web/src/store/cartStore.ts
apps/web/src/components/cart/CartDrawer.tsx
apps/web/src/components/cart/CartLineItem.tsx
apps/web/src/pages/CartPage.tsx
apps/web/src/pages/CheckoutPage.tsx
apps/web/src/utils/money.ts
```

**Tính năng:**

- Add to cart từ product detail và AR/product panel.
- Lưu variant, quantity, price addon.
- Update quantity, remove item, clear cart.
- Tổng tiền và checkout placeholder.
- Persist localStorage cho guest.

**Acceptance criteria:**

- Reload page không mất giỏ hàng.
- Tổng tiền đúng khi đổi quantity/variant.
- Không cho quantity nhỏ hơn 1.

## Phase 4 - API, Database, And Auth

**Branch:** `feat/api-auth`

**User stories:** US-15, US-16

**Files cần tạo/chỉnh:**

```text
apps/api/src/server.ts
apps/api/src/app.ts
apps/api/src/routes/auth.routes.ts
apps/api/src/routes/product.routes.ts
apps/api/src/middleware/auth.ts
apps/api/src/middleware/errorHandler.ts
apps/api/src/services/auth.service.ts
apps/api/src/prisma/schema.prisma
apps/api/src/prisma/seed.ts
packages/shared/src/auth.ts
packages/shared/src/product.ts
```

**Dependencies dự kiến:**

```bash
npm install express cors helmet cookie-parser jsonwebtoken bcrypt zod @prisma/client
npm install -D prisma tsx @types/express @types/cors @types/cookie-parser @types/jsonwebtoken @types/bcrypt
```

**Tính năng:**

- Health endpoint.
- Prisma schema theo BA.
- Seed category/product/variant.
- Register/login/logout/me.
- JWT access token + refresh token qua httpOnly cookie nếu deploy cùng domain; nếu không, cấu hình CORS credentials rõ ràng.
- Validation bằng Zod.

**Acceptance criteria:**

- `GET /api/v1/health` trả OK.
- Register/login lỗi đúng status code.
- Password hash bằng bcrypt.
- Không log secret/token.

## Phase 5 - API Integration

**Branch:** `feat/web-api-integration`

**User stories:** US-06 đến US-19 tùy module đã có UI.

**Files cần tạo/chỉnh:**

```text
apps/web/src/services/apiClient.ts
apps/web/src/services/productApi.ts
apps/web/src/services/authApi.ts
apps/web/src/services/cartApi.ts
apps/web/src/store/authStore.ts
apps/web/src/hooks/useAuth.ts
```

**Tính năng:**

- Product catalog lấy từ API thay vì static data.
- Auth form kết nối API.
- Cart đồng bộ local guest và user sau login nếu còn thời gian.
- Loading/error states thống nhất.

**Acceptance criteria:**

- API down thì frontend có lỗi thân thiện.
- Token/session hết hạn không làm UI crash.
- Build web/api pass.

## Phase 6 - Save And Share Design

**Branch:** `feat/save-share-design`

**User stories:** US-11, US-12, US-13

**Files cần tạo/chỉnh:**

```text
apps/web/src/store/designStore.ts
apps/web/src/services/designApi.ts
apps/web/src/pages/DesignsPage.tsx
apps/web/src/pages/SharedDesignPage.tsx
apps/web/src/components/design/DesignSummary.tsx
apps/api/src/routes/design.routes.ts
apps/api/src/services/design.service.ts
```

**Tính năng:**

- Lưu config JSON: product, variant, transform, thumbnail optional.
- Tạo share token public.
- Xem link `/designs/:shareToken` không cần login.
- Danh sách thiết kế của user.

**Acceptance criteria:**

- User không đăng nhập được yêu cầu login khi save.
- Share link mở được ở browser khác.
- Không lộ designs riêng tư qua API list.

## Phase 7 - PWA, Polish, And Demo Readiness

**Branch:** `feat/pwa-demo-polish`

**Files cần tạo/chỉnh:**

```text
apps/web/public/manifest.webmanifest
apps/web/public/icons/
apps/web/src/components/layout/InstallPrompt.tsx
apps/web/src/pages/DemoScriptPage.tsx
docs/demo-script.md
docs/test-checklist.md
```

**Tính năng:**

- Manifest, icon, theme color.
- Performance pass cơ bản.
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

