# Backend — EIM API

REST API cho hệ thống Quản lý Nhập Xuất Kho Thiết bị CNTT, xây dựng bằng **Node.js**, **Express** và **Sequelize ORM** (MySQL).

---

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/          # Cấu hình DB, JWT, Sequelize (gồm cấu hình production/test)
│   ├── controllers/     # Xử lý request/response
│   ├── middlewares/     # Auth, role, validation, error
│   ├── migrations/      # Migration Sequelize (nguồn định nghĩa database schema chính)
│   ├── models/          # Model Sequelize (ánh xạ bảng)
│   ├── routes/          # Định nghĩa API routes
│   ├── seeders/         # Dữ liệu mẫu (admin và staff mặc định)
│   ├── services/        # Business logic (đăng ký OTP, 2FA, dashboard...)
│   ├── utils/           # Helper (cookieHelper, emailHelper, passwordHelper...)
│   ├── app.js           # Cấu hình Express, CORS động, Helmet
│   └── server.js        # Entry point (chạy server và khởi tạo Socket.io)
├── tests/               # Unit test (Jest)
├── uploads/             # File upload (ảnh thiết bị, danh mục)
├── .env.example
└── package.json
```

## Quản lý schema database

Schema được định nghĩa **một lần** trong migrations, models chỉ ánh xạ cấu trúc đó:

| Migration | Bảng |
|-----------|------|
| `01-migrations-user.js` | `users` (gồm `is_locked`, `two_factor_enabled`, `two_factor_secret`) |
| `02-migrations-category.js` | `categories` (Đã được chỉ định explicit tableName: `categories`) |
| `03-migrations-supplier.js` | `suppliers` (Đã được chỉ định explicit tableName: `suppliers`) |
| `04-migrations-equipment.js` | `equipment` |
| `05-migrations-importOrder.js` | `import_orders` |
| `06-migrations-importOrderDetail.js` | `import_order_details` |
| `07-migrations-exportOrder.js` | `export_orders` |
| `08-migrations-exportOrderDetail.js` | `export_order_details` |
| `09-migrations-inventoryLog.js` | `inventory_logs` |
| `11-create-pending-users.js` | `pending_users` (lưu trữ thông tin chờ xác thực OTP) |

> **Quy chuẩn kết nối:** Khi khởi động, server **chỉ kết nối** database (`sequelize.authenticate()`), tuyệt đối không gọi `sync({ alter: true })`. Mọi thay đổi cấu trúc bảng bắt buộc phải tạo file migration mới.

---

## Cấu hình môi trường (`.env`)

Cài đặt các gói phụ thuộc và tạo file `.env`:

```bash
cd backend
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

Thiết lập nội dung cho `.env` phù hợp với môi trường của bạn:

```env
PORT=8080
BASE_URL_BACKEND=http://localhost:8080/api

NODE_ENV=development # Sử dụng 'production' khi deploy lên Render/VPS

# Cơ sở dữ liệu MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=warehouse_it_db
DB_USER=root
DB_PASSWORD=your_password

# Bảo mật JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES=30d

# Địa chỉ Frontend (Để cấu hình CORS)
FRONTEND_URL=http://localhost:5173

# Cấu hình Email gửi OTP (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password

OTP_EXPIRES_MINUTES=5

# Khóa mã hóa 2FA (Chuỗi 32 ký tự hex ngẫu nhiên)
TWO_FACTOR_ENCRYPTION_KEY=
```

---

## Cơ chế gửi OTP & Fallback đăng ký

- **Cấu hình SMTP Gmail:** Hệ thống sử dụng kết nối SMTP qua IPv4 (`family: 4`) đối với dịch vụ Gmail để tránh các lỗi phân giải DNS hoặc nghẽn cổng kết nối ở một số nền tảng hosting.
- **Tính năng Fallback thông minh:** Khi đăng ký tài khoản, nếu việc gửi email OTP thất bại (do chưa điền thông tin email gửi, sai mật khẩu ứng dụng Gmail hoặc bị giới hạn mạng), hệ thống sẽ **không báo lỗi 500**. Thay vào đó, backend sẽ in ra log `MAIL ERROR`, lưu tài khoản tạm thời vào bảng `pending_users` và trả mã OTP trực tiếp trong HTTP Response:
  ```json
  {
    "message": "Không gửi được email nhưng tài khoản chờ xác thực đã được tạo",
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
  *Thiết lập này giúp việc chạy thử và phát triển tại môi trường local hoặc staging diễn ra trơn tru mà không bắt buộc cấu hình SMTP thực tế.*

---

## Bảo mật CORS & Cross-Site Cookies trong Production

Để hỗ trợ việc deploy frontend trên Vercel và backend trên các cloud services khác (như Render, Heroku...):
1. **Dynamic CORS:** Backend tự động cấu hình whitelist cho các yêu cầu đến từ:
   - `http://localhost:5173` (local development)
   - `https://manage-it-equipment-inventory.vercel.app` (production chính)
   - Bất kỳ URL preview động nào kết thúc bằng `.vercel.app`.
2. **Cấu hình Cookie an toàn (Cross-Site Cookies):**
   - Khi chạy ở môi trường `production`, cookies chứa Token xác thực (`access_token`, `refresh_token`) sẽ được cấu hình với:
     ```js
     secure: true,
     sameSite: "none"
     ```
   - Điều này cho phép trình duyệt của Client nhận diện và lưu trữ cookies từ domain API khác về domain Vercel một cách an toàn mà không bị trình duyệt chặn (khắc phục lỗi cross-site cookie).

---

## Khởi tạo database

**Cách 1 — Migration + Seeder (Khuyến nghị):**
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
*Tạo cơ sở dữ liệu và insert các dữ liệu mẫu cho Categories, Suppliers, Equipment, và tài khoản mặc định.*

**Cách 2 — Import SQL từ thư mục gốc:**
```bash
mysql -u root -p < ../database/quanlykho.sql
```

---

## Chạy ứng dụng

```bash
# Môi trường Development (tự khởi động lại qua nodemon)
npm run dev

# Môi trường Production
npm start
```
Server chạy tại: `http://localhost:8080` (API routes trỏ qua `/api` hoặc `/api/v1`)

---

## API Endpoints chính

| Nhóm | Prefix | Mô tả |
|------|--------|-------|
| Health | `/api/v1/health` | Kiểm tra kết nối database & dịch vụ |
| Auth | `/api/v1/auth` | Đăng nhập, đăng ký OTP, xác thực 2FA, thiết lập TOTP, refresh token |
| Users | `/api/v1/users` | Quản lý tài khoản người dùng, khóa/mở khóa (Admin) |
| Categories | `/api/v1/categories` | Quản lý danh mục thiết bị (Admin) |
| Suppliers | `/api/v1/suppliers` | Quản lý nhà cung cấp (Admin) |
| Equipment | `/api/v1/equipment` | Quản lý thiết bị & số lượng tồn kho |
| Imports | `/api/v1/imports` | Lập và duyệt phiếu nhập kho |
| Exports | `/api/v1/exports` | Lập và duyệt phiếu xuất kho |
| Inventory Logs | `/api/v1/inventory-logs` | Theo dõi nhật ký kho, điều chỉnh số lượng |
| Dashboard | `/api/v1/dashboard` | Thống kê số lượng, cảnh báo hết hàng, doanh số |

### Chi tiết luồng Auth & 2FA

- **Đăng nhập (`POST /api/auth/login`):** Trả về `accessToken` và `refreshToken` dưới dạng HttpOnly cookie. Nếu tài khoản Admin đã bật 2FA, trả về trạng thái `{ requires2FA: true, tempToken: "..." }` yêu cầu tiếp tục gọi API `/verify-2fa`.
- **Thiết lập 2FA (`POST /api/auth/setup-2fa`):** Admin kích hoạt xác thực 2 lớp sẽ nhận về chuỗi mã QR dạng SVG để quét bằng Google Authenticator/Authy.
- **Xác nhận 2FA (`POST /api/auth/confirm-2fa`):** Gửi mã 6 số từ ứng dụng xác thực để chính thức kích hoạt.

---

## Unit Testing

Backend sử dụng framework **Jest** và thư viện **Supertest** để kiểm thử tự động các luồng xử lý và phân quyền:

```bash
npm test
```

- **Mocks Models:** Bộ test thực hiện giả lập cấu trúc Sequelize models (`jest.mock("../src/models")`), đảm bảo các test-case có thể chạy độc lập, tốc độ cực nhanh mà không cần kết nối tới database MySQL thật.
- **Các file test chính (`tests/`):**
  - `roleMiddleware.test.js`: Kiểm thử kiểm tra quyền hạn (trả về 401 hoặc 403 khi staff cố tình gọi API admin).
  - `importOrder.test.js` & `exportOrder.test.js`: Kiểm thử luồng tạo phiếu, duyệt/từ chối phiếu và kiểm tra tồn kho.
  - `inventoryLog.test.js`: Kiểm tra việc ghi nhật ký kho khi thay đổi thông tin thiết bị và phân trang logs.
  - `dashboardService.test.js`: Kiểm thử dữ liệu thống kê trả về cho Admin so với Staff.
  - `passwordHelper.test.js` & `httpError.test.js`: Kiểm thử các module tiện ích và xử lý lỗi HTTP.

---

## Các script phát triển

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Khởi chạy server ở chế độ Development với Nodemon |
| `npm start` | Khởi chạy server ở chế độ Production |
| `npm test` | Chạy bộ kiểm thử tự động Jest |
