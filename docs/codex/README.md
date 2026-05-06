# TrySpace Codex Build Pack

Bộ tài liệu này biến bản BA `docs/TrySpace_BA_Document.md` thành kế hoạch làm việc thực tế với Codex để xây dựng TrySpace theo quy trình Git chuẩn:

- `main`: luôn ổn định, chỉ nhận code đã release hoặc demo được.
- `dev`: nhánh tích hợp phát triển, mọi feature đã test sẽ merge vào đây.
- `feat/...`: mỗi chức năng hoặc nhóm thay đổi có một nhánh riêng.
- Mỗi phiên Codex phải tạo file, chạy kiểm tra phù hợp, `git add`, `git commit`.

## Thứ Tự Sử Dụng

1. Đọc [01-implementation-roadmap.md](./01-implementation-roadmap.md) để biết app sẽ được chia phase nào, mỗi phase tạo file gì.
2. Dùng [02-git-workflow.md](./02-git-workflow.md) làm quy trình bắt buộc cho branch, commit, merge.
3. Copy prompt từ [03-codex-prompts.md](./03-codex-prompts.md) cho từng task cụ thể.
4. Làm theo [04-codex-usage-guide.md](./04-codex-usage-guide.md) khi bắt đầu một phiên Codex mới.

## Quy Ước Triển Khai

Repo hiện tại là Vite React ở root. Kế hoạch đề xuất chuyển sang cấu trúc full-stack có kiểm soát:

```text
tryspace-codex/
├── apps/
│   ├── web/        # React + Vite + TypeScript + Tailwind
│   └── api/        # Express + Prisma + PostgreSQL
├── packages/
│   └── shared/     # Type, schema, contract dùng chung
├── docs/
│   └── codex/      # Bộ kế hoạch/prompt này
└── docker-compose.yml
```

Nếu deadline ngắn, có thể giữ frontend ở root và chỉ thêm `api/`. Tuy nhiên roadmap chính dùng monorepo `apps/web`, `apps/api`, `packages/shared` vì khớp BA và dễ mở rộng.

## Definition Of Done Chung

Một task chỉ được coi là xong khi:

- Code hoặc tài liệu đã được tạo trong đúng branch `feat/...`.
- `npm run lint` và `npm run build` pass ở phạm vi bị ảnh hưởng.
- Có test hoặc checklist thủ công cho UI/AR nếu chưa tự động hóa được.
- `git status --short` chỉ còn sạch sau commit.
- Commit message dùng Conventional Commits, ví dụ `docs: add codex implementation plan`.

