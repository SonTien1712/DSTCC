# Tổng hợp cập nhật website DSTCC

Cập nhật đến ngày **18/10/2026**. Báo cáo tổng hợp các thay đổi từ đợt đánh giá ban đầu đến lần chỉnh menu mobile gần nhất, đối chiếu với mã nguồn hiện tại.

Các thay đổi đang nằm trong bản làm việc cục bộ. Phiên làm việc này chưa thực hiện commit, push, triển khai website hoặc thay đổi DNS. Những cấu hình dành cho môi trường công bố cần được áp dụng khi triển khai.

## 1. Trạng thái hiện tại

| Hạng mục | Kết quả |
| --- | --- |
| Nền tảng | HTML/CSS/JavaScript tĩnh; build bằng Node.js 20 trở lên, không cần cài thêm thư viện npm |
| Số trang được build | 21 trang HTML, bao gồm các trang chi tiết và trang tương thích đường dẫn cũ |
| Header đang hiển thị | Giới thiệu, Lĩnh vực, Liên hệ |
| Dropdown Lĩnh vực | Thí nghiệm & Kiểm định LAS-XD; Hồ sơ phòng thí nghiệm; Tư vấn giám sát |
| Dự án | Giữ 6 bản ghi và 6 trang chi tiết; đã ẩn mục Dự án trên header và khu vực dự án ở trang chủ |
| Tin tức | 1 bài có nội dung được công bố, 2 bản nháp chưa công bố |
| LAS-XD | Khôi phục 12 nhóm phép thử từ nội dung hiện có |
| Tên miền chuẩn trong cấu hình | `https://dstcc.com.vn` |
| Hộp thư nhận liên hệ | `DSTCC.JSC@gmail.com` |
| Web3Forms | Chưa có access key; biểu mẫu hiện hỗ trợ soạn email để khách tự gửi |

## 2. Header và điều hướng

- Tách header/footer thành template dùng chung, giúp các trang nhận cùng một bản cập nhật.
- Chỉnh mục Lĩnh vực thẳng hàng với các mục còn lại trên desktop: thống nhất chiều cao, căn giữa chữ và mũi tên; áp dụng cả khi header đã cuộn.
- Bỏ hiệu ứng làm chữ trong dropdown dịch ngang khi rê chuột; căn vị trí dropdown để không tràn mép màn hình.
- Bổ sung trạng thái trang đang xem, điều khiển đóng/mở menu, đóng khi bấm ra ngoài và thao tác bàn phím bằng phím mũi tên, Home, End, Escape.
- Bỏ qua các liên kết đã ẩn khi di chuyển bằng bàn phím.
- Sửa liên kết và anchor lỗi, menu trên trang liên hệ, đồng thời bổ sung đường dẫn bỏ qua điều hướng đến nội dung chính.

### Sửa lỗi Cannot GET ở các trang dịch vụ

Đã xử lý trường hợp máy chủ static không hỗ trợ chuyển URL không có đuôi sang tệp HTML. Các liên kết đến trang HTML riêng được build thành đường dẫn tệp thực, ví dụ:

| Trang | Liên kết tệp thực |
| --- | --- |
| Thiết kế & Thi công | `/dich-vu/thiet-ke-thi-cong.html` |
| Thí nghiệm & Kiểm định LAS-XD | `/dich-vu/thi-nghiem-las-xd.html` |
| Hồ sơ phòng thí nghiệm | `/dich-vu/phong-thi-nghiem-las-xd.html` |
| Tư vấn giám sát | `/dich-vu/tu-van-giam-sat.html` |

Quy tắc này áp dụng cả liên kết nội dung, footer, bài viết và chi tiết dự án; giữ nguyên query string và anchor. Canonical và sitemap vẫn dùng URL chuẩn không có đuôi theo cấu hình Vercel. Đã bổ sung chế độ preview `--static` và kiểm thử máy chủ không có URL rewrite.

## 3. Responsive trên điện thoại

### Menu mobile và mục Liên hệ

- Đổi menu thành bảng nổi gọn dưới nút hamburger, căn phải, rộng tối đa 300 px và tự thu theo màn hình nhỏ.
- Giới hạn chiều cao tối đa 360 px và theo phần màn hình còn lại; cuộn bên trong khi dùng điện thoại ngang hoặc màn hình thấp.
- Menu mở không làm tăng chiều cao header hoặc đẩy nội dung trang xuống.
- Thống nhất các mục Giới thiệu, Lĩnh vực, Liên hệ: chữ 15 px, chiều cao 44 px, padding đồng đều. Mục Liên hệ không còn lớn hơn các mục khác.
- Thu gọn danh sách con Lĩnh vực, giữ vùng chạm phù hợp; xử lý khoảng cách khi cuộn header và vùng an toàn phía đáy màn hình.
- Giữ cách hiển thị desktop trong phạm vi các chỉnh sửa mobile.

### Footer mobile

- Thu gọn hàng logo/tên công ty và thông tin liên hệ.
- Chuyển Dịch vụ, Khám phá, Kết nối thành các nhóm có thể thu/mở trên mobile; mặc định đóng và mỗi lần chỉ mở một nhóm.
- Giữ số điện thoại và email dễ truy cập; trên desktop vẫn hiển thị bố cục bốn cột.
- Bổ sung trạng thái truy cập bằng bàn phím và vùng chạm; liên kết vẫn đọc được khi JavaScript không hoạt động.
- Chừa khoảng trống cho thanh điều hướng cố định dưới cùng và vùng an toàn của thiết bị.
- Trong phép đo tại chiều rộng 390 px, footer giảm từ khoảng 1.054 px xuống 472 px, tương đương khoảng 55%.

Ngoài header/footer, đã chỉnh khoảng đệm, lưới và ảnh để xử lý tràn ngang; khôi phục mô tả và nút hành động ở hero trang chủ.

## 4. Các phần đã tạm ẩn theo yêu cầu

| Vị trí | Nội dung tạm ẩn |
| --- | --- |
| Header dùng chung | Dự án |
| Trang chủ | Toàn bộ khu vực “Dự án trong danh mục” |
| Dropdown Lĩnh vực trên header | Tất cả lĩnh vực; Thiết kế & Thi công |

Các trang và dữ liệu liên quan được giữ để có thể bật lại. Liên kết Dự án vẫn còn trong footer và thanh điều hướng dưới cùng trên mobile. Trang Thiết kế & Thi công vẫn được truy cập qua footer hoặc đường dẫn trực tiếp. Mục Tin tức hiện cũng không hiển thị trên header vì đã được chú thích trong template hiện tại.

## 5. Biểu mẫu liên hệ

- Đồng bộ hộp thư nhận thành **DSTCC.JSC@gmail.com**.
- Kiểm tra họ tên, điện thoại, email, nội dung và sự đồng ý; sửa lỗi đọc checkbox bằng `.checked`.
- Hiển thị lỗi theo trường, đưa con trỏ đến lỗi đầu tiên, bổ sung trạng thái cho công cụ hỗ trợ đọc màn hình và khóa nút trong lúc xử lý.
- Thêm honeypot, xử lý lỗi mạng/API và timeout 15 giây cho chế độ gửi trực tiếp.
- Khi chưa có key hoặc key còn là mẫu, không gọi API và không báo gửi thành công. Biểu mẫu tạo nội dung email, cung cấp liên kết mở ứng dụng email và nội dung để sao chép sang webmail.
- Đã chuẩn bị chế độ Web3Forms khi có key hợp lệ; chỉ báo thành công khi cả HTTP và phản hồi API xác nhận thành công.
- Giữ nội dung khi gửi lỗi và hỗ trợ điền trước nội dung từ liên kết dự án.
- Hồ sơ đính kèm được gửi qua ứng dụng email; chưa tích hợp upload tệp trực tiếp vào Web3Forms.

**Hiện chưa bật gửi email trực tiếp.** Kiểm thử API sử dụng phản hồi giả lập, chưa xác nhận email thật vào hộp thư.

## 6. Nội dung và chức năng các trang

- **Trang chủ:** khôi phục mô tả hero, nút Yêu cầu tư vấn/Khám phá dịch vụ; sửa các liên kết và lỗi giao diện chung.
- **Dự án:** chuẩn hóa 6 bản ghi hiện có, bộ lọc theo 3 nhóm và sinh 6 trang chi tiết. Các phần thiếu ảnh/hồ sơ được ghi rõ đang cập nhật.
- **Tin tức:** đưa bài có nội dung sang URL riêng; giữ 2 bản nháp chưa đủ nội dung; bổ sung tìm kiếm tiếng Việt không dấu, lọc danh mục, số kết quả và trạng thái không có kết quả; bỏ phân trang giả.
- **LAS-XD:** khôi phục 12 nhóm phép thử; bổ sung tìm không dấu, bộ lọc nhanh, xóa tìm kiếm và trạng thái kết quả. Các tiêu chuẩn kỹ thuật được giữ từ nội dung có sẵn, chưa đối chiếu độc lập về hiệu lực.
- **Tài liệu/hồ sơ phòng thí nghiệm:** liên kết đúng PDF hiện có, bổ sung xem/tải và phương án mở trực tiếp khi trình duyệt không hiển thị PDF. Giữ nguyên nội dung PDF gốc.
- Đồng bộ thông tin công ty, số điện thoại, email, địa chỉ và mã số thuế từ dữ liệu hiện có; chưa xác minh độc lập với hồ sơ pháp lý.

## 7. Hiệu năng, khả năng truy cập và mã nguồn

- Tối ưu ảnh và tạo các kích thước phù hợp với màn hình; bổ sung kích thước ảnh, `srcset`, lazy loading và ưu tiên tải ảnh hero.
- Tổng dung lượng ba ảnh chính ở trang chủ giảm từ **7.362.866 byte** xuống **331.493 byte**, khoảng **95,5%**. Đây là tổng ba tệp ảnh đối chiếu, không phải mức giảm dung lượng toàn website.
- Đưa Bootstrap và Bootstrap Icons về tài nguyên cục bộ, kèm giấy phép. Google Fonts vẫn được tải từ bên ngoài.
- Sửa lỗi biến màu CSS, đường dẫn ảnh và tài nguyên lỗi; loại bỏ JavaScript trùng/không sử dụng và phần mã giải mã email cũ.
- Bổ sung landmark, nhãn trường nhập, trạng thái focus, hỗ trợ giảm chuyển động và nội dung có thể đọc trước khi JavaScript chạy.
- Gắn mã phiên bản theo nội dung stylesheet để hạn chế trình duyệt giữ CSS cũ sau cập nhật.
- Gói `dist/` chỉ chứa tài nguyên cần phục vụ; loại source, công cụ và PDF.js chưa sử dụng khỏi gói công bố, giảm khoảng 402 tệp tương đương 21,9 MB.

## 8. Tên miền, SEO và cấu hình triển khai

- Thống nhất URL chuẩn trong cấu hình là **https://dstcc.com.vn**.
- Chuẩn bị chuyển hướng vĩnh viễn từ **dstcc.vn** sang **dstcc.com.vn** trong `vercel.json`.
- Đồng bộ title, description, canonical, Open Graph, Twitter metadata và JSON-LD theo dữ liệu trang; bổ sung favicon và ảnh chia sẻ.
- Chuẩn hóa `robots.txt`, `sitemap.xml` thành chữ thường và sinh tự động; xử lý alias/đường dẫn mẫu cũ, tránh index trang mẫu.
- Chuẩn bị trang 404 và các header CSP, chống MIME sniffing, giới hạn nhúng trang, referrer policy và quyền camera/micro/vị trí.
- Không gửi dữ liệu Analytics khi xem bằng localhost.
- Vercel được cấu hình chạy `npm run verify` và phục vụ thư mục `dist`.

Các mục tên miền, chuyển hướng và header ở trên là **cấu hình đã chuẩn bị trong mã nguồn**; chưa xác nhận đang được áp dụng trên website công khai hoặc DNS.

## 9. Quy trình bảo trì và kiểm tra

| Nơi chỉnh sửa | Mục đích |
| --- | --- |
| `src/pages/` | Nội dung nguồn của các trang |
| `templates/header.html`, `templates/footer.html` | Header/footer dùng chung |
| `assets/css/site.css` | CSS chung, gồm các chỉnh responsive gần nhất |
| `js/main.js` | Điều hướng, dropdown và nhóm footer |
| `js/form.js` | Kiểm tra biểu mẫu, soạn email và gửi API |
| `data/site.json` | Tên miền, thông tin liên hệ, Web3Forms, Analytics |
| `data/pages.json`, `data/images.json` | Metadata trang và cấu hình ảnh |
| `data/Projects.json`, `data/new.json` | Dữ liệu dự án và tin tức |
| `scripts/`, `tests/` | Build, preview, kiểm tra và kiểm thử |
| `README.md` | Hướng dẫn chỉnh nội dung, form và triển khai |

Chỉnh tệp nguồn rồi chạy build; các HTML ở gốc/thư mục trang và trong `dist/` là kết quả sinh tự động. Không sửa trực tiếp sitemap/robots được sinh từ cấu hình.

```sh
npm run build
npm run check
npm test
npm run verify
npm start
```

`npm run verify` chạy lần lượt build, kiểm tra website và kiểm thử. Đã bổ sung `.gitignore`, `.gitattributes` và hướng dẫn bảo trì.

### Kết quả kiểm tra gần nhất sau lần chỉnh menu mobile

- Build thành công **21 trang**.
- Kiểm tra **1.020 tham chiếu cục bộ**, cùng cấu trúc HTML, nhãn, tài nguyên, metadata/JSON-LD và cú pháp JavaScript.
- **12/12 bài kiểm thử tự động đạt**, bao gồm biểu mẫu, tìm kiếm tiếng Việt, ngân sách ảnh, định tuyến/PDF và liên kết trên máy chủ static không có rewrite.
- Kiểm tra giao diện menu gần nhất ở chiều rộng 320, 360, 390, 414, 768, 991 px, chế độ ngang 844 × 390 px và desktop 1366 px: không phát hiện tràn ngang; mục Liên hệ hoạt động và đóng menu sau khi điều hướng.
- Các đợt trước đã kiểm tra thêm căn header ở desktop 992–1920 px và footer ở nhiều kích thước.

Các kiểm tra responsive được thực hiện bằng kích thước trình duyệt mô phỏng. Chưa kiểm tra trên điện thoại vật lý, đo Core Web Vitals trên production hoặc xác nhận gửi email thật. Báo cáo tổng hợp này không thay đổi mã chạy của website.

## 10. Những việc còn phụ thuộc cấu hình hoặc nội dung

1. **Nếu muốn gửi form trực tiếp:** tạo access key Web3Forms gắn với hộp thư nhận, điền `web3formsAccessKey` trong `data/site.json`, build/triển khai và kiểm tra nhận email thật.
2. **Nội dung:** bổ sung ảnh/hồ sơ thực tế cho dự án, hoàn thiện 2 bài tin nháp nếu muốn công bố; đối chiếu thông tin doanh nghiệp và các tiêu chuẩn kỹ thuật trước khi phát hành nội dung chính thức.
3. **Đưa bản cập nhật lên mạng:** triển khai `dist/`, thiết lập tên miền/DNS trên hosting, rồi kiểm tra HTTPS, chuyển hướng tên miền, các trang dịch vụ, form và PDF trên địa chỉ công khai.

Các phần đang ẩn có thể bật lại từ template/trang nguồn rồi build. Dữ liệu và trang chi tiết vẫn được giữ trong dự án.
