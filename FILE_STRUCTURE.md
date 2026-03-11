# Danh Sách File Được Tạo - Hệ Thống Quản Lý Lịch Hẹn

## 📁 Models (`src/models/`)
1. **lich-hen.ts** - Model cho quản lý lịch hẹn
   - Quản lý danh sách lịch hẹn
   - Kiểm tra xung đột lịch
   - CRUD operations (Create, Read, Update, Delete)

2. **nhan-vien.ts** - Model cho quản lý nhân viên
   - Quản lý danh sách nhân viên
   - Lưu/cập nhật thông tin nhân viên

3. **dich-vu.ts** - Model cho quản lý dịch vụ
   - Quản lý danh sách dịch vụ
   - CRUD operations cho dịch vụ

4. **danh-gia.ts** - Model cho quản lý đánh giá
   - Quản lý đánh giá từ khách hàng
   - Phản hồi từ nhân viên
   - Tính toán đánh giá trung bình

---

## 🔧 Services (`src/services/`)

### LichHen/
- **index.ts** - API calls cho lịch hẹn
- **typings.d.ts** - Type definitions cho LichHen.Record

### NhanVien/
- **index.ts** - API calls cho nhân viên
- **typings.d.ts** - Type definitions cho NhanVien.Record

### DichVu/
- **index.ts** - API calls cho dịch vụ
- **typings.d.ts** - Type definitions cho DichVu.Record

### DanhGia/
- **index.ts** - API calls cho đánh giá
- **typings.d.ts** - Type definitions cho DanhGia.Record (Reply support)

**Tất cả types được định nghĩa theo module pattern:**
```typescript
declare module LichHen {
  export interface Record { ... }
}
```

---

## 📄 Pages (`src/pages/`)

### LichHen/ - Quản lý Lịch Hẹn
- **index.tsx** - Trang danh sách lịch hẹn, quản lý CRUD
  - Hiển thị table lịch hẹn
  - Nút "Đặt lịch hẹn mới"
  - Edit/Delete actions
  - Hiển thị trạng thái bằng Tag

- **Form.tsx** - Form đặt/chỉnh sửa lịch hẹn
  - Input khách hàng (tên, SĐT, email)
  - Select nhân viên
  - Select dịch vụ
  - DatePicker ngày hẹn (không cho quá khứ)
  - TimePicker giờ hẹn
  - Validation xung đột tự động
  - Select trạng thái

### NhanVien/ - Quản lý Nhân Viên
- **index.tsx** - Trang danh sách nhân viên (card layout)
  - Hiển thị thẻ thông tin nhân viên
  - Hiển thị đánh giá trung bình
  - Edit/Delete actions
  - Responsive grid layout

- **Form.tsx** - Form thêm/chỉnh sửa nhân viên
  - Input tên, SĐT, email, chuyên môn
  - InputNumber số khách tối đa
  - TimePicker giờ làm việc
  - Multi-select dịch vụ

### DichVu/ - Quản lý Dịch Vụ
- **index.tsx** - Trang danh sách dịch vụ (card layout)
  - Hiển thị thẻ thông tin dịch vụ
  - Hiển thị giá và thời lượng
  - Danh sách nhân viên phục vụ (Tags)
  - Trạng thái hoạt động
  - Edit/Delete actions

- **Form.tsx** - Form thêm/chỉnh sửa dịch vụ
  - Input tên, mô tả
  - InputNumber giá, thời lượng
  - Multi-select nhân viên
  - Select trạng thái

### DanhGia/ - Quản lý Đánh Giá
- **index.tsx** - Trang dan
h sách đánh giá (Collapse layout)
  - Hiển thị đánh giá trong accordion
  - Hiển thị sao rating
  - Phản hồi từ nhân viên (nested)
  - Input phản hồi
  - Edit/Delete actions

- **Form.tsx** - Form thêm/chỉnh sửa đánh giá
  - Select lịch hẹn hoàn thành
  - InputNumber rating (1-5)
  - TextArea nội dung đánh giá

### ThongKe/ - Thống Kê & Báo Cáo
- **index.tsx** - Trang thống kê chi tiết
  - Filter theo ngày (DatePicker range)
  - Filter theo nhân viên (Select)
  - 4 KPI cards: Tổng lịch, Hoàn thành, Doanh thu, Tỉ lệ
  - Table lịch hẹn theo ngày
  - Table doanh thu theo dịch vụ
  - Table thống kê theo nhân viên (include đánh giá TB)

---

## 🔄 Routes (`config/routes.ts`)

Thêm routing cho hệ thống:
```
/lich-hen (main menu: "Quản lý Lịch Hẹn")
├── /lich-hen/dat-lich (Đặt Lịch Hẹn)
├── /lich-hen/nhan-vien (Quản lý Nhân Viên)
├── /lich-hen/dich-vu (Quản lý Dịch Vụ)
├── /lich-hen/danh-gia (Đánh Giá & Phản Hồi)
└── /lich-hen/thong-ke (Thống Kê & Báo Cáo)
```

---

## 📊 Local Storage Keys

Dữ liệu được lưu trữ tại:
- `nhan-vien` - Danh sách nhân viên (NhanVien.Record[])
- `dich-vu` - Danh sách dịch vụ (DichVu.Record[])
- `lich-hen` - Danh sách lịch hẹn (LichHen.Record[])
- `danh-gia` - Danh sách đánh giá (DanhGia.Record[])

---

## ✨ Tính Năng Nổi Bật

### 1. Kiểm Tra Xung Đột Lịch
- Tự động kiểm tra khi đặt lịch
- Không cho phép cùng nhân viên, ngày, giờ
- Tính toán giờ kết thúc dựa trên thời lượng dịch vụ

### 2. Quản Lý Trạng Thái
- Chờ duyệt (pending)
- Xác nhận (confirmed)
- Hoàn thành (completed)
- Hủy (cancelled)

### 3. Hệ Thống Đánh Giá
- Khách hàng đánh giá sau hoàn thành
- Nhân viên phản hồi lại
- Tính đánh giá trung bình/nhân viên
- Hiển thị số sao

### 4. Báo Cáo Thống Kê
- Lệnh hẹn theo ngày
- Doanh thu theo dịch vụ
- Chi tiết theo nhân viên
- Tỉ lệ hoàn thành

---

## 📋 Cấu Trúc TypeScript

### LichHen.Record
- id, ngayHen, gioHen, gioKetThuc
- khachhangTen, khachhangSDT, khachhangEmail
- nhanvienId, nhanvienTen
- dichvuId, dichvuTen, dichvuGia, thoiLuongPhut
- trangthai
- ghichu
- timestamps

### NhanVien.Record
- id, ten, sdt, email
- chuyenmon, soKhachToiDa
- gioBatDau, gioKetThuc
- dichvuIds[]
- rating, soLuongDanhGia
- timestamps

### DichVu.Record
- id, ten, moTa
- gia, thoiLuongPhut
- nhanvienIds[]
- trangthai
- timestamps

### DanhGia.Record
- id, lichhenId
- nhanvienId, nhanvienTen
- khachhangTen
- rating, noidung
- replies[] (DanhGia.Reply)
- timestamps

### DanhGia.Reply
- id, nhanvienId, nhanvienTen
- noidung
- createdAt

---

## 🎨 UI Components Sử Dụng

Từ Ant Design:
- Button, Modal, Form, Input, InputNumber, DatePicker, TimePicker
- Select, Tag, Card, Table, Space, Row, Col
- Collapse, Statistic
- Message (notifications)

---

## 💡 Hướng Phát Triển Tiếp Theo (Nếu cần)

1. **Integration Backend API** - Thay Local Storage bằng API calls
2. **Authentication** - Xác thực nhân viên/admin
3. **Email Notifications** - Gửi nhắc nhở qua email
4. **SMS Reminders** - Nhắn tin SMS cho khách
5. **Payment Integration** - Thanh toán trực tuyến
6. **Dashboard Charts** - Biểu đồ chi tiết hơn
7. **Export Reports** - Xuất PDF/Excel

---

**Ngày tạo:** Tháng 3, 2026
