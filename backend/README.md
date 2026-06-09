# Backend — EIM API

REST API cho hệ thống Quản lý Nhập Xuất Kho Thiết bị CNTT, xây dựng bằng **Node.js**, **Express** và **Sequelize ORM** (MySQL).

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/          # Cấu hình DB, JWT, Sequelize
│   ├── controllers/     # Xử lý request/response
│   ├── middlewares/     # Auth, role, validation, error
│   ├── migrations/      # Migration Sequelize (nguồn schema chính)
│   ├── models/          # Model Sequelize (ánh xạ bảng, không tự sửa DB)
│   ├── routes/          # Định nghĩa API routes
│   ├── seeders/         # Dữ liệu mẫu
│   ├── services/        # Business logic
│   ├── utils/           # Helper (password, token, upload, OTP, 2FA)
│   ├── app.js           # Cấu hình Express
│   └── server.js        # Entry point
├── tests/               # Unit test (Jest)
├── uploads/             # File upload (ảnh thiết bị, danh mục)
├── .env.example
└── package.json
```

## Quản lý schema database

Schema được định nghĩa **một lần** trong migrations, models chỉ ánh xạ cấu trúc đó:

| Migration | Bảng |
|-----------|------|
| `01-migrations-user.js` | `users` (gồm `is_locked`, 2FA) |
| `02-migrations-catagory.js` | `categories` |
| `03-migrations-supplier.js` | `suppliers` |
| `04-migrations-equipment.js` | `equipment` |
| `05-migrations-importOrder.js` | `import_orders` |
| `06-migrations-importOrderDetail.js` | `import_order_details` |
| `07-migrations-exportOrder.js` | `export_orders` |
| `08-migrations-exportOrderDetail.js` | `export_order_details` |
| `09-migrations-inventoryLog.js` | `inventory_logs` |
| `11-create-pending-users.js` | `pending_users` |

Khi khởi động, server **chỉ kết nối** database (`sequelize.authenticate()`), không gọi `sync({ alter: true })`. Mọi thay đổi cột/bảng mới phải thêm migration tương ứng.

File `database/quanlykho.sql` ở thư mục gốc là bản SQL đồng bộ với migrations, dùng cho import nhanh.

## Yêu cầu

- Node.js >= 18
- MySQL >= 8

## Cài đặt

```bash
cd backend
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

Chỉnh sửa file `.env`:

```env
PORT=6969
BASE_URL_BACKEND=http://localhost:6969

NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=warehouse_it_db
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=30d

FRONTEND_URL=http://localhost:5173

# Email (Nodemailer) — bỏ trống để hiện OTP trên màn hình (dev)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASSWORD=

OTP_EXPIRES_MINUTES=5

# Khóa mã hóa secret 2FA (32 ký tự hex)
TWO_FACTOR_ENCRYPTION_KEY=
```

## Khởi tạo database

**Cách 1 — Migration + Seeder (khuyến nghị):**

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

**Cách 2 — Import SQL từ thư mục gốc:**

```bash
mysql -u root -p < ../database/quanlykho.sql
```

## Chạy ứng dụng

```bash
# Development (nodemon)
npm run dev

# Production
npm start
```

Server chạy tại: `http://localhost:6969`  
Base API: `http://localhost:6969/api/v1` (alias tạm: `/api`)

## API Endpoints

| Nhóm | Prefix | Mô tả |
|------|--------|-------|
| Health | `/api/v1/health` | Kiểm tra trạng thái service và database |
| Auth | `/api/v1/auth` | Đăng nhập, đăng ký OTP, 2FA, refresh token |
| Users | `/api/v1/users` | Quản lý người dùng, khóa/mở khóa (Admin) |
| Categories | `/api/v1/categories` | Quản lý danh mục |
| Suppliers | `/api/v1/suppliers` | Quản lý nhà cung cấp |
| Equipment | `/api/v1/equipment` | Quản lý thiết bị |
| Imports | `/api/v1/imports` | Phiếu nhập kho |
| Exports | `/api/v1/exports` | Phiếu xuất kho |
| Inventory Logs | `/api/v1/inventory-logs` | Nhật ký kho, điều chỉnh tồn |
| Dashboard | `/api/v1/dashboard` | Thống kê, báo cáo |

### Auth — luồng chính

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập (trả `requires2FA` nếu admin bật 2FA) |
| POST | `/api/auth/register` | Gửi OTP đăng ký |
| POST | `/api/auth/verify-otp` | Xác thực OTP, tạo tài khoản |
| POST | `/api/auth/resend-otp` | Gửi lại OTP |
| POST | `/api/auth/verify-2fa` | Xác thực mã TOTP sau đăng nhập |
| POST | `/api/auth/setup-2fa` | Tạo QR code thiết lập 2FA |
| POST | `/api/auth/confirm-2fa` | Xác nhận bật 2FA |
| POST | `/api/auth/disable-2fa` | Tắt 2FA |
| POST | `/api/auth/refresh-token` | Làm mới access token |

### Ví dụ

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

```http
GET /api/equipment
Authorization: Bearer <token>
```

## Phân quyền (Role Middleware)

- **`admin`**: Toàn quyền quản trị
- **`staff`**: Xem thiết bị, tạo phiếu nhập/xuất, kiểm kê kho; không duyệt phiếu, không quản lý danh mục/NCC/người dùng, không xem nhật ký hệ thống

Các route bảo vệ bằng `authMiddleware` (JWT) và `roleMiddleware("admin")` khi cần.

## Upload file

Ảnh thiết bị và danh mục được lưu tại thư mục `uploads/`, phục vụ qua `/uploads/<filename>`.

## Testing

Chạy toàn bộ unit test:

```bash
npm test
```

### Cấu trúc tests

```
tests/
├── importOrder.test.js      # Duyệt/từ chối/xóa phiếu nhập, phân quyền staff
├── exportOrder.test.js      # Duyệt phiếu xuất, kiểm tra tồn kho
├── inventoryLog.test.js     # Điều chỉnh kho, phân trang log
├── dashboardService.test.js # Thống kê admin vs staff
├── roleMiddleware.test.js   # Phân quyền middleware (401/403)
├── httpError.test.js        # Helper xử lý lỗi HTTP
└── passwordHelper.test.js   # Mã hóa và so sánh mật khẩu bcrypt
```

Test dùng **Jest** với mock Sequelize models (`jest.mock("../src/models")`), không cần kết nối database thật khi chạy test.

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy server với nodemon |
| `npm start` | Chạy server production |
| `npm test` | Chạy Jest test |
