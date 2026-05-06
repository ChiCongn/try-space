# Codex Prompt Library

Copy từng prompt theo đúng phase. Mỗi prompt đã bao gồm yêu cầu Git: tạo nhánh feature, implement, test, add, commit. Khi dùng prompt, thay phần trong `<...>`.

## Prompt Khởi Động Phiên Làm Việc

```text
Bạn là Codex trong repo TrySpace frontend-only. Hãy đọc:
- docs/TrySpace_BA_Document.md
- docs/codex/README.md
- docs/codex/00-project-structure.md
- docs/codex/01-implementation-roadmap.md
- docs/codex/02-git-workflow.md

Yêu cầu làm việc:
- Kiểm tra git status trước.
- Luôn giữ main stable, phát triển từ dev.
- Tạo nhánh feat/<tên-task> từ dev.
- Implement đúng scope task, không refactor ngoài phạm vi.
- Giữ cấu trúc React/Vite root chuẩn, không tạo monorepo, backend, Prisma hoặc Express.
- Chạy lint/build/test phù hợp.
- git add và git commit sau khi hoàn tất.
- Nếu test không chạy được, ghi rõ nguyên nhân và vẫn commit khi thay đổi hợp lệ.

Task hiện tại: <mô tả task>.
```

## Phase 0 - Frontend Foundation Prompt

```text
Hãy triển khai Phase 0 Frontend Foundation cho TrySpace.

Branch: feat/frontend-foundation, tạo từ dev.

Mục tiêu:
- Giữ app Vite ở root repo, không tạo apps/ hoặc packages/.
- Chuyển UI template Vite thành cấu trúc React frontend chuẩn:
  - src/app
  - src/components/layout
  - src/components/ui
  - src/features
  - src/shared
  - src/styles
- Tạo AppShell cơ bản và route/view switching nhẹ nếu cần.
- Cập nhật main.tsx để dùng src/app/App.tsx và src/styles/index.css.
- Cập nhật README.md hướng dẫn chạy frontend.
- Không implement product catalog đầy đủ ở phase này.
- Không thêm backend/API/Prisma.

Kiểm tra:
- npm run lint
- npm run build

Sau cùng:
- git status --short
- git add các file đã tạo/chỉnh
- git commit -m "chore: set up frontend structure"
```

## Phase 1 - Product Catalog Prompt

```text
Hãy triển khai Phase 1 Product Catalog UI cho TrySpace.

Branch: feat/product-catalog, tạo từ dev mới nhất.

Nguồn yêu cầu:
- BA sections 6, 7, 8.2, 14.
- docs/codex/00-project-structure.md
- docs/codex/01-implementation-roadmap.md Phase 1.

Mục tiêu:
- Tạo catalog sản phẩm nội thất mẫu cho ghế, bàn, kệ sách.
- Có search, filter category/price/color/material, sort.
- Có product detail page với dimensions, price, variants, CTA "Thử trong phòng" và "Thêm vào giỏ".
- Responsive từ mobile 375px đến desktop.

Yêu cầu kỹ thuật:
- Dùng TypeScript strict-friendly.
- Đặt code products trong src/features/products.
- Đặt UI primitive dùng chung trong src/components/ui.
- Không gọi API thật; dùng static data/mock trong frontend.
- UI không dùng landing page marketing làm màn hình chính; vào thẳng trải nghiệm catalog/product.

Kiểm tra:
- npm run lint
- npm run build
- Test thủ công search/filter/empty state/product detail.

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
- Đặt AR code trong src/features/ar và VariantSelector trong src/features/products.

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
- Tạo cart store trong src/features/cart/store có persist localStorage.
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

## Phase 4 - Mock Auth And Saved Designs Prompt

```text
Hãy triển khai Phase 4 Mock Auth And Saved Designs.

Branch: feat/mock-auth-designs, tạo từ dev mới nhất.

Mục tiêu:
- Tạo auth mock ở src/features/auth và src/shared/mocks/mockAuth.ts.
- Register/login/logout dùng localStorage/session state, không xử lý password thật.
- Tạo saved designs ở src/features/designs.
- Save design từ product/AR context: product, variant, transform JSON giả lập, thumbnail optional.
- Tạo share token local và SharedDesignPage.
- User chưa login khi save được điều hướng tới auth mock hoặc modal auth.
- Không tạo backend, JWT thật, bcrypt, Prisma hoặc API server.

Kiểm tra:
- npm run lint
- npm run build
- Test thủ công login/register/logout, save design, open shared design route.

Commit:
- git add .
- git commit -m "feat: add mock auth and saved designs"
```

## Phase 5 - PWA And Demo Prompt

```text
Hãy triển khai Phase 5 PWA, polish, demo readiness.

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
- Đóng vai code reviewer: ưu tiên bug, regression, thiếu test, rủi ro performance/accessibility.
- Kiểm tra git diff từ dev tới HEAD.
- Chạy lint/build/test phù hợp.
- Nếu có lỗi nhỏ, tự fix và commit bổ sung.
- Nếu có lỗi lớn hoặc scope sai, dừng và báo rõ.
- Khi pass, merge --no-ff nhánh hiện tại vào dev.
```

## Prompt Release Dev To Main

```text
Hãy chuẩn bị release TrySpace frontend từ dev sang main.

Yêu cầu:
- Checkout dev, chạy full lint/build/test.
- Đọc docs/test-checklist.md và xác nhận các mục có thể kiểm tra trong môi trường hiện tại.
- Nếu pass, checkout main và merge --no-ff dev.
- Tạo tag v0.1.0 nếu đây là release MVP đầu tiên.
- Không merge nếu có lỗi build/lint nghiêm trọng.
```
