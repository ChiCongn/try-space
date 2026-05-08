# TrySpace Progress Log

Cap nhat: 2026-05-08

Nguon doi chieu:
- `docs/TrySpace_Frontend_Spec.md`
- `docs/TrySpace_BA_Document.md`
- Code hien tai trong `src/`, `public/`, `package.json`, `vite.config.ts`, `.env.example`

Quy uoc trang thai:
- `[x]` Da lam / co the demo duoc
- `[~]` Da lam mot phan / can bo sung de khop dac ta
- `[ ]` Chua lam

## Tong Quan

- [~] MVP core "Kham pha -> Xem AR -> Tuy bien -> Luu -> Mua" da co duong di chinh: landing, catalog, product detail, AR page, cart, checkout mock.
- [~] Kien truc dang la React + Vite + TypeScript + Zustand + mock API, nhung version va thu vien khac dac ta: React 19, React Router 7, Zustand 5, Tailwind 4 plugin; chua co TanStack React Query.
- [~] AR da dung `@google/model-viewer`, co CTA mo AR tren dien thoai va fallback 3D, nhung chua co `arStore`, AR controls nang cao, save/share design session va screenshot.
- [ ] PWA chua duoc cau hinh day du: chua co `vite-plugin-pwa`, `manifest.json`, service worker, icon PNG 192/512.
- [ ] Review, Orders, Designs, Shared Design, Account va ProtectedRoute chua duoc trien khai.

## 1. Cau Truc Thu Muc

- [x] Co nhom `src/components/ui`, `src/components/layout`, `src/components/product`, `src/components/ar`, `src/components/cart`, `src/pages`, `src/store`, `src/services`, `src/hooks`, `src/types`, `src/utils`, `src/constants`.
- [~] Co public assets cho model: `public/models/wooden_table_set-1k.glb`, `public/models/wooden_table_set-4k.glb`, `public/models/wooden-table-set.png`.
- [~] Du lieu san pham mock nam tai `src/assets/mock-data/products.json`.
- [x] Prototype cu trong `src/features/products` da duoc dua ra `docs/archive/features-products`; `src/features` khong con nam trong source app.
- [ ] Chua dung dung cau truc `apps/web/` nhu dac ta.
- [~] Da co `src/types/product.types.ts`; chua tach tiep `api.types.ts`, `user.types.ts`, `order.types.ts`, `design.types.ts`, `review.types.ts`, `cart.types.ts`; core app types van gom trong `src/types/index.ts`.
- [x] Co `src/constants/routes.ts` va `src/constants/queryKeys.ts`.
- [~] Co `src/utils/formatPrice.ts` va `src/utils/ids.ts`; chua co `formatDate.ts`, `cn.ts`, `arUtils.ts`.
- [~] Co nhom component `cart/`; chua co nhom component `review/`, `design/`, `auth/` theo dac ta.

## 2. Routing & Pages

- [x] Co router tap trung trong `src/router.tsx` bang `createBrowserRouter`.
- [x] Co layout co `Header`, `MobileNav`, `CartSheet` qua `Layout`.
- [x] Co route Home/Landing: `/`.
- [x] Co route Catalog: `/catalog`.
- [x] Co redirect `/products` -> `/catalog`.
- [x] Co route Product Detail: `/products/:id`.
- [x] Co route AR: `/ar/:id`.
- [x] Co route Cart: `/cart`.
- [x] Co route Checkout: `/checkout`.
- [x] Co route Wishlist: `/wishlist`.
- [x] Co route Login/Register: `/login`, `/register`.
- [x] Co route Order Success: `/order-success/:orderId`.
- [~] Wildcard route da redirect ve `/`, nhung chua co `NotFoundPage` rieng.
- [~] Auth routes hien khong co Layout, khop mot phan dac ta.
- [ ] Chua co `ProtectedRoute`; cart/checkout/wishlist chua bat buoc dang nhap.
- [ ] Chua co route `/orders`, `/orders/:id`.
- [ ] Chua co route `/designs`, `/design/:shareToken`.
- [ ] Chua co route `/account`.
- [ ] Chua co lazy loading route pages voi `React.lazy` + `Suspense`.
- [x] Da co va dang dung route constants `ROUTES`.

## 3. Page Specifications

### HomePage / LandingPage

- [x] Co hero, CTA den catalog, CTA demo AR.
- [x] Co section feature/how it works/CTA/footer.
- [~] Chua co stats bar.
- [~] Chua fetch featured products 12 items tu API.
- [~] CTA "Thu trong phong" hien di thang `/ar/p001`, chua vao ProductDetail voi AR tab active.

### ProductsPage / CatalogPage

- [x] Co search, category filter, min/max price, sort.
- [x] Filter dong bo URL query string va back/forward restore duoc.
- [x] Co desktop sidebar filter.
- [x] Co mobile bottom sheet filter.
- [x] Co product grid va skeleton loading.
- [x] Co empty state khi khong tim thay san pham.
- [~] Route hien la `/catalog`, khong phai `/products` nhu dac ta.
- [~] Query params hien la `q`, `category`, `minPrice`, `maxPrice`, `sort`; chua co `page`.
- [~] Chua co load more/pagination.
- [~] Grid responsive co CSS, can verify visual tren tat ca viewport.

### ProductDetailPage

- [x] Co skeleton full page khi load.
- [x] Fetch product theo `id`.
- [x] Co gallery, stock badge, rating, price, color/material selector, dimensions.
- [x] Co add to cart, wishlist, save design localStorage.
- [x] Co modal 3D viewer dung `ModelViewer`.
- [x] Co CTA "Thu trong phong cua ban" den `/ar/:id` kem color/material query.
- [~] URL dung `id`, chua dung slug.
- [~] Chua co tab system "3D View | AR Room | Photos".
- [~] Model viewer chi lazy theo modal, chua lazy theo scroll/viewer section nhu spec.
- [~] Sidebar/info panel co responsive CSS, can verify sticky behavior theo spec.
- [ ] Chua co related products.
- [ ] Chua co review list/form trong product detail.

### ARPage

- [x] Co route `/ar/:id` cho tung san pham.
- [x] Lay dung product theo id va lay color/material tu URL query.
- [x] Render `ModelViewer` voi `ar`, `ar-modes`, `ar-placement="floor"`, `ar-scale="fixed"`.
- [x] Co CTA "Mo AR" goi `modelViewerRef.current.startAR()`.
- [x] Co trang thai ho tro AR/fallback 3D va toast loi.
- [x] Co add to cart ngay tren AR bottom sheet.
- [x] Co local model path hop le qua `/models/...`.
- [~] Chua co UI dieu khien trong AR session sau khi placed: rotate left/right, variant selector mini, save design, exit.
- [~] Chua co `arStore` de luu session state toan cuc.
- [~] Chua co capture screenshot/save thumbnail.
- [~] Chua co plane detector UI rieng; model-viewer/Scene Viewer xu ly native.
- [ ] Chua co Three.js fallback rieng cho desktop.

### CartPage / CartSheet

- [x] Co cart page voi danh sach item, quantity controls, remove, total, checkout link.
- [x] Co cart drawer slide-over tu layout, overlay, item list, total, link xem gio hang.
- [x] Co badge so luong trong header/bottom nav.
- [x] Cart state persist localStorage.
- [~] Cart drawer chi hien toi da 3 item (`items.slice(0, 3)`), chua scroll full list.
- [~] Quantity controls chua co input min/max 1-99.
- [~] Chua sync optimistic voi server API trong store.

### CheckoutPage

- [x] Co checkout mock voi shipping address, COD, order summary.
- [x] Co Zod validation va inline errors.
- [x] Co popup/toast khi nhap thieu/sai, gio hang trong, thanh cong/that bai.
- [x] Tao mock order qua `orderApi.createOrder`, clear cart, den OrderSuccess.
- [~] Schema field khac spec (`recipientName`, `street`, `cod`) nhung dap ung flow tuong duong.
- [~] Chua dung `@hookform/resolvers/zod`; dang parse Zod trong `onSubmit`.
- [ ] Chua co ProtectedRoute yeu cau dang nhap truoc checkout.

### Auth Pages

- [x] Co LoginPage va RegisterPage.
- [x] Co React Hook Form + Zod validation.
- [x] Co mock auth API va persist auth state.
- [x] Co redirect khi da login.
- [x] Co toast loi/thanh cong.
- [~] Register password rule chua yeu cau chu hoa/chu thuong/so nhu spec.
- [~] Auth store chua co `initialize()` refresh token luc app start.
- [ ] Chua co `ProtectedRoute`.
- [ ] Chua co auth modal khi can login.

### Wishlist / Designs

- [x] Co WishlistPage va wishlist store persist.
- [x] Product card co toggle wishlist.
- [~] Wishlist hien la local-only, chua co API sync/protected route.
- [~] ProductDetail `saveDesign()` moi luu localStorage thong tin san pham/color/material, chua co design page/grid.
- [ ] Chua co DesignsPage.
- [ ] Chua co SharedDesignPage.
- [ ] Chua co clone design / add all to cart.
- [ ] Chua co SaveDesignModal, ShareDesignButton, DesignViewer.

### Orders / Account / Reviews

- [x] Co OrderSuccessPage sau checkout.
- [~] `orderApi` co ham `getOrders`, `getOrderDetail` nhung UI chua co.
- [ ] Chua co OrdersPage.
- [ ] Chua co OrderDetailPage.
- [ ] Chua co AccountPage.
- [ ] Chua co review API, review components, review form, rating distribution.

## 4. State Management

- [x] Co Zustand stores trong `src/store`.
- [x] `authStore` persist user/accessToken/refreshToken va co `logout`, `setTokens`, `isLoggedIn`.
- [x] `cartStore` persist items va co `addItem`, `updateQty`, `removeItem`, `clearCart`, `openCart`, `closeCart`, computed `total`, `itemCount`.
- [x] `wishlistStore` persist items va co toggle/remove/isWished.
- [x] `themeStore` persist dark/light theme.
- [~] `cartStore` optimistic local update co UI immediate, nhung action khong async va chua call/rollback server API.
- [~] Auth refresh token co trong axios interceptor, nhung store chua expose async `refreshToken()` va `initialize()`.
- [ ] Chua co `designStore`.
- [ ] Chua co `uiStore`.
- [ ] Chua co `arStore`.
- [~] Co query key factory trong `src/constants/queryKeys.ts`; chua co TanStack React Query setup va `QueryClientProvider`.

## 5. API Service Layer

- [x] Co axios client trong `src/services/api.ts`.
- [x] Co request interceptor gan Bearer token.
- [x] Co response interceptor refresh token khi 401 va retry request.
- [x] Co mock API flag `VITE_USE_MOCK`.
- [x] Co `product.api.ts` voi list/detail/filter/sort mock va real API fallback.
- [x] Co `auth.api.ts` login/register/getMe/logout mock va real API fallback.
- [x] Co `cart.api.ts` get/sync cart.
- [x] Co `order.api.ts` create/list/detail order.
- [~] Base URL hien fallback `http://localhost:3001/api`, khac spec `http://localhost:3000/api/v1`.
- [~] Refresh token dung body payload, khong dung httpOnly cookie `withCredentials`.
- [ ] Chua co failed request queue khi refresh token dang chay.
- [ ] Chua co `review.api.ts`.
- [ ] Chua co `design.api.ts`.
- [ ] Chua co `wishlist.api.ts`.
- [ ] Chua co `search.api.ts`.
- [ ] Chua co `upload.api.ts`.
- [ ] Chua co React Query hooks `useProducts`, `useProduct`, `useReviews`, mutations.

## 6. Component Specifications

### UI / Design System

- [x] Co `Button`, `TextInput`, `Select`, `ThemeToggle`, `Toaster` Sonner.
- [~] `Button` moi co `primary | secondary | ghost`, chua co `icon | ar`, `size`, `isLoading`, left/right icon.
- [~] Form fields hien co component co ban nhung cac page auth/checkout dang dung input raw.
- [ ] Chua co `Badge`, `Card`, `Modal`, `Skeleton`, `Spinner`, `EmptyState`, `ErrorBoundary` component rieng.
- [ ] Chua co `Toast.tsx` rieng; dang dung `sonner`.

### Layout

- [x] Co `Header`.
- [x] Co mobile `MobileNav`.
- [x] Co `Layout`.
- [x] Co `CartSheet`.
- [~] Header co logo/nav/theme/wishlist/cart/account, nhung mobile hamburger/search chua day du nhu spec.
- [~] Landing co footer, Layout chua co Footer chung.
- [ ] Chua co `PageContainer`.

### Product Components

- [x] Co `ProductCard` cho catalog/wishlist.
- [x] ProductCard co image, AR badge, wishlist button, swatches, price, rating, add-to-cart.
- [x] ProductCard biet san pham da trong gio hang va doi style button.
- [x] AR badge tren card mo dung `/ar/:id?color=...&material=...`.
- [~] Da co them `ProductHero`, `ProductSpecs`, `VariantSelector`, `RoomPresetSelector`, `ProductConfidencePanel` trong `components/product`.
- [~] Chua tach `ProductGrid`, `ProductFilter`, `ProductSort`, `ProductSearch`, `ColorSwatch`, `DimensionDisplay`, `PriceDisplay`, `StockBadge`, `RelatedProducts` thanh component rieng.
- [~] ProductDetail hien van dung selector inline cho data model hien tai, chua noi voi `VariantSelector` reusable theo spec.

### AR Components

- [x] Co `ModelViewer` wrapper quanh `<model-viewer>`.
- [x] Co `ModelViewerHandle.startAR()`.
- [x] Co events `ar-status`, `load`, `error`.
- [x] Co doi mau material dau tien bang selected color.
- [x] Co type declaration cho `model-viewer`.
- [~] Co cac component demo `TryInRoomGuide`, `TryInRoomSheet`, `ArActionBar`, `ArPlacementTips`, `ArSupportNotice`, nhung ProductTryOnPage demo dang comment.
- [ ] Chua co `ARControls` production.
- [ ] Chua co `ARFallback` component rieng.
- [ ] Chua co `ModelLoader` progress component.
- [ ] Chua co `PlaneDetector` component rieng.
- [ ] Chua co `ThreeViewer` fallback.

### Cart / Review / Design / Auth Components

- [x] Co cart sheet/page logic trong `components/cart/CartSheet.tsx` va `pages/CartPage.tsx`.
- [~] Da co `CartSheet`; chua tach `CartItem`, `CartSummary`, `CartBadge`.
- [ ] Chua co `ReviewList`, `ReviewCard`, `ReviewForm`, `RatingInput`, `RatingDisplay`, `RatingDistribution`, `HelpfulButton`.
- [ ] Chua co `DesignCard`, `DesignGrid`, `SaveDesignModal`, `ShareDesignButton`, `DesignViewer`.
- [ ] Chua co `LoginForm`, `RegisterForm`, `ProtectedRoute` component rieng.

## 7. AR & 3D Module

- [x] `useARSupport` co detect mobile va WebXR support.
- [x] `ModelViewer` co `ar`, `ar-modes`, `camera-controls`, `auto-rotate`, shadow/exposure/environment.
- [x] ARPage co mobile-friendly bottom sheet, CTA mo AR, fallback message.
- [x] San pham co `modelUrl`, `arSupported`, image poster.
- [~] `useARSupport` chua detect Quick Look/Scene Viewer chi tiet nhu spec (`webXR`, `sceneViewer`, `quickLook`, `any`).
- [~] AR flow chua day du state machine `inactive/loading/active/placed/error`.
- [~] Chua co controls sau placement: rotate, variant selector mini, save design, add to cart trong AR overlay native.
- [ ] Chua co capture AR screenshot.
- [ ] Chua co session save/load design trong AR.
- [ ] Chua co performance checks FPS/model load time.

## 8. Form Handling & Validation

- [x] Co `react-hook-form` va `zod`.
- [x] Login validation: email va password min length.
- [x] Register validation: email, name, password min length, confirm password.
- [x] Checkout validation: recipient, phone, province, district, ward, street.
- [x] Inline field errors va toast popup.
- [~] Chua dung `@hookform/resolvers/zod`.
- [~] Chua co central `src/utils/schemas.ts`.
- [~] Chua dung mode `onBlur` theo pattern dac ta.
- [ ] Chua co review form validation.
- [ ] Chua co image upload validation.

## 9. Error Handling

- [x] Co toast popup global `sonner`.
- [x] API call pages co catch loi co ban.
- [x] ProductDetail co not-found inline.
- [x] Catalog/Cart/Wishlist co empty states inline.
- [x] Checkout redirect/toast khi gio hang trong.
- [~] Chua co helper `getErrorMessage`, `getErrorCode` dung chung.
- [~] Chua co typed `ApiError`/`ApiErrorResponse` day du nhu spec.
- [ ] Chua co `ErrorBoundary`.
- [ ] Chua co `NotFoundPage` rieng.
- [ ] Chua co fallback UI cho route/page crash.

## 10. Loading & Skeleton States

- [x] Catalog co skeleton grid.
- [x] ProductDetail co skeleton page.
- [x] ModelViewer co loading state "Dang tai model 3D".
- [x] Login/Register/Checkout submit button co loading/disabled text.
- [~] Chua co base `Skeleton` component reusable.
- [~] CartSheet chua co spinner overlay khi sync API.
- [~] Image progressive blur-up chua co.
- [ ] Chua co page transition top bar/spinner.
- [ ] Chua co review skeleton.

## 11. Responsive Behavior

- [x] Co mobile bottom nav fixed.
- [x] Header sticky va co scroll state.
- [x] Catalog co mobile filter sheet va desktop sidebar.
- [x] Catalog grid responsive qua CSS breakpoints.
- [x] ProductDetail/Cart/Checkout co responsive layout.
- [x] ARPage thiet ke mobile-first voi full-screen viewer va bottom sheet.
- [~] Header mobile chua co hamburger menu theo spec.
- [~] Bottom nav co 5 khu vuc/AR center, nhung tab "Tai khoan" chua co; wishlist dang label "Toi".
- [~] Layout chua co footer chung.
- [~] Can verify UI tren mobile/desktop bang screenshot test.

## 12. PWA Configuration

- [x] Co `public/favicon.svg` va `public/icons.svg`.
- [x] Co public GLB models.
- [ ] Chua cai `vite-plugin-pwa`.
- [ ] Chua co `public/manifest.json` hoac `manifest.webmanifest`.
- [ ] Chua co icon PNG 192x192, 512x512, maskable.
- [ ] Chua co service worker auto update.
- [ ] Chua co cache strategy cho fonts/images/products/models.
- [ ] Chua co PWA install/display standalone config.

## 13. Environment & Config

- [x] Co `.env.example`.
- [x] Co `VITE_API_URL` va `VITE_USE_MOCK`.
- [x] Co Vite config voi React plugin va Tailwind plugin.
- [~] `.env.example` co ca backend variables, chua tach web `.env.local`/production nhu spec.
- [~] Co `VITE_API_BASE_URL` va `VITE_API_URL` song song; can chuan hoa.
- [ ] Chua co `VITE_CLOUDINARY_CLOUD_NAME`.
- [ ] Chua co `VITE_APP_URL`.
- [ ] Chua co `VITE_MODEL_VIEWER_VERSION`.
- [ ] Chua co production env sample theo spec.

## 14. TypeScript Types & Data Model

- [x] Co core types `User`, `Product`, `ProductColor`, `ProductMaterial`, `CartItem`, `WishlistItem`, `Order`, `Address`, `ApiResponse`.
- [x] Co `model-viewer.d.ts` cho web component.
- [~] Product model runtime hien don gian hon spec trong `src/types/index.ts`; `src/types/product.types.ts` giu kieu prototype cho cac component product reusable.
- [~] User model hien don gian hon spec: chua co role, displayName/avatarUrl, stats.
- [~] Cart model hien la mang item local, chua co `Cart` summary envelope.
- [ ] Chua co review types.
- [ ] Chua co design types.
- [ ] Chua co paginated response meta day du (`success`, `meta.totalPages`, `hasNextPage`, ...).
- [ ] Chua co API error response type day du.

## 15. Utility Functions

- [x] Co `formatVnd` va alias `formatPrice` trong `src/utils/formatPrice.ts`.
- [x] Co `createDemoId` trong `src/utils/ids.ts`.
- [x] `formatVnd`/`formatPrice` dap ung format VND.
- [ ] Chua co `formatDate`.
- [ ] Chua co `cn` class merge helper.
- [ ] Chua co `captureARScreenshot`.
- [ ] Chua co `isModelViewerSupported`.

## 16. Build, Lint, Quality

- [x] `npm run build` pass sau refactor cau truc.
- [x] `npm run lint` pass sau khi xu ly rule `react-hooks/set-state-in-effect`.
- [x] TypeScript strict build dang pass.
- [ ] Chua co unit tests.
- [ ] Chua co Playwright/e2e tests.
- [ ] Chua co accessibility audit.
- [ ] Chua co performance/AR device test checklist.

## 17. De Xuat Uu Tien Tiep Theo

1. Fix lint errors hien tai de CI/local quality sach.
2. Them `ProtectedRoute` va chuan hoa auth initialization/refresh flow.
3. Chuan hoa routing theo spec: constants, NotFoundPage, Orders/Designs/Account/SharedDesign.
4. Dua data fetching sang TanStack React Query hoac cap nhat spec neu du an co chu dich dung local mock API.
5. Tach reusable components: EmptyState, Skeleton, Modal, ProductGrid, PriceDisplay, CartItem/CartSummary.
6. Hoan thien AR session: `arStore`, ARControls, save/share design, screenshot thumbnail.
7. Them PWA config va manifest de dat muc tieu Progressive Web App.
8. Bo sung review module neu can dat day du spec e-commerce.
