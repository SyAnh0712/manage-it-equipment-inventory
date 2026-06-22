# Frontend — EIM Web App

Giao diện web cho hệ thống Quản lý Nhập Xuất Kho Thiết bị CNTT, xây dựng bằng **React 19** và **Vite**.

---

## Cấu trúc thư mục

```
frontend/
├── public/              # Tài nguyên tĩnh
├── src/
│   ├── assets/          # CSS, hình ảnh
│   ├── components/      # Component tái sử dụng (UI, form, Sidebar...)
│   ├── context/         # AuthContext (quản lý trạng thái đăng nhập)
│   ├── hooks/           # Custom hooks (useAuth, usePagination, ...)
│   ├── layouts/         # Layout cho Admin/Staff (AdminLayout) và Khách (AuthLayout)
│   ├── pages/           # Trang giao diện theo nghiệp vụ (Equipment, Orders...)
│   ├── routes/          # Cấu hình routes, ProtectedRoute, AuthRouters
│   ├── services/        # Service gọi API (axiosClient, authService...)
│   ├── utils/           # Định dạng ngày, số tiền, xuất Excel/PDF
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── vercel.json          # Cấu hình routing cho Vercel SPA
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

Chỉnh sửa file `.env` để trỏ đúng backend URL:

```env
PORT=5173
VITE_API_URL=http://localhost:8080/api
```

> *Lưu ý: Biến `VITE_API_URL` trên môi trường production/Vercel cần trỏ về địa chỉ API production của backend (ví dụ: host trên Render).*

---

## Chạy ứng dụng

```bash
# Development (Vite dev server)
npm run dev

# Build production
npm run build

# Xem thử bản build production local
npm run preview

# Kiểm tra cú pháp lỗi (ESLint)
npm run lint
```

Ứng dụng mặc định chạy tại: `http://localhost:5173`

---

## Tính năng Giao diện & Định tuyến (Routing)

### Cấu trúc Routes

| Module            | Route             | Mô tả                            | Quyền truy cập |
| ----------------- | ----------------- | -------------------------------- | -------------- |
| Root Redirect     | `/`               | Điều hướng tự động về `/dashboard` hoặc `/login` | Tất cả |
| Dashboard         | `/dashboard`      | Biểu đồ thống kê nhập xuất và tồn kho | Tất cả |
| Profile           | `/profile`        | Trang thông tin cá nhân và đổi mật khẩu | Tất cả |
| Equipment         | `/equipment`      | Danh sách thiết bị / kiểm kê kho | Tất cả |
| Import Orders     | `/imports`        | Danh sách & tạo phiếu nhập kho | Tất cả |
| Export Orders     | `/exports`        | Danh sách & tạo phiếu xuất kho | Tất cả |
| Categories        | `/categories`     | Quản lý danh mục thiết bị | **Admin Only** |
| Suppliers         | `/suppliers`      | Quản lý danh mục nhà cung cấp | **Admin Only** |
| Inventory History | `/inventory-logs` | Theo dõi lịch sử điều chỉnh kho | **Admin Only** |
| Users             | `/users`          | Quản lý & khóa/mở khóa tài khoản | **Admin Only** |

### Luồng Xác thực

| Route          | Mô tả                                      |
| -------------- | ------------------------------------------ |
| `/login`       | Đăng nhập                                  |
| `/register`    | Đăng ký tài khoản (hỗ trợ OTP)              |
| `/verify-otp`  | Nhập mã OTP để hoàn tất đăng ký             |
| `/verify-2fa`  | Nhập mã xác thực 6 số (TOTP) nếu bật 2FA   |
| `/setup-2fa`   | Cấu hình 2FA bằng cách quét mã QR (Admin)  |

---

## Phân quyền & Sidebar Cải tiến

1. **Cấu hình `ProtectedRoute`:** Bảo vệ các trang yêu cầu đăng nhập, tự động đá người dùng về `/login` nếu token không hợp lệ (lỗi 401).
2. **Quyền truy cập trang cấu hình `/profile`:** Cả **Admin** và **Staff** đều được cấp quyền truy cập đầy đủ vào trang `/profile` để tự đổi mật khẩu hoặc cập nhật tên hiển thị. Lối tắt cài đặt (icon bánh răng) ở góc trái dưới cùng của thanh Sidebar được hiển thị công khai cho mọi vai trò.
3. **Ẩn các thành phần Admin:** Nút duyệt phiếu (Approve/Reject), nút CRUD thiết bị, menu quản trị (Users, Categories, Suppliers, Inventory History) tự động được ẩn hoàn toàn trên giao diện đối với vai trò Staff.

---

## Deploy và Routing trên Vercel (Single Page Application)

Dự án cấu hình file `vercel.json` ở thư mục gốc của frontend:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
**Mục đích:** Khi người dùng tải lại trang (F5) hoặc truy cập trực tiếp vào một route sâu (ví dụ: `/equipment` hoặc `/profile`), Vercel sẽ chuyển hướng yêu cầu về `index.html` thay vì trả về lỗi 404. Sau đó React Router phía client sẽ nhận diện và hiển thị đúng component tương ứng.

---

## Công nghệ chính sử dụng

- **React 19** + **Vite 8**
- **React Router 7** — Định tuyến và điều hướng trang
- **Redux Toolkit** + **redux-persist** — Quản lý state toàn cục và lưu trữ session đăng nhập
- **React Bootstrap** — UI Framework
- **Axios** — HTTP client (tự động đính kèm JWT header, xử lý lỗi token hết hạn 401)
- **React Hook Form** + **Yup** — Quản lý form và kiểm tra hợp lệ dữ liệu (validation)
- **Framer Motion (Motion)** — Tạo hiệu ứng chuyển động mượt mà cho UI/Sidebar
- **react-toastify** — Hiển thị các popup thông báo thành công / lỗi
- **xlsx**, **jspdf** — Xuất danh sách, báo cáo ra file Excel / tài liệu PDF chuyên nghiệp
