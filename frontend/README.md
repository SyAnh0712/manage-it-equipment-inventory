# Frontend — EIM Web App

Giao diện web cho hệ thống Quản lý Nhập Xuất Kho Thiết bị CNTT, xây dựng bằng **React 19** và **Vite**.

## Cấu trúc thư mục

```
frontend/
├── public/              # Tài nguyên tĩnh
├── src/
│   ├── assets/          # CSS, hình ảnh
│   ├── components/      # Component tái sử dụng (UI, form, layout)
│   ├── context/         # AuthContext
│   ├── hooks/           # Custom hooks (useAuth, usePagination, ...)
│   ├── layouts/         # AdminLayout, AuthLayout
│   ├── pages/           # Trang theo module
│   ├── routes/          # Định nghĩa routing, ProtectedRoute
│   ├── services/        # Gọi API (axios)
│   ├── utils/           # Constants, format, export Excel/PDF
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── vite.config.js
└── package.json
```

## Yêu cầu

- Node.js >= 18
- Backend API đang chạy (xem [Backend README](../backend/README.md))

## Cài đặt

```bash
cd frontend
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

Chỉnh sửa file `.env`:

```env
PORT=5173
VITE_API_URL=http://localhost:6969/api
```

> `VITE_API_URL` phải trỏ đúng URL backend (mặc định backend chạy cổng `6969`).

## Chạy ứng dụng

```bash
# Development
npm run dev

# Build production
npm run build

# Xem bản build local
npm run preview

# Kiểm tra lint
npm run lint
```

Ứng dụng chạy tại: `http://localhost:5173`

## Tính năng giao diện

| Module            | Route             | Mô tả                            |
| ----------------- | ----------------- | -------------------------------- |
| Dashboard         | `/dashboard`      | Thống kê theo vai trò            |
| Profile           | `/profile`        | Hồ sơ cá nhân, đổi mật khẩu      |
| Equipment         | `/equipment`      | Danh sách thiết bị / kiểm kê kho |
| Categories        | `/categories`     | Quản lý danh mục (Admin)         |
| Suppliers         | `/suppliers`      | Quản lý nhà cung cấp (Admin)     |
| Import Orders     | `/imports`        | Phiếu nhập kho                   |
| Export Orders     | `/exports`        | Phiếu xuất kho                   |
| Inventory History | `/inventory-logs` | Nhật ký kho (Admin)              |
| Users             | `/users`          | Quản lý người dùng (Admin)       |

### Xác thực

| Route          | Mô tả                                      |
| -------------- | ------------------------------------------ |
| `/login`       | Đăng nhập                                  |
| `/register`    | Đăng ký tài khoản mới                      |
| `/verify-otp`  | Nhập mã OTP sau đăng ký                    |
| `/verify-2fa`  | Nhập mã TOTP khi admin bật 2FA             |
| `/setup-2fa`   | Thiết lập xác thực hai lớp (Admin)         |

## Phân quyền giao diện

- Route bảo vệ qua `ProtectedRoute` — yêu cầu đăng nhập
- Route `adminOnly` — chỉ Admin truy cập (Users, Categories, Suppliers, Inventory History, ...)
- Sidebar và nút thao tác ẩn/hiện theo `user.role`

### Staff thấy

Dashboard, Profile, Kiểm kê kho (Equipment), Import/Export Orders

### Admin thêm

Users, Categories, Suppliers, Inventory History, nút duyệt phiếu, CRUD thiết bị, thiết lập 2FA

## Công nghệ chính

- **React 19** + **Vite 8**
- **React Router** — routing
- **Redux Toolkit** + **redux-persist** — state & auth
- **React Bootstrap** — UI components
- **Axios** — HTTP client (`src/services/axiosClient.js`)
- **React Hook Form** + **Yup** — form validation
- **react-toastify** — thông báo
- **xlsx**, **jspdf** — xuất báo cáo Excel/PDF

## Kết nối API

Token JWT lưu trong `localStorage` (`authToken`). Axios interceptor tự gắn header:

```
Authorization: Bearer <token>
```

Khi API trả `401`, ứng dụng tự đăng xuất và chuyển về `/login`.

## Build production

```bash
npm run build
```

Thư mục output: `dist/` — deploy lên Nginx, Vercel, Netlify hoặc serve tĩnh.

Đảm bảo biến `VITE_API_URL` trỏ đúng URL API production trước khi build.
