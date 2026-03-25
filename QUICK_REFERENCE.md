# 🎯 QUICK REFERENCE - HÌNH ẢNH THIẾU (Tóm tắt)

## 📊 THỐNG KÊ TỔNG QUÁT
- **Tổng hình cần tìm**: 25-28 images
- **Placeholders hiện tại**: ~20 
- **Files đã có**: ~8
- **Cần thay thế**: ~15-20

---

## ⚡ TOP PRIORITY (Làm trước - ảnh dùng nhiều)

### 🔴 URGENTLY NEEDED (Chiếm ≥10% website)

| # | Loại | Số lượng | Vị trí | Keyword Unsplash | Kích thước |
|----|------|---------|--------|------------------|-----------|
| 1️⃣ | **Dự án cầu đường** | 6 | index.html L983-988 | "highway bridge engineering" | 600x400 |
| 2️⃣ | **Lãnh đạo/Nhân sự** | 4 | gioi-thieu/ L237-273 | "executive portrait male" | 400x533 |
| 3️⃣ | **Dịch vụ chính** | 3 | index.html L383-397 | Xem bảng dưới | 300x190 |

**➜ TỔNG CỘNG**: 13 ảnh = 52% công việc

---

## 📋 DANH SÁCH KIỂM TRA - CHI TIẾT

### 🔧 DỊCH VỤ (3 hạng mục - Homepage)

| # | Dịch vụ | File | Keyword | Status |
|----|---------|------|---------|--------|
| 1 | Thí nghiệm | index.html:383 | "laboratory testing equipment" | ⚠️ NEED |
| 2 | Khảo sát | index.html:390 | "geological survey drilling" | ⚠️ NEED |
| 3 | Tư vấn giám sát | index.html:397 | "construction supervision engineer" | ⚠️ NEED |

---

### 🏢 CÔNG TRÌNH (6 dự án)

| # | Tên dự án | Keyword | Size | Status |
|----|----------|---------|------|--------|
| 1 | Cao tốc Đà Nẵng-Quảng Ngãi | "highway expressway" | 600x400 | ⚠️ |
| 2 | Cầu Cà Đú | "concrete bridge" | 600x400 | ⚠️ |
| 3 | Cầu Năm Ống | "bridge infrastructure" | 600x400 | ⚠️ |
| 4 | Đường ven biển Cát Tiến | "coastal road seaside" | 600x400 | ⚠️ |
| 5 | Cầu Biện | "modern bridge" | 600x400 | ⚠️ |
| 6 | Đường ven biển Liên Chiểu | "waterfront infrastructure" | 600x400 | ⚠️ |

---

### 👔 LÃNH ĐẠO (4 người)

| # | Vị trí | Keyword | Size | Note |
|----|--------|---------|------|------|
| 1 | gioi-thieu/L237 | "professional male executive" | 400x533 | Chân dung |
| 2 | gioi-thieu/L249 | "businessman headshot" | 400x533 | Khác từ #1 |
| 3 | gioi-thieu/L261 | "business leader portrait" | 400x533 | Khác lần 2 |
| 4 | gioi-thieu/L273 | "mature professional man" | 400x533 | Khác lần 3 |

---

### 🔬 THIẾT BỊ LAB (5 loại)

| # | Loại test | Keyword | Size | File |
|----|-----------|---------|------|------|
| 1 | Hằn lún đường | "asphalt rutting test" | 700x400 | thi-nghiem-las-xd.html:175 |
| 2 | Gối cầu | "bridge bearing structural" | 500x400 | thi-nghiem-las-xd.html:187 |
| 3 | Cáp dự ứng lực | "steel cables prestressed" | 500x400 | thi-nghiem-las-xd.html:199 |
| 4 | Siêu âm cọc | "ultrasonic pile testing" | 500x350 | thi-nghiem-las-xd.html:211 |
| 5 | Load test | "load testing equipment" | 500x350 | thi-nghiem-las-xd.html:223 |

---

### 👨‍💼 GIÁM SÁT & TEAM

| # | Loại | Keyword | Size | File |
|----|------|---------|------|------|
| 1 | Kỹ sư tại hiện trường | "construction engineer hard hat" | 800x600 | tu-van-giam-sat.html:175 |
| 2 | Tầm nhìn doanh nghiệp | "vision future growth" | 800x600 | gioi-thieu.html:179 |
| 3 | Sứ mệnh đội | "team collaboration teamwork" | 800x600 | gioi-thieu.html:186 |

---

### 📰 TIN TỨC & BÀI VIẾT

| # | Nội dung | Keyword | Size | File |
|----|---------|---------|------|------|
| 1 | Hero banner | "news media communication" | 1920x600 | tin-tuc/index.html:104 |
| 2 | Quy tắc xây dựng | "building standards blueprint" | 400x250 | tin-tuc/index.html:169 |
| 3 | Nghiệm thu | "project handover approval" | 400x250 | tin-tuc/index.html:184 |
| 4 | Đào tạo | "training workshop learning" | 500x350 | article-template.html:145 |
| 5 | Thực hành | "practical work testing" | 500x350 | article-template.html:148 |

---

## 🚀 HƯỚNG DẪN NHANH

### BƯỚC 1: Vào Unsplash.com
```
https://unsplash.com/natsort=latest
```

### BƯỚC 2: Từ khóa + Download
```
Ví dụ: Tìm "highway bridge engineering"
→ Chọn ảnh đẹp (1920px min)
→ Download Free (JPG)
```

### BƯỚC 3: Lưu file
```
Lưu vào: /DSTCC/image/
Tên file: [category-loai].jpg
Ví dụ: bridge-ca-du.jpg
```

### BƯỚC 4: Cập nhật HTML
```html
<!-- Cũ -->
<img src="https://placehold.co/600x400/...">

<!-- Mới -->
<img src="/DSTCC/image/bridge-ca-du.jpg" alt="Cầu Cà Đú">
```

---

## 📁 FILE HƯỚNG DẪN

Bạn có 3 file tài liệu:

| File | Mục đích | Chi tiết |
|------|---------|---------|
| **IMAGE_CHECKLIST.md** | Danh sách kiểm tra + category | ✅ Dễ sử dụng |
| **SEARCH_GUIDE_DETAILED.md** | Hướng dẫn tìm kiếm chi tiết | 📖 Toàn bộ info |
| **QUICK_REFERENCE.md** (file này) | Tóm tắt & tra cứu nhanh | ⚡ Tóm gọn |

---

## 🎨 GỢI Ý TÌMC KIẾM NÂNG CAO

### Unsplash Search Tips:
- **Filter by**: Landscape/Portrait (có icon)
- **Color**: Xanh, xám, cam (match brand)
- **Collections**: 
  - "Architecture" 
  - "Engineering"
  - "Business"
  - "Construction"

### Alternative Sources (nếu Unsplash chưa đủ):
1. **Pexels.com** - Chất lượng cao
2. **Pixabay.com** - Lựa chọn nhiều
3. **Stocksnap.io** - Diversified

---

## ✅ DANH SÁCH TICK THEO TRẠNG THÁI

```
[ ] Dự án cầu đường (6 ảnh)
[ ] Lãnh đạo (4 ảnh) 
[ ] Dịch vụ (3 ảnh)
[ ] Thiết bị lab (5 ảnh)
[ ] Giám sát (1 ảnh)
[ ] Vision/Mission (2 ảnh)
[ ] Tin tức (5 ảnh)
---
[ ] TOTAL: 26 IMAGES ✨
```

---

## 💬 CÂU HỎI THƯỜNG GẶP

**Q: Tôi có thể dùng Adobe Stock không?**  
A: Có, nhưng Unsplash là miễn phí + không cần tín dụng.

**Q: Format ảnh nào tốt nhất?**  
A: JPG (nén) cho tốc độ, PNG nếu cần transparent.

**Q: Cần sử lý hình ảnh gì?**  
A: Cắt & resize theo kích thước (dùng Canva/Photoshop).

**Q: Có phải thay tất cả placeholder không?**  
A: Không - các ảnh `/sites/default/files/` đã OK ✅

---

**🎯 TẬP TRUNG VÀO 13 ảnh TOP PRIORITY TRƯỚC!**
