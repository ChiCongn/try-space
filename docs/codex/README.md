# TrySpace Codex Build Pack

Bộ tài liệu này biến bản BA `docs/TrySpace_BA_Document.md` thành kế hoạch làm việc thực tế với Codex để xây dựng TrySpace theo quy trình Git chuẩn:

- `main`: luôn ổn định, chỉ nhận code đã release hoặc demo được.
- `dev`: nhánh tích hợp phát triển, mọi feature đã test sẽ merge vào đây.
- `feat/...`: mỗi chức năng hoặc nhóm thay đổi có một nhánh riêng.
- Mỗi phiên Codex phải tạo file, chạy kiểm tra phù hợp, `git add`, `git commit`.

## Thứ Tự Sử Dụng

1. Đọc [00-project-structure.md](./00-project-structure.md) để nắm cấu trúc repo chuẩn.
2. Đọc [01-implementation-roadmap.md](./01-implementation-roadmap.md) để biết roadmap AR-first và thứ tự phase.
3. Dùng [02-git-workflow.md](./02-git-workflow.md) làm quy trình bắt buộc cho branch, commit, merge.
4. Copy prompt từ [03-codex-prompts.md](./03-codex-prompts.md) cho từng task cụ thể.
5. Dùng [05-agent-prompts.md](./05-agent-prompts.md) khi muốn giao việc theo vai trò agent.
6. Làm theo [04-codex-usage-guide.md](./04-codex-usage-guide.md) khi bắt đầu một phiên Codex mới.

## Quy Ước Triển Khai

Repo hiện tại là Vite React ở root. Cấu trúc nên dùng cho TrySpace giai đoạn này là **frontend-only React/Vite app ở root**:

```text
tryspace-codex/
├── public/         # static assets, models, posters, PWA icons
├── src/
│   ├── app/        # app shell, routes, providers
│   ├── components/ # shared layout + UI primitives
│   ├── features/   # products, ar, cart, auth, designs
│   ├── shared/     # hooks, lib, mocks, shared frontend types
│   └── styles/
├── docs/
│   └── codex/      # Bộ kế hoạch/prompt này
└── package.json
```

Chi tiết folder-level nằm ở [00-project-structure.md](./00-project-structure.md). Không tạo backend/monorepo trong phạm vi này; các phần auth, cart, save/share dùng mock/localStorage để phục vụ demo frontend.

## Ưu Tiên Triển Khai

Ưu tiên làm các tính năng AR trước:

1. `feat/frontend-foundation`
2. `feat/ar-vertical-slice`
3. `feat/ar-product-experience`
4. `feat/product-catalog`
5. `feat/cart-flow`
6. `feat/mock-auth-designs`
7. `feat/pwa-demo-polish`

## Definition Of Done Chung

Một task chỉ được coi là xong khi:

- Code hoặc tài liệu đã được tạo trong đúng branch `feat/...`.
- `npm run lint` và `npm run build` pass ở phạm vi bị ảnh hưởng.
- Có test hoặc checklist thủ công cho UI/AR nếu chưa tự động hóa được.
- `git status --short` chỉ còn sạch sau commit.
- Commit message dùng Conventional Commits, ví dụ `docs: add codex implementation plan`.
