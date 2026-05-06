# Codex Usage Guide For TrySpace

Tài liệu này hướng dẫn cách dùng Codex hằng ngày để xây TrySpace có kiểm soát, có commit rõ ràng, và không làm `main` mất ổn định.

## Một Phiên Làm Việc Chuẩn

1. Chọn phase trong roadmap.
2. Copy prompt tương ứng từ `docs/codex/03-codex-prompts.md`.
3. Dán vào Codex.
4. Để Codex đọc code, tạo branch, implement, test, add, commit.
5. Kiểm tra final summary của Codex:
   - File nào đã đổi.
   - Test nào đã chạy.
   - Commit hash/message.
   - Có merge vào `dev` chưa.

## Lệnh Người Dùng Có Thể Chạy Thủ Công

Kiểm tra nhánh và trạng thái:

```bash
git branch --show-current
git status --short --branch
```

Chạy app web:

```bash
npm run dev:web
```

Chạy API:

```bash
npm run dev:api
```

Chạy kiểm tra:

```bash
npm run lint
npm run build
```

Xem lịch sử commit:

```bash
git log --oneline --decorate --graph --all -20
```

## Cách Yêu Cầu Codex Làm Một Feature

Mẫu ngắn:

```text
Hãy làm feature <tên feature> theo docs/codex/01-implementation-roadmap.md.
Tạo branch feat/<tên-feature> từ dev, implement đúng scope, chạy lint/build, git add và commit.
Sau khi test pass, merge --no-ff vào dev.
```

Mẫu có kiểm soát hơn:

```text
Hãy triển khai <feature> cho TrySpace.

Scope:
- <gạch đầu dòng tính năng 1>
- <gạch đầu dòng tính năng 2>
- <gạch đầu dòng tính năng 3>

Không làm:
- <những phần chưa muốn làm>

Git:
- Bắt đầu từ dev.
- Tạo branch feat/<feature>.
- Commit bằng Conventional Commit.
- Chỉ merge vào dev nếu lint/build pass.
```

## Cách Yêu Cầu Codex Sửa Lỗi

```text
Hãy sửa lỗi sau trong TrySpace:
<mô tả lỗi, bước tái hiện, expected/actual>.

Quy trình:
- Tạo branch fix/<short-bug-name> từ dev.
- Viết hoặc cập nhật test/checklist nếu phù hợp.
- Chạy lint/build/test.
- Commit fix.
- Merge vào dev nếu pass.
```

## Cách Yêu Cầu Codex Review

```text
Hãy review nhánh hiện tại như code review trước khi merge vào dev.
Ưu tiên bug, regression, rủi ro bảo mật, performance, thiếu test.
Nếu có lỗi nhỏ, tự sửa và commit.
Nếu pass, merge --no-ff vào dev.
```

## Khi Nào Merge Vào Main

Chỉ merge `dev` vào `main` khi:

- Catalog, product detail, 3D/AR viewer, cart, auth hoặc phần demo mục tiêu đã pass.
- `npm run lint` pass.
- `npm run build` pass.
- Demo script chạy được từ đầu đến cuối.
- Không còn TODO chặn demo trong UI chính.

Lệnh release:

```bash
git switch dev
npm run lint
npm run build
git switch main
git merge --no-ff dev
git tag v0.1.0
```

## Quy Tắc Prompt Để Codex Làm Tốt Hơn

- Nói rõ branch name.
- Nói rõ file/module được phép sửa.
- Nói rõ những thứ không nằm trong scope.
- Yêu cầu Codex chạy lệnh kiểm tra cụ thể.
- Yêu cầu Codex commit cuối task.
- Với UI, yêu cầu responsive và trạng thái loading/error/empty.
- Với API, yêu cầu status code, validation, auth, error handler.
- Với AR, yêu cầu fallback khi browser không hỗ trợ.

## Anti-Patterns Cần Tránh

- "Làm hết app" trong một prompt duy nhất.
- Commit trực tiếp trên `main`.
- Merge feature vào `dev` khi build đang fail.
- Cài dependency không cần thiết.
- Viết logic AR/WebXR phức tạp trước khi thử `@google/model-viewer`.
- Trộn frontend, backend, refactor cấu trúc và polish UI trong cùng một branch lớn.

## Checklist Sau Mỗi Commit

```text
[ ] Commit message đúng convention
[ ] git status --short sạch
[ ] Nhánh hiện tại đúng với task
[ ] Test/lint/build đã chạy hoặc có lý do rõ ràng nếu chưa chạy
[ ] Ghi chú follow-up nếu có phần deferred
```

