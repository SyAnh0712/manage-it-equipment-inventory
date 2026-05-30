-- =============================================
-- HỆ THỐNG QUẢN LÝ NHẬP XUẤT KHO THIẾT BỊ CNTT
-- Database: warehouse_it_db
-- =============================================

CREATE DATABASE IF NOT EXISTS warehouse_it_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE warehouse_it_db;

-- =============================================
-- BẢNG NGƯỜI DÙNG
-- =============================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    is_locked BOOLEAN DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    deleted_at DATETIME NULL
);

-- =============================================
-- BẢNG DANH MỤC THIẾT BỊ
-- =============================================

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    image_url varchar(225) default 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    deleted_at DATETIME NULL
);

-- =============================================
-- BẢNG NHÀ CUNG CẤP
-- =============================================

CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    address VARCHAR(255),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    deleted_at DATETIME NULL
);

-- =============================================
-- BẢNG THIẾT BỊ
-- =============================================

CREATE TABLE IF NOT EXISTS equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,

    category_id INT,
    supplier_id INT,

    unit VARCHAR(30) DEFAULT 'Cái',

    quantity INT NOT NULL DEFAULT 0
        CHECK (quantity >= 0),

    price DECIMAL(15,2) DEFAULT 0,
	image_url varchar(225) default 0,
    description TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    deleted_at DATETIME NULL,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL,

    FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL
);

-- =============================================
-- BẢNG PHIẾU NHẬP KHO
-- =============================================

CREATE TABLE IF NOT EXISTS import_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(50) UNIQUE NOT NULL,

    supplier_id INT,
    created_by INT,

    status ENUM('pending', 'approved', 'rejected')
        DEFAULT 'pending',

    note TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =============================================
-- CHI TIẾT PHIẾU NHẬP
-- =============================================

CREATE TABLE IF NOT EXISTS import_order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,

    import_order_id INT NOT NULL,
    equipment_id INT NOT NULL,

    quantity INT NOT NULL
        CHECK (quantity > 0),

    unit_price DECIMAL(15,2) DEFAULT 0,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    deleted_at DATETIME NULL,
    FOREIGN KEY (import_order_id)
        REFERENCES import_orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (equipment_id)
        REFERENCES equipment(id)
        ON DELETE CASCADE
);

-- =============================================
-- BẢNG PHIẾU XUẤT KHO
-- =============================================

CREATE TABLE IF NOT EXISTS export_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(50) UNIQUE NOT NULL,

    department VARCHAR(100),
    receiver VARCHAR(100),

    created_by INT,

    status ENUM('pending', 'approved', 'rejected')
        DEFAULT 'pending',

    note TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =============================================
-- CHI TIẾT PHIẾU XUẤT
-- =============================================

CREATE TABLE IF NOT EXISTS export_order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,

    export_order_id INT NOT NULL,
    equipment_id INT NOT NULL,

    quantity INT NOT NULL
        CHECK (quantity > 0),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    deleted_at DATETIME NULL,
    FOREIGN KEY (export_order_id)
        REFERENCES export_orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (equipment_id)
        REFERENCES equipment(id)
        ON DELETE CASCADE
);

-- =============================================
-- BẢNG LOG LỊCH SỬ KHO
-- =============================================

CREATE TABLE IF NOT EXISTS inventory_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    equipment_id INT NOT NULL,

    action_type ENUM('import', 'export', 'adjust'),

    quantity_before INT NOT NULL,
    quantity_changed INT NOT NULL,
    quantity_after INT NOT NULL,

    reference_code VARCHAR(50),

    created_by INT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    deleted_at DATETIME NULL,

    FOREIGN KEY (equipment_id)
        REFERENCES equipment(id)
        ON DELETE CASCADE,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =============================================
-- INDEX TĂNG TỐC TÌM KIẾM
-- =============================================

CREATE INDEX idx_equipment_name
ON equipment(name);

CREATE INDEX idx_equipment_code
ON equipment(code);

CREATE INDEX idx_user_username
ON users(username);

CREATE INDEX idx_category_name
ON categories(name);

-- =============================================
-- MẪU DATABASE
-- =============================================
INSERT INTO users (
    username,
    password,
    full_name,
    email,
    role
)
VALUES
(
    'admin',
    '123456',
    'Nguyen Van Admin',
    'admin@gmail.com',
    'admin'
),
(
    'staff01',
    '123456',
    'Tran Thi Hoa',
    'hoa@gmail.com',
    'staff'
),
(
    'staff02',
    '123456',
    'Le Minh Quan',
    'quan@gmail.com',
    'staff'
);

-- =============================================
-- CATEGORIES
-- =============================================

INSERT INTO categories (
    name,
    description
)
VALUES
(
    'Laptop',
    'Danh mục máy tính xách tay'
),
(
    'PC',
    'Máy tính để bàn'
),
(
    'Linh kiện',
    'Thiết bị linh kiện máy tính'
),
(
    'Thiết bị mạng',
    'Router, Switch, Access Point'
),
(
    'Thiết bị văn phòng',
    'Máy in, máy scan'
);

-- =============================================
-- SUPPLIERS
-- =============================================

INSERT INTO suppliers (
    name,
    phone,
    email,
    address
)
VALUES
(
    'FPT Distribution',
    '0901234567',
    'fpt@gmail.com',
    'Ho Chi Minh'
),
(
    'The Gioi Di Dong',
    '0912345678',
    'tgdd@gmail.com',
    'Da Nang'
),
(
    'Phong Vu',
    '0923456789',
    'phongvu@gmail.com',
    'Ha Noi'
);

-- =============================================
-- EQUIPMENT
-- =============================================

INSERT INTO equipment (
    code,
    name,
    category_id,
    supplier_id,
    unit,
    quantity,
    price,
    description
)
VALUES
(
    'EQ001',
    'Laptop Dell Inspiron 15',
    1,
    1,
    'Cái',
    20,
    18500000,
    'Laptop văn phòng Dell'
),
(
    'EQ002',
    'Laptop Asus Vivobook',
    1,
    2,
    'Cái',
    15,
    17000000,
    'Laptop học tập Asus'
),
(
    'EQ003',
    'PC Gaming RTX 4060',
    2,
    3,
    'Bộ',
    5,
    32000000,
    'PC Gaming hiệu năng cao'
),
(
    'EQ004',
    'RAM Kingston 16GB',
    3,
    1,
    'Thanh',
    50,
    1200000,
    'RAM DDR4 Kingston'
),
(
    'EQ005',
    'SSD Samsung 1TB',
    3,
    2,
    'Ổ',
    30,
    2500000,
    'SSD NVMe Samsung'
),
(
    'EQ006',
    'Router TP-Link AX3000',
    4,
    3,
    'Cái',
    12,
    2100000,
    'Router Wifi 6'
),
(
    'EQ007',
    'Máy in Canon LBP2900',
    5,
    1,
    'Cái',
    8,
    3500000,
    'Máy in laser Canon'
);

-- =============================================
-- IMPORT ORDERS
-- =============================================

INSERT INTO import_orders (
    code,
    supplier_id,
    created_by,
    status,
    note,
    approved_at
)
VALUES
(
    'IMP001',
    1,
    1,
    'approved',
    'Nhập lô laptop Dell',
    NOW()
),
(
    'IMP002',
    2,
    2,
    'approved',
    'Nhập SSD và Laptop Asus',
    NOW()
),
(
    'IMP003',
    3,
    1,
    'pending',
    'Nhập thiết bị mạng',
    NULL
);

-- =============================================
-- IMPORT ORDER DETAILS
-- =============================================

INSERT INTO import_order_details (
    import_order_id,
    equipment_id,
    quantity,
    unit_price
)
VALUES
(
    1,
    1,
    10,
    18000000
),
(
    2,
    2,
    5,
    16500000
),
(
    2,
    5,
    20,
    2400000
),
(
    3,
    6,
    10,
    2000000
);

-- =============================================
-- EXPORT ORDERS
-- =============================================

INSERT INTO export_orders (
    code,
    department,
    receiver,
    created_by,
    status,
    note,
    approved_at
)
VALUES
(
    'EXP001',
    'Phong IT',
    'Nguyen Van A',
    2,
    'approved',
    'Xuất laptop cho nhân viên',
    NOW()
),
(
    'EXP002',
    'Phong Ke Toan',
    'Tran Thi B',
    1,
    'approved',
    'Xuất máy in',
    NOW()
),
(
    'EXP003',
    'Phong Ky Thuat',
    'Le Van C',
    2,
    'pending',
    'Xuất RAM nâng cấp máy',
    NULL
);

-- =============================================
-- EXPORT ORDER DETAILS
-- =============================================

INSERT INTO export_order_details (
    export_order_id,
    equipment_id,
    quantity
)
VALUES
(
    1,
    1,
    2
),
(
    2,
    7,
    1
),
(
    3,
    4,
    5
);

-- =============================================
-- INVENTORY LOGS
-- =============================================

INSERT INTO inventory_logs (
    equipment_id,
    action_type,
    quantity_before,
    quantity_changed,
    quantity_after,
    reference_code,
    created_by
)
VALUES
(
    1,
    'import',
    10,
    10,
    20,
    'IMP001',
    1
),
(
    5,
    'import',
    10,
    20,
    30,
    'IMP002',
    2
),
(
    1,
    'export',
    20,
    -2,
    18,
    'EXP001',
    2
),
(
    7,
    'export',
    9,
    -1,
    8,
    'EXP002',
    1
),
(
    4,
    'adjust',
    45,
    5,
    50,
    'ADJ001',
    1
);