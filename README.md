# Hệ thống Quản lý Nhập Xuất Kho Thiết bị CNTT (EIM)

Ứng dụng web quản lý kho thiết bị CNTT, hỗ trợ theo dõi tồn kho, phiếu nhập/xuất, danh mục, nhà cung cấp và phân quyền theo vai trò **Admin** / **Staff**.

* **Link chạy thử trên Vercel:** [https://manage-it-equipment-inventory.vercel.app/](https://manage-it-equipment-inventory.vercel.app/)

---

## Cấu trúc dự án

```
manage-it-equipment-inventory/
├── .github/
│   └── workflows/
│       └── ci.yml       # Pipeline CI/CD (GitHub Actions)
├── backend/             # API REST (Node.js + Express + Sequelize)
├── frontend/            # Giao diện web (React + Vite)
├── database/            # Script SQL khởi tạo cơ sở dữ liệu (đồng bộ với migrations)
├── docker-compose.yml   # Cấu hình chạy nhanh toàn bộ dự án với Docker
└── README.md
```

## Công nghệ sử dụng

| Thành phần | Công nghệ                                   |
| ---------- | ------------------------------------------- |
| Backend    | Node.js, Express, Sequelize, MySQL, JWT, Socket.io |
| Frontend   | React 19, Vite, Bootstrap, Redux Toolkit, React Router 7, Motion |
| Database   | MySQL (`warehouse_it_db`)                   |
| CI/CD      | GitHub Actions                              |

## Yêu cầu hệ thống

- [Node.js](https://nodejs.org/) >= 18
- [MySQL](https://www.mysql.com/) >= 8
- [Docker & Docker Compose](https://www.docker.com/) (Tùy chọn - nếu chạy qua Docker)
- npm hoặc yarn

---

## Tài khoản dùng thử (Production / Vercel)

Bạn có thể sử dụng các tài khoản sau để test trực tiếp trên link Vercel:

| Vai trò | Email | Mật khẩu |
| ------- | ----- | -------- |
| **Admin** | `admin@gmail.com` | `123456` |
| **Staff** (Nhân viên) | `nhanvien@gmail.com` | `1234567` |

---

## Hướng dẫn chạy dự án

### Cách 1: Chạy nhanh bằng Docker (Khuyến nghị)

Dự án đã cấu hình sẵn Docker Compose giúp khởi tạo nhanh cơ sở dữ liệu MySQL, Backend và Frontend chỉ với một dòng lệnh:

```bash
docker-compose up -d --build
```

Sau khi hoàn tất:
- **Frontend** chạy tại: `http://localhost:3000`
- **Backend** chạy tại: `http://localhost:8080`
- **Database MySQL** lắng nghe ở cổng: `3306` (Mật khẩu root: `123456`, Database: `warehouse_it_db`)

---

### Cách 2: Chạy thủ công trên Local

#### 1. Clone repository

```bash
git clone <repository-url>
cd manage-it-equipment-inventory
```

#### 2. Khởi tạo cơ sở dữ liệu

Schema được quản lý tập trung qua **Sequelize migrations** (`backend/src/migrations/`). File `database/quanlykho.sql` là bản SQL tương đương để import nhanh.

* **Cách A — Migration + Seeder (khuyến nghị):**
  ```bash
  cd backend
  npm install
  cp .env.example .env   # Windows: copy .env.example .env
  # Cập nhật thông tin kết nối DB trong backend/.env
  npx sequelize-cli db:migrate
  npx sequelize-cli db:seed:all
  ```

* **Cách B — Import file SQL:**
  ```bash
  mysql -u root -p < database/quanlykho.sql
  ```

> *Mặc định cơ sở dữ liệu mẫu được cài sẵn tài khoản Admin: `admin@gmail.com` / `123456` và Staff: `staff01@gmail.com` / `123456`.*

#### 3. Chạy Backend

```bash
cd backend
npm install
npm start
```
API mặc định chạy tại: `http://localhost:6969/api` (hoặc cổng cấu hình trong `PORT`)

#### 4. Chạy Frontend

```bash
cd frontend
cp .env.example .env   # Windows: copy .env.example .env
# Thiết lập VITE_API_URL=http://localhost:6969/api trong frontend/.env
npm install
npm run dev
```
Giao diện mặc định chạy tại: `http://localhost:5173`

---

## Tính năng nổi bật & Bảo mật nâng cao

- **Đăng ký tài khoản kèm OTP**: Người dùng mới phải xác thực email qua mã OTP (gửi qua Gmail SMTP).
  > *Lưu ý: Nếu việc gửi mail gặp lỗi (SMTP không cấu hình/bị chặn), hệ thống sẽ kích hoạt chế độ fallback trả trực tiếp mã OTP về API response để thuận tiện cho việc dev/test.*
- **Xác thực 2 lớp (2FA/TOTP) cho Admin**: Admin có thể bật xác thực hai lớp tại `/setup-2fa` để bảo mật tài khoản.
- **Khóa tài khoản**: Admin có quyền khóa/mở khóa tài khoản người dùng (`is_locked`).
- **Phân quyền chặt chẽ (Role-based Authorization)**:
  - **Admin**: Toàn quyền quản trị danh mục, nhà cung cấp, thiết bị, duyệt phiếu nhập/xuất, cấu hình hệ thống, quản lý người dùng và xem nhật ký.
  - **Staff**: Thực hiện nghiệp vụ nhập xuất kho, kiểm kho, xem thiết bị và tạo phiếu. Không thể duyệt phiếu, sửa danh mục, sửa nhà cung cấp, quản lý user hoặc xem logs hệ thống.
  - **Profile Settings**: Cho phép cả Admin và Staff tự quản lý thông tin cá nhân và thay đổi mật khẩu thông qua shortcut `/profile` trên thanh Sidebar.

---

## Tích hợp CI/CD

Dự án sử dụng **GitHub Actions** để tự động kiểm tra chất lượng code:
- Cấu hình file tại `.github/workflows/ci.yml`.
- Tự động chạy `npm install`, `npm test` và `npm run build` cho cả frontend và backend mỗi khi có sự kiện `push` hoặc `pull_request` trên các nhánh `main` và `develop`.

---

## Tài liệu chi tiết của từng thành phần

- [Backend README](./backend/README.md) — API chi tiết, Cấu hình môi trường, Migrations & Seeders
- [Frontend README](./frontend/README.md) — Cấu trúc Giao diện, Route, State Management, Build & Deploy

---

## Các script phát triển hữu ích

```bash
# Backend
cd backend && npm run dev      # Chạy development (nodemon)
cd backend && npm test         # Chạy unit test với Jest

# Frontend
cd frontend && npm run dev      # Chạy development
cd frontend && npm run build    # Build production (dist/)
cd frontend && npm run preview  # Chạy thử bản build production local
cd frontend && npm run lint     # Kiểm tra lỗi cú pháp code
```
