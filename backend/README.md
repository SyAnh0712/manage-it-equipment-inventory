# Backend — EIM API

REST API cho hệ thống Quản lý Nhập Xuất Kho Thiết bị CNTT, xây dựng bằng **Node.js**, **Express** và **Sequelize ORM** (MySQL).

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/          # Cấu hình DB, JWT, Sequelize
│   ├── controllers/     # Xử lý request/response
│   ├── middlewares/     # Auth, role, validation, error
│   ├── migrations/      # Migration Sequelize
│   ├── models/          # Model Sequelize
│   ├── routes/          # Định nghĩa API routes
│   ├── seeders/         # Dữ liệu mẫu
│   ├── services/        # Business logic
│   ├── utils/           # Helper (password, token, upload)
│   ├── app.js           # Cấu hình Express
│   └── server.js        # Entry point
├── tests/               # Unit test (Jest)
├── uploads/             # File upload (ảnh thiết bị, danh mục)
├── .env.example
└── package.json
```

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
```

## Khởi tạo database

**Cách 1 — Import SQL từ thư mục gốc:**

```bash
mysql -u root -p < ../database/quanlykho.sql
```

**Cách 2 — Migration + Seeder:**

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## Chạy ứng dụng

```bash
# Development (nodemon)
npm run dev

# Production
npm start
```

Server chạy tại: `http://localhost:6969`  
Base API: `http://localhost:6969/api`

## API Endpoints

| Nhóm | Prefix | Mô tả |
|------|--------|-------|
| Auth | `/api/auth` | Đăng nhập, đăng ký |
| Users | `/api/users` | Quản lý người dùng (Admin) |
| Categories | `/api/categories` | Quản lý danh mục |
| Suppliers | `/api/suppliers` | Quản lý nhà cung cấp |
| Equipment | `/api/equipment` | Quản lý thiết bị |
| Imports | `/api/imports` | Phiếu nhập kho |
| Exports | `/api/exports` | Phiếu xuất kho |
| Inventory Logs | `/api/inventory-logs` | Nhật ký kho, điều chỉnh tồn |
| Dashboard | `/api/dashboard` | Thống kê, báo cáo |

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
