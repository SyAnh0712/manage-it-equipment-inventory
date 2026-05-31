# Hệ thống Quản lý Nhập Xuất Kho Thiết bị CNTT (EIM)

Ứng dụng web quản lý kho thiết bị CNTT, hỗ trợ theo dõi tồn kho, phiếu nhập/xuất, danh mục, nhà cung cấp và phân quyền theo vai trò **Admin** / **Staff**.

## Cấu trúc dự án

```
manage-it-equipment-inventory/
├── backend/     # API REST (Node.js + Express + Sequelize)
├── frontend/    # Giao diện web (React + Vite)
├── database/    # Script SQL khởi tạo cơ sở dữ liệu
└── README.md
```

## Công nghệ sử dụng

| Thành phần | Công nghệ                                   |
| ---------- | ------------------------------------------- |
| Backend    | Node.js, Express, Sequelize, MySQL, JWT     |
| Frontend   | React, Vite, Bootstrap, Redux, React Router |
| Database   | MySQL (`warehouse_it_db`)                   |

## Yêu cầu hệ thống

- [Node.js](https://nodejs.org/) >= 18
- [MySQL](https://www.mysql.com/) >= 8
- npm hoặc yarn

## Cài đặt nhanh

### 1. Clone repository

```bash
git clone <repository-url>
cd manage-it-equipment-inventory
```

### 2. Khởi tạo cơ sở dữ liệu

**Cách 1 — Import file SQL (khuyến nghị cho demo):**

```bash
mysql -u root -p < database/quanlykho.sql
```

**Cách 2 — Dùng Sequelize CLI:**

```bash
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 3. Chạy Backend

```bash
cd backend
cp .env.example .env   # Windows: copy .env.example .env
npm install
npm start
```

API mặc định: `http://localhost:6969/api`

### 4. Chạy Frontend

```bash
cd frontend
cp .env.example .env   # Windows: copy .env.example .env
npm install
npm run dev
```

Giao diện mặc định: `http://localhost:5173`

> Đặt `VITE_API_URL=http://localhost:6969/api` trong `frontend/.env` để frontend trỏ đúng backend.

## Tài khoản mẫu

| Vai trò | Email             | Mật khẩu |
| ------- | ----------------- | -------- |
| Admin   | admin@gmail.com   | 123456   |
| Staff   | staff01@gmail.com | 123456   |

> Nếu đăng nhập thất bại sau khi import SQL, hãy dùng chức năng **Đăng ký** để tạo tài khoản mới (mật khẩu sẽ được mã hóa bcrypt).

## Phân quyền

| Chức năng                  | Admin |    Staff    |
| -------------------------- | :---: | :---------: |
| Quản lý người dùng         |   ✓   |      ✗      |
| Quản lý danh mục           |   ✓   |      ✗      |
| Quản lý nhà cung cấp       |   ✓   |      ✗      |
| Thêm / Sửa / Xóa thiết bị  |   ✓   |      ✗      |
| Xem thiết bị / Kiểm kê kho |   ✓   |      ✓      |
| Tạo phiếu nhập / xuất      |   ✓   |      ✓      |
| Duyệt phiếu nhập / xuất    |   ✓   |      ✗      |
| Điều chỉnh tồn kho         |   ✓   |      ✗      |
| Báo cáo thống kê           |   ✓   | Xem hạn chế |
| Nhật ký hệ thống           |   ✓   |      ✗      |

## Tài liệu chi tiết

- [Backend README](./backend/README.md) — API, cấu hình, migration
- [Frontend README](./frontend/README.md) — Giao diện, biến môi trường, build

## Scripts hữu ích

```bash
# Backend
cd backend && npm run dev      # Chạy development
cd backend && npm test         # Chạy unit test

# Frontend
cd frontend && npm run dev      # Chạy development
cd frontend && npm run build    # Build production
cd frontend && npm run preview  # Xem bản build
```
