# TrySpace Progress Log

Cap nhat: 2026-05-17

Nguon doi chieu:
- `docs/TrySpace_Frontend_Spec.md`
- `docs/TrySpace_BA_Document.md`
- Code hien tai trong `src/`, `public/`, `package.json`, `vite.config.ts`, `.env.example`

Quy uoc trang thai:
- `[x]` Da lam / co the demo duoc
- `[~]` Da lam mot phan / can bo sung de khop dac ta
- `[ ]` Chua lam

## Tong Quan

- [~] MVP core "Kham pha -> Xem AR -> Tuy bien -> Luu -> Mua" da co duong di chinh: landing, catalog, product detail, AR page, cart, checkout qua backend API.
- [~] Kien truc dang la React + Vite + TypeScript + Zustand + backend API service layer, nhung version va thu vien khac dac ta: React 19, React Router 7, Zustand 5, Tailwind 4 plugin; chua co TanStack React Query.
- [~] AR da dung `@google/model-viewer`, co CTA mo AR tren dien thoai, fallback 3D, `arStore`, AR controls va save/share design session; screenshot moi co helper, chua co UI thumbnail production.
- [~] PWA da co `manifest.webmanifest`, service worker custom, standalone config va cache co ban; chua cai `vite-plugin-pwa` va chua co icon PNG 192/512.
- [x] Review, Orders, Designs, Shared Design, Account va ProtectedRoute da duoc trien khai voi backend services/local UI state.

## 1. Cau Truc Thu Muc

- [x] Co nhom `src/components/ui`, `src/components/layout`, `src/components/product`, `src/components/ar`, `src/components/cart`, `src/pages`, `src/store`, `src/services`, `src/hooks`, `src/types`, `src/utils`, `src/constants`.
- [~] Co public assets cho model: `public/models/wooden_table_set-1k.glb`, `public/models/wooden_table_set-4k.glb`, `public/models/wooden-table-set.png`.
- [x] Du lieu san pham lay tu backend qua `product.api.ts`; file data tinh trong `src/assets` da bo.
- [x] Prototype cu trong `src/features/products` da duoc dua ra `docs/archive/features-products`; `src/features` khong con nam trong source app.
- [ ] Chua dung dung cau truc `apps/web/` nhu dac ta.
- [x] Da co `src/types/product.types.ts` va cac file tach `api.types.ts`, `user.types.ts`, `order.types.ts`, `design.types.ts`, `review.types.ts`, `cart.types.ts`; core app types van re-export/giu trong `src/types/index.ts`.
- [x] Co `src/constants/routes.ts` va `src/constants/queryKeys.ts`.
- [x] Co `src/utils/formatPrice.ts`, `src/utils/ids.ts`, `formatDate.ts`, `cn.ts`, `arUtils.ts`.
- [x] Co nhom component `cart/`, `review/`, `design/`, `auth/` theo dac ta.

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
- [x] Wildcard route dung `NotFoundPage` rieng.
- [x] Auth routes hien khong co Layout, khop dac ta.
- [x] Co `ProtectedRoute`; cart/checkout/wishlist/orders/designs/account bat buoc dang nhap.
- [x] Co route `/orders`, `/orders/:id`.
- [x] Co route `/designs`, `/design/:shareToken`.
- [x] Co route `/account`.
- [x] Co lazy loading route pages voi `React.lazy` + `Suspense`.
- [x] Da co va dang dung route constants `ROUTES`.

## 3. Page Specifications

### HomePage / LandingPage

- [x] Co hero, CTA den catalog, CTA demo AR.
- [x] Co section feature/how it works/CTA/footer.
- [x] Co stats bar.
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
- [x] Co related products.
- [x] Co review list/form trong product detail.

### ARPage

- [x] Co route `/ar/:id` cho tung san pham.
- [x] Lay dung product theo id va lay color/material tu URL query.
- [x] Render `ModelViewer` voi `ar`, `ar-modes`, `ar-placement="floor"`, `ar-scale="fixed"`.
- [x] Co CTA "Mo AR" goi `modelViewerRef.current.startAR()`.
- [x] Co trang thai ho tro AR/fallback 3D va toast loi.
- [x] Co add to cart ngay tren AR bottom sheet.
- [x] Co local model path hop le qua `/models/...`.
- [x] Co UI dieu khien AR: rotate left/right, variant selector mini va save design.
- [x] Co `arStore` de luu session state toan cuc.
- [~] Chua co capture screenshot/save thumbnail.
- [x] Co plane detector UI rieng cho trang AR; model-viewer/Scene Viewer van xu ly native.
- [x] Co `ThreeViewer` fallback rieng cho desktop/non-model.

### CartPage / CartSheet

- [x] Co cart page voi danh sach item, quantity controls, remove, total, checkout link.
- [x] Co cart drawer slide-over tu layout, overlay, item list, total, link xem gio hang.
- [x] Co badge so luong trong header/bottom nav.
- [x] Cart state persist localStorage.
- [x] Cart drawer hien full list item.
- [~] Quantity controls clamp 1-99 trong store, chua co input truc tiep.
- [~] Chua sync optimistic voi server API trong store.

### CheckoutPage

- [x] Co checkout voi shipping address, COD, order summary va create order qua backend.
- [x] Co Zod validation va inline errors.
- [x] Co popup/toast khi nhap thieu/sai, gio hang trong, thanh cong/that bai.
- [x] Tao order qua `orderApi.createOrder`, clear cart, den OrderSuccess.
- [~] Schema field khac spec (`recipientName`, `street`, `cod`) nhung dap ung flow tuong duong.
- [~] Chua dung `@hookform/resolvers/zod`; dang parse Zod trong `onSubmit`.
- [x] Co ProtectedRoute yeu cau dang nhap truoc checkout.

### Auth Pages

- [x] Co LoginPage va RegisterPage.
- [x] Co React Hook Form + Zod validation.
- [x] Co auth API that va persist auth state.
- [x] Co redirect khi da login.
- [x] Co toast loi/thanh cong.
- [x] Register password rule yeu cau chu hoa/chu thuong/so.
- [x] Auth store co `initialize()` luc app start de nap lai user.
- [x] Co `ProtectedRoute`.
- [~] ProtectedRoute redirect ve login khi can auth; chua co auth modal overlay rieng.

### Wishlist / Designs

- [x] Co WishlistPage va wishlist store persist.
- [x] Product card co toggle wishlist.
- [~] Wishlist UI hien con local-first, co `wishlist.api.ts` goi backend va ProtectedRoute; chua wire day du mutation dong bo backend.
- [x] ProductDetail `saveDesign()` mo modal va luu vao `designStore`; co design page/grid.
- [x] Co DesignsPage.
- [x] Co SharedDesignPage.
- [x] Co clone design / add design to cart.
- [x] Co SaveDesignModal, ShareDesignButton, DesignViewer.

### Orders / Account / Reviews

- [x] Co OrderSuccessPage sau checkout.
- [x] `orderApi` co ham `getOrders`, `getOrderDetail` va UI danh sach/chi tiet.
- [x] Co OrdersPage.
- [x] Co OrderDetailPage.
- [x] Co AccountPage.
- [x] Co review API, review components, review form, rating distribution.

## 4. State Management

- [x] Co Zustand stores trong `src/store`.
- [x] `authStore` persist user/accessToken/refreshToken va co `logout`, `setTokens`, `isLoggedIn`.
- [x] `cartStore` persist items va co `addItem`, `updateQty`, `removeItem`, `clearCart`, `openCart`, `closeCart`, computed `total`, `itemCount`.
- [x] `wishlistStore` persist items va co toggle/remove/isWished.
- [x] `themeStore` persist dark/light theme.
- [~] `cartStore` optimistic local update co UI immediate, nhung action khong async va chua call/rollback server API.
- [~] Auth refresh token co trong axios interceptor, nhung store chua expose async `refreshToken()` va `initialize()`.
- [x] Co `designStore`.
- [x] Co `uiStore`.
- [x] Co `arStore`.
- [~] Co query key factory trong `src/constants/queryKeys.ts`; chua co TanStack React Query setup va `QueryClientProvider`.

## 5. API Service Layer

- [x] Co axios client trong `src/services/api.ts`.
- [x] Co request interceptor gan Bearer token.
- [x] Co response interceptor refresh token khi 401 va retry request.
- [x] Da bo flag fallback data gia; service layer mac dinh goi backend.
- [x] Co `product.api.ts` voi list/detail/filter/sort qua backend.
- [x] Co `auth.api.ts` login/register/getMe/logout qua backend.
- [x] Co `cart.api.ts` get/sync cart.
- [x] Co `order.api.ts` create/list/detail order.
- [x] Base URL uu tien `VITE_API_BASE_URL` va fallback `http://localhost:4000/api/v1`.
- [~] Refresh token dung body payload, khong dung httpOnly cookie `withCredentials`.
- [x] Co failed request queue khi refresh token dang chay.
- [x] Co `review.api.ts`.
- [x] Co `design.api.ts`.
- [x] Co `wishlist.api.ts`.
- [x] Co `search.api.ts`.
- [x] Co `upload.api.ts`.
- [~] Co hooks `useProducts`, `useProduct`, `useReviews`; chua dung React Query/mutations v5.

## 6. Component Specifications

### UI / Design System

- [x] Co `Button`, `TextInput`, `Select`, `ThemeToggle`, `Toaster` Sonner.
- [x] `Button` co `primary | secondary | ghost | icon | ar`, `size`, `isLoading`, left/right icon.
- [~] Form fields hien co component co ban nhung cac page auth/checkout dang dung input raw.
- [x] Co `Badge`, `Card`, `Modal`, `Skeleton`, `Spinner`, `EmptyState`, `ErrorBoundary` component rieng.
- [x] Co `Toast.tsx` re-export `sonner`.

### Layout

- [x] Co `Header`.
- [x] Co mobile `MobileNav`.
- [x] Co `Layout`.
- [x] Co `CartSheet`.
- [~] Header co logo/nav/theme/wishlist/cart/account, nhung mobile hamburger/search chua day du nhu spec.
- [x] Layout co Footer chung.
- [x] Co `PageContainer`.

### Product Components

- [x] Co `ProductCard` cho catalog/wishlist.
- [x] ProductCard co image, AR badge, wishlist button, swatches, price, rating, add-to-cart.
- [x] ProductCard biet san pham da trong gio hang va doi style button.
- [x] AR badge tren card mo dung `/ar/:id?color=...&material=...`.
- [~] Da co them `ProductHero`, `ProductSpecs`, `VariantSelector`, `RoomPresetSelector`, `ProductConfidencePanel` trong `components/product`.
- [x] Co `ProductGrid`, `ProductFilter`, `ProductSort`, `ProductSearch`, `ColorSwatch`, `DimensionDisplay`, `PriceDisplay`, `StockBadge`, `RelatedProducts` component rieng.
- [~] ProductDetail hien van dung selector inline cho data model hien tai, chua noi voi `VariantSelector` reusable theo spec.

### AR Components

- [x] Co `ModelViewer` wrapper quanh `<model-viewer>`.
- [x] Co `ModelViewerHandle.startAR()`.
- [x] Co events `ar-status`, `load`, `error`.
- [x] Co doi mau material dau tien bang selected color.
- [x] Co type declaration cho `model-viewer`.
- [~] Co cac component demo `TryInRoomGuide`, `TryInRoomSheet`, `ArActionBar`, `ArPlacementTips`, `ArSupportNotice`, nhung ProductTryOnPage demo dang comment.
- [x] Co `ARControls` production.
- [x] Co `ARFallback` component rieng.
- [x] Co `ModelLoader` progress component.
- [x] Co `PlaneDetector` component rieng.
- [x] Co `ThreeViewer` fallback.

### Cart / Review / Design / Auth Components

- [x] Co cart sheet/page logic trong `components/cart/CartSheet.tsx` va `pages/CartPage.tsx`.
- [~] Da co `CartSheet`; chua tach `CartItem`, `CartSummary`, `CartBadge`.
- [x] Co `ReviewList`, `ReviewCard`, `ReviewForm`, `RatingInput`, `RatingDisplay`, `RatingDistribution`, `HelpfulButton`.
- [x] Co `DesignCard`, `DesignGrid`, `SaveDesignModal`, `ShareDesignButton`, `DesignViewer`.
- [x] Co `LoginForm`, `RegisterForm`, `ProtectedRoute` component rieng.

## 7. AR & 3D Module

- [x] `useARSupport` co detect mobile va WebXR support.
- [x] `ModelViewer` co `ar`, `ar-modes`, `camera-controls`, `auto-rotate`, shadow/exposure/environment.
- [x] ARPage co mobile-friendly bottom sheet, CTA mo AR, fallback message.
- [x] San pham co `modelUrl`, `arSupported`, image poster.
- [~] `useARSupport` chua detect Quick Look/Scene Viewer chi tiet nhu spec, nhung da co helper `arUtils` cho `webXR`, `sceneViewer`, `quickLook`.
- [x] AR flow co state machine co ban `inactive/loading/active/placed/error` trong `arStore`.
- [x] Co controls sau placement/preview: rotate, variant selector mini, save design, add to cart trong bottom sheet.
- [~] Co helper `captureARScreenshot`; chua co UI capture thumbnail production.
- [x] Co session save design trong AR qua `designStore`; load qua Designs/SharedDesign.
- [~] Co checklist performance/AR trong `docs/quality-checklist.md`; chua co do FPS/model load time tu dong.

## 8. Form Handling & Validation

- [x] Co `react-hook-form` va `zod`.
- [x] Login validation: email va password min length.
- [x] Register validation: email, name, password min length, confirm password.
- [x] Checkout validation: recipient, phone, province, district, ward, street.
- [x] Inline field errors va toast popup.
- [~] Chua dung `@hookform/resolvers/zod`.
- [x] Co central `src/utils/schemas.ts`.
- [~] Chua dung mode `onBlur` theo pattern dac ta.
- [x] Co review form validation.
- [x] Co image upload validation.

## 9. Error Handling

- [x] Co toast popup global `sonner`.
- [x] API call pages co catch loi co ban.
- [x] ProductDetail co not-found inline.
- [x] Catalog/Cart/Wishlist co empty states inline.
- [x] Checkout redirect/toast khi gio hang trong.
- [x] Co helper `getErrorMessage`, `getErrorCode` dung chung.
- [x] Co typed `ApiErrorResponse`.
- [x] Co `ErrorBoundary`.
- [x] Co `NotFoundPage` rieng.
- [x] Co fallback UI cho route/page crash.

## 10. Loading & Skeleton States

- [x] Catalog co skeleton grid.
- [x] ProductDetail co skeleton page.
- [x] ModelViewer co loading state "Dang tai model 3D".
- [x] Login/Register/Checkout submit button co loading/disabled text.
- [x] Co base `Skeleton` component reusable.
- [~] CartSheet chua co spinner overlay khi sync API.
- [~] Image progressive blur-up chua co.
- [x] Co page transition top bar/spinner qua Suspense fallback.
- [~] Review co loading nhe, chua co skeleton rieng cho review.

## 11. Responsive Behavior

- [x] Co mobile bottom nav fixed.
- [x] Header sticky va co scroll state.
- [x] Catalog co mobile filter sheet va desktop sidebar.
- [x] Catalog grid responsive qua CSS breakpoints.
- [x] ProductDetail/Cart/Checkout co responsive layout.
- [x] ARPage thiet ke mobile-first voi full-screen viewer va bottom sheet.
- [~] Header mobile chua co hamburger menu theo spec.
- [x] Bottom nav co 5 khu vuc/AR center va tab "Tai khoan".
- [x] Layout co footer chung.
- [~] Can verify UI tren mobile/desktop bang screenshot test.

## 12. PWA Configuration

- [x] Co `public/favicon.svg` va `public/icons.svg`.
- [x] Co public GLB models.
- [ ] Chua cai `vite-plugin-pwa`.
- [x] Co `public/manifest.webmanifest`.
- [~] Co icon SVG maskable trong manifest; chua co icon PNG 192x192, 512x512.
- [~] Co service worker custom va claim/activate; chua co auto-update prompt rieng.
- [x] Co cache strategy co ban cho images/fonts/models/static route.
- [x] Co PWA install/display standalone config.

## 13. Environment & Config

- [x] Co `.env.example`.
- [x] Co `VITE_API_BASE_URL` cho backend API.
- [x] Co Vite config voi React plugin va Tailwind plugin.
- [~] `.env.example` co ca backend variables, chua tach web `.env.local`/production nhu spec.
- [x] Da chuan hoa uu tien `VITE_API_BASE_URL`; bo duplicate `VITE_API_URL` trong `.env.example`.
- [x] Co `VITE_CLOUDINARY_CLOUD_NAME`.
- [x] Co `VITE_APP_URL`.
- [x] Co `VITE_MODEL_VIEWER_VERSION`.
- [x] Co `.env.production.example`.

## 14. TypeScript Types & Data Model

- [x] Co core types `User`, `Product`, `ProductColor`, `ProductMaterial`, `CartItem`, `WishlistItem`, `Order`, `Address`, `ApiResponse`.
- [x] Co `model-viewer.d.ts` cho web component.
- [~] Product model runtime hien don gian hon spec trong `src/types/index.ts`; `src/types/product.types.ts` giu kieu prototype cho cac component product reusable.
- [~] User model hien don gian hon spec: chua co role, displayName/avatarUrl, stats.
- [~] Cart model hien la mang item local, chua co `Cart` summary envelope.
- [x] Co review types.
- [x] Co design types.
- [~] Co pagination mo rong `totalPages`, `hasNextPage`, `hasPreviousPage`; chua doi envelope sang `success/meta` rieng.
- [x] Co API error response type.

## 15. Utility Functions

- [x] Co `formatVnd` va alias `formatPrice` trong `src/utils/formatPrice.ts`.
- [x] Co `createDemoId` trong `src/utils/ids.ts`.
- [x] `formatVnd`/`formatPrice` dap ung format VND.
- [x] Co `formatDate`.
- [x] Co `cn` class merge helper.
- [x] Co `captureARScreenshot`.
- [x] Co `isModelViewerSupported`.

## 16. Build, Lint, Quality

- [x] `npm run build` pass sau refactor cau truc.
- [x] `npm run lint` pass sau khi xu ly rule `react-hooks/set-state-in-effect`.
- [x] TypeScript strict build dang pass.
- [ ] Chua co unit tests.
- [~] Co E2E smoke checklist trong `docs/quality-checklist.md`; chua co Playwright/e2e tests tu dong.
- [~] Co accessibility audit checklist trong `docs/quality-checklist.md`; chua chay audit tu dong.
- [x] Co performance/AR device test checklist.

## 17. De Xuat Uu Tien Tiep Theo

1. Fix lint errors hien tai de CI/local quality sach.
2. Them `ProtectedRoute` va chuan hoa auth initialization/refresh flow.
3. Chuan hoa routing theo spec: constants, NotFoundPage, Orders/Designs/Account/SharedDesign.
4. Dua data fetching sang TanStack React Query va wire mutation backend cho local UI stores.
5. Tach reusable components: EmptyState, Skeleton, Modal, ProductGrid, PriceDisplay, CartItem/CartSummary.
6. Hoan thien AR session: `arStore`, ARControls, save/share design, screenshot thumbnail.
7. Them PWA config va manifest de dat muc tieu Progressive Web App.
8. Bo sung review module neu can dat day du spec e-commerce.
