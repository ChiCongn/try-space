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
- Ưu tiên AR/3D experience trước catalog/cart/auth nếu có xung đột scope.
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
- Tạo AppShell cơ bản có chỗ đặt AR demo làm màn hình ưu tiên.
- Cập nhật main.tsx để dùng src/app/App.tsx và src/styles/index.css.
- Cập nhật README.md hướng dẫn chạy frontend.
- Không implement catalog/cart/auth đầy đủ ở phase này.
- Không thêm backend/API/Prisma.

Kiểm tra:
- npm run lint
- npm run build

Sau cùng:
- git status --short
- git add các file đã tạo/chỉnh
- git commit -m "chore: set up frontend structure"
```

## Phase 1 - AR Vertical Slice Prompt

```text
Hãy triển khai Phase 1 AR Vertical Slice cho TrySpace.

Branch: feat/ar-vertical-slice, tạo từ dev mới nhất.

Nguồn yêu cầu:
- BA sections UC-01, FR-AR, 13.2.
- docs/codex/00-project-structure.md
- docs/codex/01-implementation-roadmap.md Phase 1.

Mục tiêu:
- Cài @google/model-viewer và three nếu chưa có.
- Tạo một trang AR demo với một sản phẩm nội thất mẫu.
- Tạo ModelViewer React component dùng custom element <model-viewer>.
- Hỗ trợ ar, ar-modes="webxr scene-viewer quick-look", camera-controls, poster/loading/error states.
- Desktop fallback là 3D orbit viewer.
- Có ArSupportNotice và hướng dẫn khi AR/camera không khả dụng.
- Không cần catalog đầy đủ trong phase này.

Yêu cầu kỹ thuật:
- Đặt AR code trong src/features/ar.
- Đặt featured product data trong src/features/products/data.
- Nếu chưa có GLB hợp lệ, dùng path placeholder rõ ràng và UI error/retry không crash.
- Không hand-roll WebXR phức tạp; dùng @google/model-viewer trước.

Kiểm tra:
- npm run lint
- npm run build
- Mở app local và kiểm tra viewer không blank trên desktop nếu có asset hợp lệ.
- Ghi checklist thủ công cho Chrome desktop, Android Chrome, iOS Safari.

Commit:
- git add .
- git commit -m "feat: add ar vertical slice"
```

## Phase 2 - AR Product Experience Prompt

```text
Hãy triển khai Phase 2 AR Product Experience cho TrySpace.

Branch: feat/ar-product-experience, tạo từ dev mới nhất.

Mục tiêu:
- Tạo product try-on page tập trung vào 3D/AR.
- Thêm VariantSelector cho màu/vật liệu.
- Variant state phải ảnh hưởng UI/giá và nếu asset hỗ trợ thì đổi material/model trong viewer.
- Thêm ProductSpecs, ProductHero, ArActionBar, ArPlacementTips.
- CTA chính là "Thử trong phòng".
- CTA phụ "Thêm vào giỏ" và "Lưu thiết kế demo" có thể placeholder nếu feature sau chưa có.

Yêu cầu kỹ thuật:
- Tái sử dụng ModelViewer từ Phase 1.
- Không reset model khi đổi variant.
- Mobile layout phải giữ nút AR dễ bấm.
- Không tạo backend/API.

Kiểm tra:
- npm run lint
- npm run build
- Test thủ công đổi variant, AR CTA, fallback, loading/error.

Commit:
- git add .
- git commit -m "feat: build ar product experience"
```

## Phase 3 - Product Catalog Prompt

```text
Hãy triển khai Phase 3 Product Catalog UI cho TrySpace.

Branch: feat/product-catalog, tạo từ dev mới nhất.

Mục tiêu:
- Tạo catalog sản phẩm nội thất mẫu cho ghế, bàn, kệ sách.
- Có search, filter category/price/color/material, sort.
- Có product detail page với dimensions, price, variants.
- Product detail phải dẫn rõ về AR/3D experience đã có.
- Responsive từ mobile 375px đến desktop.

Yêu cầu kỹ thuật:
- Đặt code products trong src/features/products.
- Đặt UI primitive dùng chung trong src/components/ui.
- Không gọi API thật; dùng static data/mock trong frontend.
- Không làm landing page marketing; ưu tiên trải nghiệm chọn sản phẩm rồi thử AR.

Kiểm tra:
- npm run lint
- npm run build
- Test thủ công search/filter/empty state/product detail/try AR link.

Commit:
- git add .
- git commit -m "feat: add product catalog experience"
```

## Phase 4 - Cart Flow Prompt

```text
Hãy triển khai Phase 4 Cart Flow.

Branch: feat/cart-flow, tạo từ dev mới nhất.

Mục tiêu:
- Tạo cart store trong src/features/cart/store có persist localStorage.
- Add to cart từ product detail và AR product panel.
- Lưu productId, variantId, name, price, quantity.
- Cart drawer hoặc cart page cho update quantity, remove item, clear cart.
- Tính subtotal/total bằng utility money.
- Checkout placeholder không thanh toán thật.

Kiểm tra:
- npm run lint
- npm run build
- Test thủ công reload vẫn giữ cart, quantity không nhỏ hơn 1.
- Test AR flow không bị cart UI che hoặc phá layout mobile.

Commit:
- git add .
- git commit -m "feat: add cart flow"
```

## Phase 5 - Mock Auth And Saved Designs Prompt

```text
Hãy triển khai Phase 5 Mock Auth And Saved Designs.

Branch: feat/mock-auth-designs, tạo từ dev mới nhất.

Mục tiêu:
- Tạo auth mock ở src/features/auth và src/shared/mocks/mockAuth.ts.
- Register/login/logout dùng localStorage/session state, không xử lý password thật.
- Tạo saved designs ở src/features/designs.
- Save design từ AR/product context: product, variant, transform JSON giả lập, thumbnail optional.
- Tạo share token local và SharedDesignPage.
- User chưa login khi save được điều hướng tới auth mock hoặc modal auth.
- Không tạo backend, JWT thật, bcrypt, Prisma hoặc API server.

Kiểm tra:
- npm run lint
- npm run build
- Test thủ công login/register/logout, save design từ AR/product, open shared design route.

Commit:
- git add .
- git commit -m "feat: add mock auth and saved designs"
```

## Phase 6 - PWA And Demo Prompt

```text
Hãy triển khai Phase 6 PWA, polish, demo readiness.

Branch: feat/pwa-demo-polish, tạo từ dev mới nhất.

Mục tiêu:
- Thêm manifest.webmanifest, icons, theme color.
- Cải thiện loading states, empty states, mobile layout.
- Tạo docs/demo-script.md cho luồng demo AR 3-5 phút.
- Tạo docs/test-checklist.md cho Chrome desktop, Android Chrome, iOS Safari.
- Chạy Lighthouse hoặc ghi rõ nếu môi trường không hỗ trợ.

Kiểm tra:
- npm run lint
- npm run build
- Manual test checklist, ưu tiên AR viewer và mobile AR CTA.

Commit:
- git add .
- git commit -m "feat: prepare ar demo pwa experience"
```

## Prompt Review Trước Khi Merge Vào Dev

```text
Hãy review nhánh hiện tại trước khi merge vào dev.

Yêu cầu:
- Đóng vai code reviewer: ưu tiên bug, regression, thiếu test, rủi ro performance/accessibility.
- Nếu branch có AR/3D, kiểm tra kỹ loading/error/fallback và mobile layout.
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
- Ưu tiên xác nhận AR happy path trước: desktop 3D viewer, mobile AR CTA, fallback khi AR không hỗ trợ.
- Nếu pass, checkout main và merge --no-ff dev.
- Tạo tag v0.1.0 nếu đây là release MVP đầu tiên.
- Không merge nếu có lỗi build/lint nghiêm trọng.
```
