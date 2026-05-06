# Git Workflow For TrySpace

Quy trình này bắt buộc cho mọi phiên Codex khi có thay đổi file.

## Branch Roles

```text
main      stable, demo/release only
dev       integration branch for tested work
feat/*    feature branches created from dev
fix/*     bug-fix branches created from dev
docs/*    documentation branches created from dev
```

Không commit trực tiếp vào `main`. Không merge feature vào `main`. `main` chỉ nhận merge từ `dev` sau khi test xong toàn bộ.

## Start A New Feature

```bash
git switch dev
git status --short
git pull --ff-only
git switch -c feat/<short-feature-name>
```

Nếu repo chưa có remote, bỏ qua `git pull --ff-only`.

## Work Loop In A Feature Branch

1. Đọc tài liệu liên quan và code hiện tại.
2. Tạo/chỉnh file đúng phạm vi feature.
3. Chạy format/lint/build/test phù hợp.
4. Kiểm tra diff.
5. Add và commit.

```bash
npm run lint
npm run build
git diff --check
git status --short
git add <files>
git commit -m "feat: implement <feature>"
```

Với docs-only:

```bash
git diff --check
git add docs/<files>
git commit -m "docs: add <topic>"
```

## Merge Feature Into Dev

Chỉ merge khi feature branch đã test pass.

```bash
git switch dev
git merge --no-ff feat/<short-feature-name>
npm run lint
npm run build
git status --short
```

Sau merge có thể giữ branch để trace hoặc xóa nếu đã push/không cần:

```bash
git branch -d feat/<short-feature-name>
```

## Release Dev Into Main

Chỉ release khi demo checklist pass trên `dev`.

```bash
git switch dev
npm run lint
npm run build
git switch main
git merge --no-ff dev
git tag v0.1.0
```

Nếu có remote:

```bash
git push origin main dev --tags
```

## Commit Message Convention

Dùng Conventional Commits:

```text
feat: add product catalog filters
fix: handle empty cart totals
docs: add codex implementation prompts
chore: configure npm workspaces
test: add cart store tests
refactor: split product detail components
```

Một commit nên có một mục đích rõ. Không trộn refactor lớn với feature UI nếu không cần.

## Safety Rules For Codex

- Trước khi sửa file: luôn chạy `git status --short`.
- Nếu thấy file đã bị chỉnh ngoài phạm vi task, không revert.
- Nếu cần sửa cùng file có thay đổi sẵn, đọc kỹ diff trước khi patch.
- Không dùng `git reset --hard`, `git checkout -- <file>` trừ khi người dùng yêu cầu rõ.
- Không commit secret, token, file `.env`.
- Với dependency mới, commit cả `package.json` và lockfile.

## Feature Completion Checklist

```text
[ ] Đang ở nhánh feat/fix/docs phù hợp
[ ] Scope khớp roadmap
[ ] Code/docs đã tạo đủ file cần thiết
[ ] npm run lint pass hoặc ghi rõ lý do không chạy được
[ ] npm run build pass hoặc ghi rõ lý do không chạy được
[ ] UI đã kiểm tra responsive nếu có thay đổi frontend
[ ] API đã kiểm tra status code nếu có backend
[ ] git diff --check pass
[ ] git add đúng file
[ ] git commit với message chuẩn
[ ] merge --no-ff vào dev sau khi test pass
```

