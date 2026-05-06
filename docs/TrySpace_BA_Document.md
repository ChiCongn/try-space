# TrySpace — Tài Liệu Phân Tích Nghiệp Vụ (Business Analysis Document)

**Phiên bản:** 1.0.0
**Ngày tạo:** 2025
**Trạng thái:** Draft — Student Project
**Tác giả:** [ChiCongn]

---

## Mục Lục

1. [Tóm Tắt Điều Hành](#1-tóm-tắt-điều-hành)
2. [Tổng Quan Sản Phẩm](#2-tổng-quan-sản-phẩm)
3. [Phát Biểu Vấn Đề](#3-phát-biểu-vấn-đề)
4. [Mục Tiêu & Chỉ Số Thành Công](#4-mục-tiêu--chỉ-số-thành-công)
5. [Đối Tượng Người Dùng & Personas](#5-đối-tượng-người-dùng--personas)
6. [Use Cases Chi Tiết](#6-use-cases-chi-tiết)
7. [User Stories](#7-user-stories)
8. [Yêu Cầu Chức Năng](#8-yêu-cầu-chức-năng)
9. [Yêu Cầu Phi Chức Năng](#9-yêu-cầu-phi-chức-năng)
10. [Kiến Trúc Hệ Thống](#10-kiến-trúc-hệ-thống)
11. [Mô Hình Dữ Liệu](#11-mô-hình-dữ-liệu)
12. [Đặc Tả API](#12-đặc-tả-api)
13. [Quyết Định Công Nghệ](#13-quyết-định-công-nghệ)
14. [Workflow Người Dùng](#14-workflow-người-dùng)
15. [Rủi Ro & Giải Pháp](#15-rủi-ro--giải-pháp)
16. [Phạm Vi & Giới Hạn](#16-phạm-vi--giới-hạn)
17. [Glossary](#17-glossary)

---

## 1. Tóm Tắt Điều Hành

**TrySpace** là ứng dụng web thực tế tăng cường (Augmented Reality) cho phép người dùng xem trước nội thất 3D trong không gian sống thực của họ thông qua camera điện thoại, trước khi đưa ra quyết định mua hàng.

Ứng dụng giải quyết bài toán cốt lõi trong ngành bán lẻ nội thất trực tuyến: **người mua không thể hình dung kích thước, màu sắc và sự phù hợp của sản phẩm với không gian thực của mình**, dẫn đến tỷ lệ trả hàng cao và sự do dự khi mua sắm online.

TrySpace kết hợp:
- Trải nghiệm AR đặt nội thất vào phòng qua camera (3D overlay trên môi trường thực)
- Danh mục sản phẩm nội thất với khả năng tìm kiếm và lọc
- Tùy biến màu sắc / vật liệu sản phẩm theo thời gian thực
- Hệ thống lưu & chia sẻ thiết kế phòng
- Tài khoản người dùng và giỏ hàng tích hợp

**Nền tảng mục tiêu:** Progressive Web App (PWA) — truy cập qua browser, cài đặt được như ứng dụng native trên iOS và Android, không yêu cầu đăng tải lên App Store.

---

## 2. Tổng Quan Sản Phẩm

### 2.1 Định Nghĩa Sản Phẩm

| Thuộc tính | Chi tiết |
|---|---|
| Tên sản phẩm | TrySpace |
| Loại sản phẩm | Progressive Web Application (PWA) |
| Domain | AR E-Commerce / Interior Design |
| Công nghệ AR | WebXR API + `@google/model-viewer` |
| Render 3D | Three.js r160 |
| Kiến trúc | Client-Server (SPA + REST API) |
| Ngôn ngữ chính | TypeScript (Frontend & Backend) |

### 2.2 Tầm Nhìn Sản Phẩm

> "TrySpace giúp mọi người tự tin hơn trong mỗi quyết định mua nội thất bằng cách đưa sản phẩm vào không gian sống của họ — trước khi mua."

### 2.3 Phạm Vi Phiên Bản 1.0 (MVP)

Phiên bản đầu tiên tập trung vào luồng trải nghiệm cốt lõi: **Khám phá → Xem AR → Tùy biến → Lưu → Mua**. Cụ thể:

- Đặt model 3D vào phòng thực qua camera (AR placement)
- Danh mục 3 danh mục chính: ghế, bàn, kệ sách
- Đổi màu sắc và vật liệu bề mặt
- Đăng ký / đăng nhập tài khoản
- Lưu thiết kế và chia sẻ qua link
- Thêm vào giỏ hàng

---

## 3. Phát Biểu Vấn Đề

### 3.1 Bối Cảnh Thị Trường

Thương mại điện tử nội thất tại Việt Nam đang tăng trưởng mạnh, tuy nhiên tỷ lệ chuyển đổi (conversion rate) vẫn thấp hơn nhiều so với ngành bán lẻ truyền thống:

- Người mua **không thể ước lượng kích thước** sản phẩm trong không gian nhà mình
- Ảnh sản phẩm 2D không truyền tải được **chiều sâu, chất liệu và tỉ lệ thực**
- Chi phí vận chuyển/trả hàng cao khiến người dùng **e ngại thử sai**
- Thời gian giao hàng dài khiến **sự hài lòng bị trì hoãn**

### 3.2 Phân Tích Vấn Đề (Problem Tree)

```
VẤN ĐỀ GỐC: Tỷ lệ trả hàng cao + conversion rate thấp trong TMĐT nội thất
├── Nguyên nhân 1: Không hình dung được sản phẩm trong không gian thực
│   ├── Ảnh 2D thiếu thông tin chiều sâu
│   └── Mô tả kích thước khó tưởng tượng
├── Nguyên nhân 2: Thiếu tự tin khi ra quyết định
│   ├── Không biết sản phẩm có hợp màu sơn tường không
│   └── Không chắc về kích thước phù hợp
└── Nguyên nhân 3: Trải nghiệm mua sắm online nhàm chán
    ├── Scrolling hình ảnh tẻ nhạt
    └── Không có cảm giác "thử sản phẩm"
```

### 3.3 Giải Pháp Đề Xuất

TrySpace giải quyết bài toán này bằng cách ứng dụng AR (Augmented Reality) để:
1. **Hiển thị model 3D** của sản phẩm với kích thước 1:1 trong không gian thực của người dùng
2. **Cho phép tùy biến** màu sắc/vật liệu theo thời gian thực
3. **Lưu và chia sẻ** thiết kế để tham khảo ý kiến người thân trước khi mua

---

## 4. Mục Tiêu & Chỉ Số Thành Công

### 4.1 Mục Tiêu Kinh Doanh

| # | Mục tiêu | Chỉ số đo lường | Ngưỡng thành công |
|---|---|---|---|
| B1 | Tăng sự tự tin khi mua hàng | User survey (1–5 scale) | ≥ 4.0 / 5.0 |
| B2 | Giảm thời gian ra quyết định | Thời gian từ view → add to cart | Giảm 30% so với không dùng AR |
| B3 | Tăng tỷ lệ chuyển đổi | Add-to-cart rate sau AR session | ≥ 25% |
| B4 | Tăng engagement | Thời gian trung bình mỗi session | ≥ 3 phút |

### 4.2 Mục Tiêu Kỹ Thuật

| # | Mục tiêu | Chỉ số đo lường | Ngưỡng thành công |
|---|---|---|---|
| T1 | Hiệu năng AR | FPS khi render AR | ≥ 30 FPS trên mid-range phone |
| T2 | Thời gian tải | First Contentful Paint | ≤ 3 giây (3G) |
| T3 | Tải model 3D | Thời gian load model đầu tiên | ≤ 5 giây (WiFi) |
| T4 | Độ ổn định | Uptime API | ≥ 99% |
| T5 | Bảo mật | Authentication | JWT + bcrypt, HTTPS only |

### 4.3 Mục Tiêu Học Thuật (Project Goals)

- Demonstrate ứng dụng WebXR/AR trong thực tế thương mại
- Xây dựng hệ thống full-stack hoàn chỉnh với kiến trúc tách biệt frontend/backend
- Áp dụng RESTful API design, authentication, file storage
- Triển khai được trên môi trường cloud (Vercel + Railway)

---

## 5. Đối Tượng Người Dùng & Personas

### 5.1 Phân Khúc Người Dùng

**Nhóm chính:**
- Người mua sắm nội thất online (18–45 tuổi)
- Người thuê/mua nhà mới, đang setup nội thất
- Người muốn cải tạo/redecorate phòng

**Nhóm phụ (demo/academic):**
- Giảng viên, reviewer đánh giá project
- Các nhà bán lẻ nội thất muốn tích hợp tool này

### 5.2 Persona Chi Tiết

---

**Persona 1: Minh — "Người Mua Lần Đầu"**

- **Tuổi:** 26 | **Nghề:** Kỹ sư phần mềm | **Thu nhập:** 20–30 triệu/tháng
- **Bối cảnh:** Vừa thuê căn hộ mới, cần mua ghế sofa và bàn làm việc lần đầu
- **Đau điểm:**
  - "Tôi không biết chiếc sofa 1m8 có vừa tường phòng 3m không"
  - "Màu nâu gỗ có hợp với sơn tường trắng xám của tôi không?"
- **Mục tiêu:** Mua đúng sản phẩm ngay lần đầu, không phải trả lại
- **Hành vi:** Browse Shopee/Lazada nhưng e ngại vì không hình dung được
- **Kỳ vọng với TrySpace:** Đặt được chiếc sofa vào phòng thật của mình trước khi mua

---

**Persona 2: Linh — "Người Có Gu Thẩm Mỹ"**

- **Tuổi:** 32 | **Nghề:** Marketing Manager | **Thu nhập:** 30–50 triệu/tháng
- **Bối cảnh:** Muốn redecorate phòng ngủ, hay lên Pinterest tìm ý tưởng
- **Đau điểm:**
  - "Tôi muốn thử nhiều kiểu bố trí trước khi quyết định mua"
  - "Muốn chia sẻ với chồng để lấy ý kiến trước khi chi tiền"
- **Mục tiêu:** Thiết kế phòng hoàn hảo, ít sai sót nhất
- **Hành vi:** Chụp ảnh phòng, lên các app nội thất, tham khảo ý kiến nhiều người
- **Kỳ vọng với TrySpace:** Lưu và chia sẻ nhiều bố trí khác nhau để so sánh

---

**Persona 3: Thầy/Cô — "Evaluator"**

- **Vai trò:** Giảng viên chấm điểm project
- **Kỳ vọng:** Thấy được ứng dụng thực tế của AR, UI đẹp, demo thuyết phục, tài liệu đầy đủ

---

## 6. Use Cases Chi Tiết

### UC-01: Đặt Nội Thất Vào Phòng (AR Placement) ⭐ CORE

| | |
|---|---|
| **Tên** | AR Furniture Placement |
| **Tác nhân** | Người dùng (đã/chưa đăng nhập) |
| **Tiền điều kiện** | Thiết bị có camera, browser hỗ trợ WebXR hoặc model-viewer |
| **Hậu điều kiện** | Model 3D hiển thị trong không gian thực qua camera |

**Luồng chính:**
1. Người dùng chọn sản phẩm từ danh mục
2. Nhấn nút "Thử trong phòng"
3. Hệ thống yêu cầu quyền truy cập camera
4. Camera mở, hệ thống phát hiện mặt phẳng sàn (plane detection)
5. Hiển thị vòng tròn gợi ý vị trí đặt trên sàn
6. Người dùng tap để đặt model 3D xuống sàn
7. Model xuất hiện trong không gian thực với kích thước 1:1
8. Người dùng di chuyển xung quanh để xem từ nhiều góc
9. Người dùng có thể xoay model bằng gesture

**Luồng thay thế:**
- **3a.** Browser không hỗ trợ WebXR → Hiển thị chế độ 3D viewer thông thường (fallback)
- **6a.** Không phát hiện được mặt phẳng → Đặt model ở vị trí mặc định phía trước camera

**Luồng ngoại lệ:**
- Camera bị từ chối quyền → Hiển thị hướng dẫn cấp quyền
- File 3D tải lỗi → Thông báo lỗi + retry

---

### UC-02: Tùy Biến Màu/Vật Liệu

| | |
|---|---|
| **Tác nhân** | Người dùng |
| **Tiền điều kiện** | Đang xem sản phẩm (3D hoặc AR mode) |

**Luồng chính:**
1. Hiển thị bảng màu/vật liệu trong panel bên dưới hoặc sidebar
2. Người dùng chọn màu/vật liệu
3. Hệ thống cập nhật texture của model 3D ngay lập tức (< 200ms)
4. Giá cập nhật tương ứng nếu vật liệu cao cấp có phụ phí
5. Người dùng có thể lưu cấu hình này

---

### UC-03: Lưu & Chia Sẻ Thiết Kế

| | |
|---|---|
| **Tác nhân** | Người dùng đã đăng nhập |
| **Tiền điều kiện** | Đã đặt ≥ 1 sản phẩm trong phòng |

**Luồng chính:**
1. Người dùng nhấn "Lưu thiết kế"
2. Hệ thống chụp screenshot của AR scene (hoặc lưu config JSON)
3. Gán unique ID, lưu vào database
4. Hiển thị link chia sẻ: `tryspace.app/design/abc123`
5. Người dùng copy link, chia sẻ cho người khác
6. Người nhận mở link → xem lại thiết kế (có thể không cần đăng nhập)

---

### UC-04: Tìm Kiếm & Lọc Sản Phẩm

**Luồng chính:**
1. Người dùng nhập từ khóa (ví dụ: "ghế gỗ")
2. Hệ thống full-text search theo tên, danh mục, mô tả
3. Kết quả hiển thị dạng grid với thumbnail 3D/ảnh
4. Bộ lọc: Danh mục | Khoảng giá | Màu sắc | Vật liệu | Kích thước
5. Sắp xếp: Mới nhất | Giá tăng/giảm | Phổ biến nhất

---

### UC-05: Quản Lý Giỏ Hàng

**Luồng chính:**
1. Từ trang sản phẩm hoặc AR view → Nhấn "Thêm vào giỏ"
2. Chọn số lượng, màu/vật liệu đã chọn được ghi nhận
3. Giỏ hàng cập nhật real-time (icon badge ở header)
4. Trang giỏ hàng: tổng giá, danh sách sản phẩm, chỉnh sửa/xóa
5. Nút "Tiến hành mua" → Redirect đến trang thanh toán (mock/placeholder)

---

### UC-06: Xác Thực Người Dùng

**Đăng ký:**
1. Điền email, mật khẩu (≥ 8 ký tự), tên hiển thị
2. Xác thực email format và độ mạnh mật khẩu
3. Backend hash mật khẩu (bcrypt, salt rounds 12)
4. Trả về JWT access token + refresh token

**Đăng nhập:**
1. Email + mật khẩu
2. So khớp hash → trả JWT
3. JWT lưu trong httpOnly cookie (bảo mật hơn localStorage)

**Bảo vệ route:**
- Guest: xem sản phẩm, dùng AR, xem thiết kế chia sẻ
- Đã đăng nhập: lưu thiết kế, quản lý giỏ hàng, xem lịch sử

---

## 7. User Stories

### Epic 1: AR Experience

| ID | User Story | Priority | Story Points |
|---|---|---|---|
| US-01 | Là người dùng, tôi muốn đặt model 3D nội thất vào phòng thật qua camera để hình dung sản phẩm trước khi mua | Must Have | 13 |
| US-02 | Là người dùng, tôi muốn xoay và di chuyển model trong AR để xem từ nhiều góc độ | Must Have | 8 |
| US-03 | Là người dùng, tôi muốn thấy kích thước thực (1:1) của sản phẩm trong phòng để biết có vừa không | Must Have | 5 |
| US-04 | Là người dùng với thiết bị không hỗ trợ AR, tôi muốn xem 3D viewer thay thế | Should Have | 5 |
| US-05 | Là người dùng, tôi muốn đặt nhiều sản phẩm cùng lúc để xem tổng thể nội thất phòng | Could Have | 13 |

### Epic 2: Sản Phẩm & Tìm Kiếm

| ID | User Story | Priority | Story Points |
|---|---|---|---|
| US-06 | Là người dùng, tôi muốn xem danh mục sản phẩm được phân loại rõ ràng | Must Have | 5 |
| US-07 | Là người dùng, tôi muốn tìm kiếm sản phẩm theo từ khóa | Must Have | 5 |
| US-08 | Là người dùng, tôi muốn lọc sản phẩm theo giá, màu sắc, vật liệu | Should Have | 8 |
| US-09 | Là người dùng, tôi muốn xem ảnh sản phẩm từ nhiều góc độ 2D | Should Have | 3 |
| US-10 | Là người dùng, tôi muốn đổi màu/vật liệu sản phẩm và thấy thay đổi ngay lập tức | Must Have | 8 |

### Epic 3: Lưu & Chia Sẻ

| ID | User Story | Priority | Story Points |
|---|---|---|---|
| US-11 | Là người dùng đã đăng nhập, tôi muốn lưu thiết kế phòng của mình | Must Have | 8 |
| US-12 | Là người dùng, tôi muốn chia sẻ thiết kế qua link cho người khác xem | Must Have | 5 |
| US-13 | Là người dùng, tôi muốn xem lại danh sách thiết kế đã lưu | Should Have | 3 |
| US-14 | Là người dùng, tôi muốn chụp ảnh màn hình AR scene và lưu vào máy | Could Have | 3 |

### Epic 4: Tài Khoản & Mua Hàng

| ID | User Story | Priority | Story Points |
|---|---|---|---|
| US-15 | Là người dùng mới, tôi muốn đăng ký tài khoản bằng email | Must Have | 5 |
| US-16 | Là người dùng, tôi muốn đăng nhập và đăng xuất an toàn | Must Have | 3 |
| US-17 | Là người dùng, tôi muốn thêm sản phẩm vào giỏ hàng | Must Have | 5 |
| US-18 | Là người dùng, tôi muốn xem và chỉnh sửa giỏ hàng | Must Have | 5 |
| US-19 | Là người dùng, tôi muốn xem tổng giá trước khi thanh toán | Must Have | 3 |

---

## 8. Yêu Cầu Chức Năng

### 8.1 Module AR Viewer

| ID | Yêu cầu | Mức độ |
|---|---|---|
| FR-AR-01 | Tải và hiển thị model GLTF/GLB trong chế độ AR | Must |
| FR-AR-02 | Phát hiện mặt phẳng ngang (plane detection) | Must |
| FR-AR-03 | Cho phép di chuyển model trong AR bằng drag gesture | Must |
| FR-AR-04 | Cho phép xoay model bằng rotate gesture | Must |
| FR-AR-05 | Scale model bằng pinch-to-zoom | Should |
| FR-AR-06 | Fallback 3D viewer khi WebXR không khả dụng | Must |
| FR-AR-07 | Nút thoát AR về chế độ sản phẩm thông thường | Must |
| FR-AR-08 | Chụp ảnh màn hình AR scene | Could |
| FR-AR-09 | Đặt nhiều model cùng lúc trong AR | Could |

### 8.2 Module Danh Mục Sản Phẩm

| ID | Yêu cầu | Mức độ |
|---|---|---|
| FR-CAT-01 | Hiển thị danh mục sản phẩm dạng grid với thumbnail | Must |
| FR-CAT-02 | Phân trang hoặc infinite scroll | Must |
| FR-CAT-03 | Tìm kiếm full-text theo tên và mô tả | Must |
| FR-CAT-04 | Lọc theo: danh mục, giá, màu sắc, vật liệu | Should |
| FR-CAT-05 | Sắp xếp theo giá, mới nhất, phổ biến | Should |
| FR-CAT-06 | Trang chi tiết sản phẩm với ảnh 2D + model 3D viewer | Must |
| FR-CAT-07 | Hiển thị thông tin: tên, giá, mô tả, kích thước, vật liệu | Must |

### 8.3 Module Tùy Biến

| ID | Yêu cầu | Mức độ |
|---|---|---|
| FR-CUS-01 | Hiển thị bảng màu/vật liệu có sẵn cho sản phẩm | Must |
| FR-CUS-02 | Cập nhật texture model 3D khi chọn màu/vật liệu | Must |
| FR-CUS-03 | Cập nhật giá khi chọn variant | Should |
| FR-CUS-04 | Ghi nhớ lựa chọn khi thêm vào giỏ | Must |

### 8.4 Module Lưu & Chia Sẻ

| ID | Yêu cầu | Mức độ |
|---|---|---|
| FR-SAVE-01 | Lưu cấu hình thiết kế (danh sách sản phẩm + vị trí + màu sắc) | Must |
| FR-SAVE-02 | Tạo link chia sẻ unique | Must |
| FR-SAVE-03 | Xem thiết kế đã chia sẻ không cần đăng nhập | Must |
| FR-SAVE-04 | Danh sách thiết kế đã lưu trong tài khoản | Should |
| FR-SAVE-05 | Xóa thiết kế đã lưu | Should |

### 8.5 Module Xác Thực

| ID | Yêu cầu | Mức độ |
|---|---|---|
| FR-AUTH-01 | Đăng ký bằng email + mật khẩu | Must |
| FR-AUTH-02 | Đăng nhập trả về JWT access token | Must |
| FR-AUTH-03 | Refresh token tự động gia hạn session | Should |
| FR-AUTH-04 | Đăng xuất xóa token | Must |
| FR-AUTH-05 | Middleware bảo vệ route yêu cầu xác thực | Must |
| FR-AUTH-06 | Mật khẩu hash bằng bcrypt (salt 12) | Must |

### 8.6 Module Giỏ Hàng

| ID | Yêu cầu | Mức độ |
|---|---|---|
| FR-CART-01 | Thêm sản phẩm kèm variant vào giỏ | Must |
| FR-CART-02 | Cập nhật số lượng | Must |
| FR-CART-03 | Xóa sản phẩm khỏi giỏ | Must |
| FR-CART-04 | Tính tổng giá | Must |
| FR-CART-05 | Persist giỏ hàng khi đăng nhập | Should |
| FR-CART-06 | Trang checkout placeholder | Could |

---

## 9. Yêu Cầu Phi Chức Năng

### 9.1 Hiệu Năng

| Yêu cầu | Ngưỡng |
|---|---|
| First Contentful Paint | ≤ 2.5s (LTE) |
| Time to Interactive | ≤ 4s (LTE) |
| Model 3D load time | ≤ 5s (WiFi) |
| AR session start | ≤ 3s sau khi cho phép camera |
| API response time | ≤ 300ms (p95) |
| UI response (interactions) | ≤ 100ms |
| AR render frame rate | ≥ 30 FPS |

### 9.2 Khả Năng Tương Thích

| Platform | Yêu cầu |
|---|---|
| Android | Chrome 90+ (WebXR + model-viewer) |
| iOS | Safari 16+ (model-viewer Quick Look) |
| Desktop | Chrome/Firefox/Edge — 3D viewer |
| Màn hình | Responsive từ 375px đến 1440px |

### 9.3 Bảo Mật

- HTTPS bắt buộc (HTTP Strict Transport Security)
- JWT với expiry 15 phút (access) + 7 ngày (refresh)
- bcrypt salt rounds 12 cho mật khẩu
- Input validation (Zod) trên cả frontend và backend
- CORS whitelist domains
- Rate limiting: 100 req/min per IP
- File upload validation: chỉ chấp nhận GLTF/GLB, PNG/JPG, giới hạn 50MB

### 9.4 Khả Năng Bảo Trì

- TypeScript strict mode cả FE và BE
- ESLint + Prettier formatting
- Conventional commits
- Tài liệu API bằng OpenAPI/Swagger
- Environment variables cho tất cả secrets

### 9.5 Khả Năng Mở Rộng

- Kiến trúc tách biệt FE/BE dễ scale độc lập
- API versioning (`/api/v1/`)
- Database indexing cho các trường tìm kiếm thường xuyên
- CDN cho static assets và 3D models

---

## 10. Kiến Trúc Hệ Thống

### 10.1 Tổng Quan

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│  React 18 + Vite + TypeScript + Tailwind CSS            │
│  ┌────────────┐  ┌────────────┐  ┌───────────────────┐  │
│  │  UI Layer  │  │ Three.js   │  │  model-viewer     │  │
│  │ (React)    │  │ 3D Engine  │  │  (AR/WebXR)       │  │
│  └────────────┘  └────────────┘  └───────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │             Zustand State Management                │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS / REST API
┌──────────────────────────▼──────────────────────────────┐
│                      API LAYER                           │
│  Node.js + Express + TypeScript                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Auth    │ │ Products │ │ Designs  │ │   Cart    │  │
│  │ Service  │ │ Service  │ │ Service  │ │  Service  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │         Prisma ORM + Middleware                     │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────┬────────────────┬────────────────────┘
                    │                │
     ┌──────────────▼──┐     ┌───────▼──────────┐
     │  PostgreSQL DB  │     │  Cloudinary CDN  │
     │  (Neon/Railway) │     │  (3D Models +    │
     └─────────────────┘     │   Thumbnails)    │
                             └──────────────────┘
```

### 10.2 Cấu Trúc Thư Mục Project

Phạm vi triển khai hiện tại là frontend-only React/Vite. Backend/API trong các phần BA phía dưới có thể xem như định hướng mở rộng sau, không nằm trong cấu trúc project hiện tại.

```
tryspace/
├── public/
│   ├── models/                 # GLB/GLTF furniture models
│   ├── posters/                # Poster images for 3D viewer
│   ├── icons/                  # PWA icons
│   ├── favicon.svg
│   └── manifest.webmanifest
├── src/
│   ├── app/                    # App shell, route/view switching, providers
│   ├── components/
│   │   ├── layout/             # Header, nav, shell
│   │   └── ui/                 # Base UI primitives
│   ├── features/
│   │   ├── ar/                 # model-viewer, AR fallback, AR hooks
│   │   ├── auth/               # mock auth UI/store
│   │   ├── cart/               # localStorage cart
│   │   ├── designs/            # saved/shared designs
│   │   └── products/           # catalog, filters, detail
│   ├── shared/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── mocks/              # mock frontend services
│   │   └── types/
│   ├── styles/
│   ├── main.tsx
│   └── vite-env.d.ts
├── docs/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 11. Mô Hình Dữ Liệu

### 11.1 Prisma Schema

```prisma
// User
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  displayName  String
  avatarUrl    String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  designs      Design[]
  cartItems    CartItem[]
}

// Product
model Product {
  id          String         @id @default(cuid())
  name        String
  description String
  category    Category       @relation(fields: [categoryId], references: [id])
  categoryId  String
  basePrice   Float
  modelUrl    String         // GLB file URL (Cloudinary)
  thumbnailUrl String
  dimensions  Json           // { width, height, depth } in cm
  isActive    Boolean        @default(true)
  createdAt   DateTime       @default(now())
  variants    ProductVariant[]
  cartItems   CartItem[]
  designItems DesignItem[]
}

// ProductVariant (màu/vật liệu)
model ProductVariant {
  id          String   @id @default(cuid())
  product     Product  @relation(fields: [productId], references: [id])
  productId   String
  name        String   // "Walnut Brown", "White Oak"
  type        String   // "color" | "material"
  hexColor    String?  // #8B6914
  textureUrl  String?  // texture file URL
  priceAddon  Float    @default(0)
  cartItems   CartItem[]
}

// Category
model Category {
  id       String    @id @default(cuid())
  name     String    // "Ghế", "Bàn", "Kệ"
  slug     String    @unique
  iconUrl  String?
  products Product[]
}

// Design (thiết kế phòng đã lưu)
model Design {
  id          String       @id @default(cuid())
  user        User?        @relation(fields: [userId], references: [id])
  userId      String?
  shareToken  String       @unique @default(cuid())
  name        String       @default("My Design")
  thumbnail   String?      // screenshot URL
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  items       DesignItem[]
}

// DesignItem (từng sản phẩm trong thiết kế)
model DesignItem {
  id        String   @id @default(cuid())
  design    Design   @relation(fields: [designId], references: [id], onDelete: Cascade)
  designId  String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  variantId String?
  // AR position/rotation được lưu dạng JSON
  transform Json     // { position: {x,y,z}, rotation: {x,y,z}, scale: number }
}

// CartItem
model CartItem {
  id        String          @id @default(cuid())
  user      User            @relation(fields: [userId], references: [id])
  userId    String
  product   Product         @relation(fields: [productId], references: [id])
  productId String
  variant   ProductVariant? @relation(fields: [variantId], references: [id])
  variantId String?
  quantity  Int             @default(1)
  addedAt   DateTime        @default(now())
}
```

---

## 12. Đặc Tả API

**Base URL:** `https://api.tryspace.app/api/v1`

### 12.1 Authentication Endpoints

```
POST   /auth/register        Đăng ký tài khoản mới
POST   /auth/login           Đăng nhập, trả JWT
POST   /auth/refresh         Refresh access token
POST   /auth/logout          Đăng xuất, xóa refresh token
GET    /auth/me              Lấy thông tin user hiện tại
```

**POST /auth/register — Request:**
```json
{
  "email": "minh@example.com",
  "password": "securePass123",
  "displayName": "Nguyen Minh"
}
```

**POST /auth/login — Response:**
```json
{
  "accessToken": "eyJhbGci...",
  "user": {
    "id": "clx...",
    "email": "minh@example.com",
    "displayName": "Nguyen Minh"
  }
}
```

### 12.2 Product Endpoints

```
GET    /products             Danh sách sản phẩm (có filter/search/pagination)
GET    /products/:id         Chi tiết sản phẩm
GET    /categories           Danh sách danh mục
```

**GET /products — Query params:**
```
?search=sofa
&category=chair
&minPrice=500000
&maxPrice=5000000
&color=brown
&page=1
&limit=12
&sortBy=price_asc
```

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Ghế Sofa Oslo",
      "basePrice": 3500000,
      "thumbnailUrl": "https://res.cloudinary.com/...",
      "category": { "id": "...", "name": "Ghế", "slug": "ghe" },
      "variants": [
        { "id": "...", "name": "Walnut Brown", "type": "material", "hexColor": "#8B6914" }
      ],
      "dimensions": { "width": 180, "height": 85, "depth": 90 }
    }
  ],
  "meta": {
    "total": 48,
    "page": 1,
    "limit": 12,
    "totalPages": 4
  }
}
```

### 12.3 Design Endpoints

```
GET    /designs              Danh sách thiết kế của user (auth required)
POST   /designs              Tạo/lưu thiết kế mới (auth required)
GET    /designs/:shareToken  Xem thiết kế qua share token (public)
PUT    /designs/:id          Cập nhật thiết kế (auth required)
DELETE /designs/:id          Xóa thiết kế (auth required)
```

**POST /designs — Request:**
```json
{
  "name": "Phòng khách nhà mình",
  "thumbnail": "data:image/png;base64,...",
  "items": [
    {
      "productId": "clx...",
      "variantId": "clx...",
      "transform": {
        "position": { "x": 0, "y": 0, "z": -1.5 },
        "rotation": { "x": 0, "y": 45, "z": 0 },
        "scale": 1.0
      }
    }
  ]
}
```

### 12.4 Cart Endpoints

```
GET    /cart                 Lấy giỏ hàng (auth required)
POST   /cart/items           Thêm sản phẩm vào giỏ
PUT    /cart/items/:id       Cập nhật số lượng
DELETE /cart/items/:id       Xóa sản phẩm khỏi giỏ
DELETE /cart                 Xóa toàn bộ giỏ hàng
```

### 12.5 HTTP Status Codes Chuẩn

| Code | Ý nghĩa |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (cần đăng nhập) |
| 403 | Forbidden (không có quyền) |
| 404 | Not Found |
| 409 | Conflict (email đã tồn tại) |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## 13. Quyết Định Công Nghệ

### 13.1 Stack Công Nghệ

| Layer | Công nghệ | Phiên bản | Lý do chọn |
|---|---|---|---|
| **Frontend Framework** | React | 18 | Ecosystem lớn, Hooks, phổ biến nhất |
| **Build Tool** | Vite | 5 | Nhanh nhất, HMR tốt, hỗ trợ PWA |
| **Language** | TypeScript | 5 | Type safety, dễ maintain, IDE support |
| **3D Engine** | Three.js | r160 | Standard web 3D, nhiều tutorial |
| **AR** | @google/model-viewer | 4.x | Hỗ trợ iOS + Android tự động, 1 dòng AR |
| **Styling** | Tailwind CSS | 3 | Utility-first, nhanh build UI đẹp |
| **State** | Zustand | 4 | Nhẹ, đơn giản hơn Redux |
| **HTTP Client** | Axios | 1.x | Interceptors, dễ dùng |
| **Backend** | Node.js + Express | 20 LTS | Biết JS suốt stack, đơn giản |
| **ORM** | Prisma | 5 | Type-safe, migration tự động |
| **Database** | PostgreSQL | 15 | Mạnh, hỗ trợ JSONB cho transform data |
| **Auth** | JWT + bcrypt | — | Standard, không cần external service |
| **Storage** | Cloudinary | — | Free tier đủ dùng, CDN tốt |
| **Validation** | Zod | 3 | Schema validation FE + BE |
| **Deploy FE** | Vercel | — | Free, auto deploy từ GitHub |
| **Deploy BE** | Railway | — | Free tier PostgreSQL + Node.js |

### 13.2 Lý Do Chọn @google/model-viewer

```html
<!-- Chỉ cần dòng này để có AR hoạt động trên iOS + Android: -->
<model-viewer
  src="/models/sofa.glb"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
></model-viewer>
```

- **iOS:** Tự động dùng Quick Look (AR native của Apple)
- **Android:** Tự động dùng Scene Viewer (Google AR Core) hoặc WebXR
- **Desktop:** 3D viewer với orbit controls
- **Không cần** viết WebXR code phức tạp

### 13.3 Kiến Trúc AR Hybrid

```
Người dùng mở AR
       │
       ▼
Phát hiện thiết bị/browser
       │
  ┌────┴────┐
  │         │
Android   iOS/Mac
  │         │
  ▼         ▼
WebXR   Quick Look
(Chrome)  (Safari)
  │         │
  └────┬────┘
       │
model-viewer
handle tự động
```

---

## 14. Workflow Người Dùng

### 14.1 Luồng Chính (Happy Path)

```
[Landing Page]
      │ Nhấn "Khám phá nội thất"
      ▼
[Trang Danh Mục]
      │ Tìm kiếm "ghế sofa" / Browse
      ▼
[Trang Sản Phẩm]
      │ Xem 3D preview, chọn màu
      ▼
      ├─── Nhấn "Thử trong phòng" ──► [AR View]
      │                                    │ Đặt model, xem từ nhiều góc
      │                                    │ Nhấn "Lưu thiết kế"
      │                                    ▼
      │                               [Đăng nhập/Đăng ký]
      │                                    │
      │                               [Thiết kế được lưu]
      │                                    │ Copy link chia sẻ
      │                                    ▼
      │                               [Chia sẻ cho bạn bè]
      │
      └─── Nhấn "Thêm vào giỏ" ──► [Giỏ hàng]
                                        │ Kiểm tra đơn
                                        ▼
                                   [Checkout (mock)]
```

### 14.2 Sitemap

```
/                           Landing page
/products                   Danh mục sản phẩm
/products/:id               Chi tiết + 3D viewer + AR
/auth/login                 Đăng nhập
/auth/register              Đăng ký
/designs                    Danh sách thiết kế đã lưu (auth)
/designs/:shareToken        Xem thiết kế được chia sẻ (public)
/cart                       Giỏ hàng (auth)
/checkout                   Thanh toán (mock/placeholder)
/account                    Tài khoản người dùng (auth)
```

---

## 15. Rủi Ro & Giải Pháp

| Rủi ro | Xác suất | Tác động | Giải pháp |
|---|---|---|---|
| WebXR không hoạt động trên iOS | Cao | Cao | Dùng model-viewer Quick Look (native iOS AR) |
| 3D model file quá nặng, tải chậm | Trung bình | Cao | Compress GLB < 5MB, lazy load, loading skeleton |
| Camera permission bị từ chối | Trung bình | Cao | Hướng dẫn cấp quyền rõ ràng + fallback 3D viewer |
| AR không stable, model nhảy lung tung | Trung bình | Trung bình | model-viewer đã handle, dùng AR stability API |
| Thiếu thời gian hoàn thành đủ tính năng | Cao | Trung bình | Feature flag, ưu tiên Must Have trước |
| PostgreSQL trên Railway hết free tier | Thấp | Thấp | Backup sang Neon.tech (PostgreSQL free 512MB) |
| 3D model không tìm được miễn phí | Thấp | Trung bình | Sketchfab, Google Poly, KhronosGroup samples |

---

## 16. Phạm Vi & Giới Hạn

### 16.1 Trong Phạm Vi (In Scope)

- Web PWA chạy trên Chrome (Android) và Safari (iOS 16+)
- AR placement cho 1 sản phẩm tại một thời điểm
- Danh mục tĩnh (~20 sản phẩm mẫu) với 3D models
- Đổi màu/vật liệu qua preset có sẵn
- Lưu & chia sẻ thiết kế qua link
- Auth cơ bản (email/password)
- Giỏ hàng (không thanh toán thật)

### 16.2 Ngoài Phạm Vi (Out of Scope)

- Thanh toán thật (Momo, VNPay, Stripe)
- AI đề xuất nội thất tự động
- Đa người dùng chỉnh sửa thiết kế cùng lúc
- Upload model 3D từ người dùng
- Ứng dụng native iOS/Android
- Tích hợp với hệ thống quản lý kho hàng

---

## 17. Glossary

| Thuật ngữ | Định nghĩa |
|---|---|
| AR (Augmented Reality) | Công nghệ chồng phủ đối tượng ảo lên thế giới thực qua camera |
| WebXR | Web API cho phép trải nghiệm XR (AR/VR) trực tiếp trên browser |
| GLTF/GLB | Format file 3D chuẩn cho web (GL Transmission Format) |
| Plane Detection | Khả năng nhận biết mặt phẳng (sàn nhà, bàn) trong AR |
| model-viewer | Web component của Google để hiển thị 3D/AR trên browser |
| Quick Look | Tính năng AR native của Apple trên iOS |
| Scene Viewer | Tính năng AR của Google trên Android |
| PWA | Progressive Web App — web app có thể cài đặt như native app |
| JWT | JSON Web Token — phương thức xác thực stateless |
| Zustand | Thư viện state management nhẹ cho React |
| Prisma | TypeScript ORM cho Node.js |
| Cloudinary | Dịch vụ cloud lưu trữ và CDN cho ảnh/video/3D |
| GLB | Binary version của GLTF, file đơn chứa tất cả assets |
| Variant | Biến thể của sản phẩm (màu sắc, vật liệu khác nhau) |
| Transform | Vị trí + góc xoay + tỉ lệ của object trong không gian 3D |

---

*Tài liệu này được tạo cho mục đích học thuật. Phiên bản 1.0.0*
