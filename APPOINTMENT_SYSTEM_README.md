# Ứng Dụng Quản Lý Lịch Hẹn Dịch Vụ

Ứng dụng giúp khách hàng đặt lịch hẹn cho các dịch vụ (cắt tóc, spa, khám bệnh, sửa chữa, v.v.) và quản lý lịch hẹn theo nhân viên, thời gian, trạng thái.

## 📋 Chức Năng Chính

### 1. **Quản Lý Lịch Hẹn** (`/lich-hen/dat-lich`)
- ✅ Đặt lịch hẹn mới (chọn ngày, giờ, nhân viên, dịch vụ)
- ✅ Kiểm tra lịch trùng tự động
- ✅ Cập nhật trạng thái lịch hẹn (Chờ duyệt/Xác nhận/Hoàn thành/Hủy)
- ✅ Chỉnh sửa và xóa lịch hẹn
- ✅ Hiển thị danh sách lịch hẹn

**Trạng thái lịch hẹn:**
- Chờ duyệt (pending) - Mặc định khi tạo mới
- Xác nhận (confirmed) - Nhân viên xác nhận sẽ phục vụ
- Hoàn thành (completed) - Dịch vụ đã hoàn thành
- Hủy (cancelled) - Đã hủy bỏ

---

### 2. **Quản Lý Nhân Viên** (`/lich-hen/nhan-vien`)
- ✅ Thêm nhân viên mới
- ✅ Chỉnh sửa thông tin nhân viên
- ✅ Xóa nhân viên
- ✅ Thiết lập giới hạn khách hàng/ngày
- ✅ Cấu hình ca làm việc (Giờ bắt đầu - Kết thúc)
- ✅ Gán dịch vụ mà nhân viên phục vụ
- ✅ Hiển thị đánh giá trung bình của nhân viên

**Tính năng:**
- Mỗi nhân viên có lịch làm việc riêng
- Giới hạn số khách phục vụ/ngày (mặc định 5 khách)
- Có thể được gán nhiều dịch vụ
- Hiển thị xếp hạng dựa trên đánh giá của khách

---

### 3. **Quản Lý Dịch Vụ** (`/lich-hen/dich-vu`)
- ✅ Thêm dịch vụ mới
- ✅ Chỉnh sửa thông tin dịch vụ
- ✅ Xóa dịch vụ
- ✅ Quản lý giá dịch vụ
- ✅ Thiết lập thời gian thực hiện (phút)
- ✅ Gán nhân viên phục vụ dịch vụ
- ✅ Bật/tắt trạng thái hoạt động

**Thông tin dịch vụ:**
- Tên dịch vụ
- Mô tả chi tiết
- Giá (VND)
- Thời lượng (phút)
- Danh sách nhân viên phục vụ
- Trạng thái (Hoạt động/Không hoạt động)

---

### 4. **Đánh Giá & Phản Hồi** (`/lich-hen/danh-gia`)
- ✅ Thêm đánh giá cho lịch hẹn hoàn thành
- ✅ Chỉnh sửa đánh giá
- ✅ Nhân viên phản hồi lại đánh giá
- ✅ Hiển thị tất cả đánh giá của mỗi nhân viên
- ✅ Tính đánh giá trung bình

**Các yếu tố đánh giá:**
- Xếp hạng từ 1-5 sao
- Nội dung nhận xét
- Thời gian đánh giá
- Phản hồi từ nhân viên (nếu có)

---

### 5. **Thống Kê & Báo Cáo** (`/lich-hen/thong-ke`)
- ✅ Thống kê tổng lịch hẹn
- ✅ Tính doanh thu theo dịch vụ
- ✅ Phân tích doanh thu theo nhân viên
- ✅ Lọc dữ liệu theo:
  - Khoảng thời gian (từ ngày - đến ngày)
  - Nhân viên cụ thể
- ✅ Báo cáo chi tiết

**Các chỉ số thống kê:**
- Tổng lịch hẹn
- Số lịch hoàn thành
- Tổng doanh thu
- Tỉ lệ hoàn thành
- Lịch hẹn theo ngày
- Doanh thu theo dịch vụ
- Chiều sâu theo nhân viên

---

## 🏗️ Cấu Trúc Dự Án

```
src/
├── models/                      # State management
│   ├── lich-hen.ts             # Appointment model
│   ├── nhan-vien.ts            # Employee model
│   ├── dich-vu.ts              # Service model
│   └── danh-gia.ts             # Review model
│
├── services/                    # API calls & type definitions
│   ├── LichHen/
│   │   ├── index.ts
│   │   └── typings.d.ts
│   ├── NhanVien/
│   │   ├── index.ts
│   │   └── typings.d.ts
│   ├── DichVu/
│   │   ├── index.ts
│   │   └── typings.d.ts
│   └── DanhGia/
│       ├── index.ts
│       └── typings.d.ts
│
└── pages/
    ├── LichHen/                 # Appointment pages
    │   ├── index.tsx            # Main list & management
    │   └── Form.tsx             # Appointment form
    ├── NhanVien/                # Employee pages
    │   ├── index.tsx            # Employee list & management
    │   └── Form.tsx             # Employee form
    ├── DichVu/                  # Service pages
    │   ├── index.tsx            # Service list & management
    │   └── Form.tsx             # Service form
    ├── DanhGia/                 # Review pages
    │   ├── index.tsx            # Review list & replies
    │   └── Form.tsx             # Review form
    └── ThongKe/                 # Statistics pages
        └── index.tsx            # Statistics & reports
```

---

## 🔧 Công Nghệ & Framework

- **Framework:** Umi (React)
- **Styling:** Ant Design (antd)
- **State Management:** Umi models hook
- **Date Handling:** Dayjs
- **Storage:** Local Storage (localStorage)

---

## 💾 Quản Lý Dữ Liệu

Dữ liệu được lưu trữ trong **localStorage** của trình duyệt với các keys:
- `nhan-vien` - Danh sách nhân viên
- `dich-vu` - Danh sách dịch vụ
- `lich-hen` - Danh sách lịch hẹn
- `danh-gia` - Danh sách đánh giá

---

## 🚀 Cách Sử Dụng

### 1. **Bước 1:** Thêm Dịch Vụ
   - Vào `Quản lý Lịch Hẹn` → `Quản lý Dịch Vụ`
   - Nhấn "Thêm dịch vụ mới"
   - Nhập tên, giá, thời lượng
   - Chọn nhân viên phục vụ (nếu có)

### 2. **Bước 2:** Thêm Nhân Viên
   - Vào `Quản lý Lịch Hẹn` → `Quản lý Nhân Viên`
   - Nhấn "Thêm nhân viên mới"
   - Nhập thông tin: tên, SĐT, email, chuyên môn
   - Cấu hình giờ làm việc
   - Gán dịch vụ mà nhân viên phục vụ

### 3. **Bước 3:** Đặt Lịch Hẹn
   - Vào `Quản lý Lịch Hẹn` → `Đặt Lịch Hẹn`
   - Nhấn "Đặt lịch hẹn mới"
   - Nhập thông tin khách hàng (tên, SĐT, email)
   - Chọn dịch vụ cần sử dụng
   - Chọn nhân viên phục vụ
   - Chọn ngày và giờ
   - Hệ thống sẽ tự động kiểm tra xung đột lịch
   - Nhấn "Tạo mới"

### 4. **Bước 4:** Cập Nhật Trạng Thái
   - Từ danh sách lịch hẹn, nhấn "Edit"
   - Thay đổi trạng thái (Chờ duyệt → Xác nhận → Hoàn thành)
   - Nhấn "Cập nhật"

### 5. **Bước 5:** Thêm Đánh Giá
   - Vào `Quản lý Lịch Hẹn` → `Đánh Giá & Phản Hồi`
   - Nhấn "Thêm đánh giá mới"
   - Chọn lịch hẹn hoàn thành
   - Nhập số sao và nội dung đánh giá
   - Nhấn "Tạo mới"

### 6. **Bước 6:** Xem Thống Kê
   - Vào `Quản lý Lịch Hẹn` → `Thống Kê & Báo Cáo`
   - Chọn khoảng ngày (tùy chọn)
   - Chọn nhân viên (tùy chọn)
   - Xem các biểu đồ và báo cáo chi tiết

---

## 🎯 Kỹ Thuật Triển Khai

### Clean Code & Best Practices
- ✅ Tách components theo chức năng
- ✅ Tái sử dụng components
- ✅ Sử dụng hooks (useModel, useEffect)
- ✅ Type safety với TypeScript interfaces
- ✅ Quản lý state bằng Umi models
- ✅ Consistent error handling

### UI/UX
- ✅ Giao diện trực quan, dễ sử dụng
- ✅ Menu rõ ràng, phân cấp submenu
- ✅ Form validation
- ✅ Toast notifications (message)
- ✅ Modal dialogs for actions
- ✅ Responsive design

### Kiểm Tra Xung Đột
- Sistema kiểm tra tự động khi đặt lịch
- Không cho phép đặt lịch trùng nhân viên, ngày, giờ
- Kiểm tra giờ kết thúc dựa trên thời lượng dịch vụ

---

## 📧 Hỗ Trợ

Nếu có bất kỳ vấn đề nào hoặc cần hỗ trợ, vui lòng liên hệ với thầy giảng viên.

---

## 🎓 Yêu Cầu Bài Tập

✅ Xây dựng ứng dụng quản lý lịch hẹn dịch vụ
✅ Quản lý nhân viên & dịch vụ
✅ Đặt lịch hẹn với kiểm tra xung đột
✅ Cập nhật trạng thái lịch hẹn
✅ Đánh giá dịch vụ & phản hồi
✅ Thống kê & báo cáo
✅ Sử dụng Umi, models, tách components
✅ Clean code, UI trực quan

---

**Last Updated:** Tháng 3, 2026
