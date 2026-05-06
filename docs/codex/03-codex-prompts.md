# Codex Prompt Library

Copy từng prompt theo đúng phase. Mỗi prompt đã bao gồm yêu cầu Git: tạo nhánh feature, implement, test, add, commit. Khi dùng prompt, thay phần trong `<...>`.

## Prompt Khởi Động Phiên Làm Việc

```text
Bạn là Codex trong repo TrySpace. Hãy đọc:
- docs/TrySpace_BA_Document.md
- docs/codex/README.md
- docs/codex/01-implementation-roadmap.md
- docs/codex/02-git-workflow.md

Yêu cầu làm việc:
- Kiểm tra git status trước.
- Luôn giữ main stable, phát triển từ dev.
- Tạo nhánh feat/<tên-task> từ dev.
- Implement đúng scope task, không refactor ngoài phạm vi.
- Chạy lint/build/test phù hợp.
- git add và git commit sau khi hoàn tất.
- Nếu test không chạy được, ghi rõ nguyên nhân và vẫn commit khi thay đổi hợp lệ.

Task hiện tại: <mô tả task>.
```

## Phase 0 - Foundation Prompt

```text
Hãy triển khai Phase 0 Project Foundation cho TrySpace.

Branch: feat/project-foundation, tạo từ dev.

Mục tiêu:
- Chuyển repo từ Vite root hiện tại sang npm workspaces:
  - apps/web cho React + Vite hiện có.
  - apps/api cho Express TypeScript API có health endpoint.
  - packages/shared cho type/schema dùng chung.
- Cập nhật package scripts root:
  - dev:web
  - dev:api
  - build
  - lint
- Thêm tsconfig.base.json nếu cần.
- Cập nhật README.md hướng dẫn chạy local.
- Thêm docker-compose.yml cho PostgreSQL local.
- Không implement nghiệp vụ sản phẩm/auth ở phase này.

Kiểm tra:
- npm install nếu dependency thay đổi.
- npm run lint
- npm run build
- Nếu có API, chạy kiểm tra health endpoint bằng cách khởi động server nếu phù hợp.

Sau cùng:
- git status --short
- git add các file đã tạo/chỉnh
- git commit -m "chore: set up tryspace monorepo foundation"
```

## Phase 1 - Product Catalog Prompt

```text
Hãy triển khai Phase 1 Product Catalog UI cho TrySpace.

Branch: feat/product-catalog, tạo từ dev mới nhất.

Nguồn yêu cầu:
- BA sections 6, 7, 8.2, 14.
- docs/codex/01-implementation-roadmap.md Phase 1.

Mục tiêu:
- Thay UI template Vite bằng app TrySpace thực tế.
- Tạo catalog sản phẩm nội thất mẫu cho ghế, bàn, kệ sách.
- Có search, filter category/price/color/material, sort.
- Có product detail page với dimensions, price, variants, CTA "Thử trong phòng" và "Thêm vào giỏ".
- Responsive từ mobile 375px đến desktop.

Yêu cầu kỹ thuật:
- Dùng TypeScript strict-friendly.
- Tách components theo product/layout/pages.
- Không gọi API thật ở phase này; dùng data local có shape gần API.
- UI không dùng landing page marketing làm màn hình chính; vào thẳng trải nghiệm catalog/product.

Kiểm tra:
- npm run lint
- npm run build
- Test thủ công search/filter/empty state.

Commit:
- git add .
- git commit -m "feat: add product catalog experience"
```

## Phase 2 - AR Viewer Prompt

```text
Hãy triển khai Phase 2 3D Viewer và AR Entry.

Branch: feat/ar-viewer, tạo từ dev mới nhất.

Mục tiêu:
- Cài @google/model-viewer và three nếu chưa có.
- Tạo ModelViewer React component dùng custom element <model-viewer>.
- Hỗ trợ ar, ar-modes="webxr scene-viewer quick-look", camera-controls, poster/loading/error states.
- Tích hợp vào product detail.
- Tạo VariantSelector cho đổi màu/vật liệu; nếu model không hỗ trợ đổi material runtime thì lưu state variant và phản ánh UI/giá trước.
- Có fallback message khi AR không khả dụng.

Files tham khảo roadmap Phase 2.

Kiểm tra:
- npm run lint
- npm run build
- Mở app local và kiểm tra 3D viewer không blank trên desktop.
- Ghi checklist thủ công nếu không có thiết bị mobile trong môi trường hiện tại.

Commit:
- git add .
- git commit -m "feat: add ar model viewer"
```

## Phase 3 - Cart Flow Prompt

```text
Hãy triển khai Phase 3 Cart Flow.

Branch: feat/cart-flow, tạo từ dev mới nhất.

Mục tiêu:
- Tạo cart store có persist localStorage.
- Add to cart từ product detail, lưu productId, variantId, name, price, quantity.
- Cart drawer hoặc cart page cho update quantity, remove item, clear cart.
- Tính subtotal/total bằng utility money.
- Checkout placeholder không thanh toán thật.

Kiểm tra:
- npm run lint
- npm run build
- Test thủ công reload vẫn giữ cart, quantity không nhỏ hơn 1.

Commit:
- git add .
- git commit -m "feat: add cart flow"
```

## Phase 4 - API And Auth Prompt

```text
Hãy triển khai Phase 4 API, Database, Auth.

Branch: feat/api-auth, tạo từ dev mới nhất.

Mục tiêu:
- Express TypeScript API trong apps/api.
- Prisma schema theo BA: User, Product, ProductVariant, Category, Design, DesignItem, CartItem.
- Seed dữ liệu mẫu tối thiểu cho 3 category và một số products.
- Auth endpoints:
  - POST /api/v1/auth/register
  - POST /api/v1/auth/login
  - POST /api/v1/auth/logout
  - GET /api/v1/auth/me
- Product endpoints:
  - GET /api/v1/products
  - GET /api/v1/products/:id
  - GET /api/v1/categories
- Zod validation, bcrypt hash, JWT, error handler chuẩn.
- Không hardcode secrets; dùng .env.example.

Kiểm tra:
- npm run lint
- npm run build
- prisma validate
- Nếu DB local có sẵn: prisma migrate dev và seed.
- Test API bằng curl hoặc script tối thiểu.

Commit:
- git add .
- git commit -m "feat: add api auth and product services"
```

## Phase 5 - Web API Integration Prompt

```text
Hãy triển khai Phase 5 Web API Integration.

Branch: feat/web-api-integration, tạo từ dev mới nhất.

Mục tiêu:
- Tạo apiClient với base URL từ env.
- Kết nối product catalog/detail với API.
- Kết nối login/register/me/logout.
- Tạo auth store/hook.
- Loading, error, retry states rõ ràng.
- Nếu API down, app vẫn hiển thị thông báo lỗi và không crash.

Kiểm tra:
- npm run lint
- npm run build
- Chạy web + api local và test happy path product + auth.

Commit:
- git add .
- git commit -m "feat: connect web app to api"
```

## Phase 6 - Save And Share Prompt

```text
Hãy triển khai Phase 6 Save and Share Design.

Branch: feat/save-share-design, tạo từ dev mới nhất.

Mục tiêu:
- API designs: list user designs, create design, get public design by shareToken, update/delete owner design.
- Web pages: DesignsPage, SharedDesignPage.
- Save design từ product/AR context: product, variant, transform JSON, thumbnail optional.
- Public share link xem được không cần login.
- User chưa login khi save được điều hướng tới login hoặc modal auth.

Kiểm tra:
- npm run lint
- npm run build
- Test create design, open share link, unauthorized access.

Commit:
- git add .
- git commit -m "feat: add save and share designs"
```

## Phase 7 - PWA And Demo Prompt

```text
Hãy triển khai Phase 7 PWA, polish, demo readiness.

Branch: feat/pwa-demo-polish, tạo từ dev mới nhất.

Mục tiêu:
- Thêm manifest.webmanifest, icons, theme color.
- Cải thiện loading states, empty states, mobile layout.
- Tạo docs/demo-script.md cho luồng demo 5 phút.
- Tạo docs/test-checklist.md cho Chrome desktop, Android Chrome, iOS Safari.
- Chạy Lighthouse hoặc ghi rõ nếu môi trường không hỗ trợ.

Kiểm tra:
- npm run lint
- npm run build
- Manual test checklist.

Commit:
- git add .
- git commit -m "feat: prepare pwa demo experience"
```

## Prompt Review Trước Khi Merge Vào Dev

```text
Hãy review nhánh hiện tại trước khi merge vào dev.

Yêu cầu:
- Đóng vai code reviewer: ưu tiên bug, regression, thiếu test, rủi ro bảo mật/performance.
- Kiểm tra git diff từ dev tới HEAD.
- Chạy lint/build/test phù hợp.
- Nếu có lỗi nhỏ, tự fix và commit bổ sung.
- Nếu có lỗi lớn hoặc scope sai, dừng và báo rõ.
- Khi pass, merge --no-ff nhánh hiện tại vào dev.
```

## Prompt Release Dev To Main

```text
Hãy chuẩn bị release TrySpace từ dev sang main.

Yêu cầu:
- Checkout dev, chạy full lint/build/test.
- Đọc docs/test-checklist.md và xác nhận các mục có thể kiểm tra trong môi trường hiện tại.
- Nếu pass, checkout main và merge --no-ff dev.
- Tạo tag v0.1.0 nếu đây là release MVP đầu tiên.
- Không merge nếu có lỗi build/lint nghiêm trọng.
```

