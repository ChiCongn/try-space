# TrySpace Project Structure

TrySpace hiện tại nên được xây như **frontend-only React/Vite app ở root repo**. Đây là cấu trúc phù hợp nhất cho phạm vi hiện tại: demo PWA/AR nội thất, catalog, tùy biến, giỏ hàng, lưu/chia sẻ thiết kế bằng mock/localStorage, chưa có backend riêng.

## Quyết Định Cấu Trúc

Giữ app Vite ở root thay vì chuyển sang monorepo:

- Ít ceremony, đúng chuẩn React/Vite cho một frontend app.
- Không tạo `apps/web`, `apps/api`, `packages/shared` khi chưa cần backend.
- Dễ chạy với lệnh quen thuộc: `npm run dev`, `npm run build`, `npm run lint`.
- Vẫn đủ sạch để mở rộng sau này nếu thật sự cần API.

## Target Structure

```text
tryspace-codex/
├── public/
│   ├── models/                 # GLB/GLTF furniture models
│   ├── posters/                # Poster images for 3D viewer
│   ├── icons/                  # PWA icons
│   ├── favicon.svg
│   └── manifest.webmanifest
│
├── src/
│   ├── app/
│   │   ├── App.tsx             # Root app composition
│   │   ├── routes.tsx          # Lightweight route/view switching
│   │   └── providers.tsx       # Global providers if needed
│   │
│   ├── components/
│   │   ├── layout/             # Header, nav, shell
│   │   └── ui/                 # Button, Input, Modal, Tabs...
│   │
│   ├── features/
│   │   ├── ar/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   └── types.ts
│   │   ├── cart/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── store/
│   │   │   └── types.ts
│   │   ├── designs/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── store/
│   │   │   └── types.ts
│   │   └── products/
│   │       ├── components/
│   │       ├── data/
│   │       ├── pages/
│   │       ├── store/
│   │       └── types.ts
│   │
│   ├── shared/
│   │   ├── hooks/              # Reusable hooks
│   │   ├── lib/                # formatMoney, storage helpers, ids
│   │   ├── mocks/              # mock service helpers
│   │   └── types/              # app-wide frontend types
│   │
│   ├── styles/
│   │   └── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── docs/
│   ├── TrySpace_BA_Document.md
│   └── codex/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── README.md
```

## Folder Rules

`src/app`

- Chứa root composition, route/view switching, global providers.
- Không chứa business logic chi tiết của products/cart/designs.

`src/features`

- Mỗi nghiệp vụ lớn có folder riêng.
- Component chỉ dùng trong feature nào thì đặt trong feature đó.
- Store/type/mock data riêng của feature cũng đặt trong feature đó.

`src/components`

- Chỉ chứa component dùng chung nhiều feature.
- `components/ui` là primitive như `Button`, `Input`, `Dialog`.
- `components/layout` là shell/header/navigation.

`src/shared`

- Chứa helper thật sự dùng lại nhiều nơi.
- `shared/mocks` giả lập API bằng Promise/localStorage để UI có shape giống sản phẩm thật mà chưa cần backend.
- Không đặt page hoặc feature-specific component ở đây.

`public`

- `models` chứa file `.glb`/`.gltf`.
- `posters` chứa ảnh poster/thumbnail cho model-viewer.
- `icons` và `manifest.webmanifest` phục vụ PWA.

## Script Chuẩn

Giữ scripts Vite root:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## Data Strategy Frontend-Only

Trong phạm vi frontend:

- Product catalog dùng static data trong `src/features/products/data/products.ts`.
- Auth mock dùng localStorage/session state, không xử lý mật khẩu thật.
- Cart persist bằng localStorage.
- Saved designs persist bằng localStorage.
- Share design dùng route token giả lập, ví dụ `/designs/demo-abc123`, đọc từ localStorage hoặc fallback demo data.

Khi sau này có backend, chỉ cần thay mock service bằng API client; UI feature folders vẫn giữ được.

## Không Tạo Trong Giai Đoạn Này

- Không tạo `apps/`, `apps/api/`, `packages/shared`.
- Không tạo Prisma, Express, Docker database.
- Không thêm JWT/bcrypt thật trong frontend.
- Không commit `.env` thật.

