# DSTCC static website

Website doanh nghiệp tại **https://dstcc.com.vn**. Chạy với Node.js 20 trở lên, không cần cài thêm thư viện npm.

```sh
npm run build
npm test
npm run check
npm start
```

Mở `http://127.0.0.1:8765`. Server xem trước mô phỏng clean URL, chuyển hướng, phân biệt hoa/thường và các security header của cấu hình Vercel. Có thể đổi cổng bằng biến `PORT`.

Khi dùng Live Server tại thư mục gốc, chạy `npm run build` trước khi mở HTML. Build tạo cả bản PDF theo URL công bố ở thư mục gốc và trong `dist`, để nút mở/tải và khung xem hồ sơ hoạt động ở cả hai cách xem trước.

## Chỉnh sửa

- `src/pages/`: nội dung từng trang. Các tệp HTML ở gốc và thư mục trang là kết quả sinh tự động; sửa fragment rồi chạy build.
- `templates/header.html`, `templates/footer.html`: điều hướng và chân trang dùng chung.
- `data/site.json`: domain, thông tin công ty, địa chỉ trụ sở/phòng thí nghiệm, email, hotline, hồ sơ công bố và cấu hình gửi form. Hồ sơ hiện dùng số 01/CB-DSTCC ngày 24/03/2026 theo xác nhận của chủ sở hữu.
- `data/lab-groups.json`: các nhóm năng lực, phép thử tiêu biểu, mã tiêu chuẩn và thiết bị. Build dùng chung dữ liệu này cho trang chủ, trang năng lực và lựa chọn nhóm trong form.
- `data/pages.json`: title, mô tả, CSS/JS riêng, canonical alias và trạng thái index.
- `data/Projects.json`: các dự án hiện có. Mỗi dự án cần `id`, `slug` duy nhất, `title`, `category`, `group`, `location`, `year`. `group` là `thi-nghiem`, `tu-van` hoặc `khao-sat`. Build sinh danh sách và trang chi tiết.
- `data/new.json`: tin tức; chỉ xuất các mục có `published: true`. Thêm nội dung HTML, khai báo trang trong pages.json và đường dẫn `url` tương ứng trước khi công bố một tin.
- `data/images.json`: kích thước và srcset của ảnh được tối ưu. Khi thay ảnh, cập nhật manifest tương ứng. Giữ ảnh hero tải sớm, ảnh dưới màn hình đầu dùng lazy loading.
- `assets/css/site.css`: quy tắc dùng chung sau các stylesheet cũ; `js/`: các module trình duyệt dùng chung và theo trang.

Build xuất **`dist/`**, đồng thời cập nhật HTML để tiện xem diff. Vercel chạy `npm run verify` (build, kiểm tra liên kết/cấu trúc và test) rồi chỉ phục vụ dist. Source, dữ liệu cấu hình và công cụ không được chép vào gói công bố. Website dùng trình xem PDF của trình duyệt. Tệp robots.txt và sitemap.xml được sinh theo URL canonical từ cùng dữ liệu trang. Không sửa trực tiếp hai tệp này.

URL stylesheet có mã phiên bản lấy từ nội dung tệp, giúp trình duyệt tải lại CSS khi giao diện thay đổi.

Liên kết tới các trang HTML nằm riêng (dịch vụ, chi tiết dự án, bài viết) được build thành đường dẫn có đuôi `.html`, nên vẫn mở được trên máy chủ static không có URL rewrite. Canonical và sitemap vẫn dùng URL chuẩn của Vercel. Có thể kiểm tra trường hợp máy chủ static bằng `node scripts/serve.mjs --static` (đổi `PORT` nếu bản xem trước khác đang chạy).

## Biểu mẫu liên hệ

Web3Forms hiện **chưa được thiết lập**. Mặc định, form kiểm tra dữ liệu và sự đồng ý, sau đó tạo nội dung email cùng liên kết mở ứng dụng email. Website không báo đã gửi và không gọi API khi chưa có khóa. Khách tự kiểm tra nội dung, đính kèm hồ sơ và gửi email; nếu không có ứng dụng email mặc định, khách có thể sao chép nội dung sang webmail.

Để bật gửi trực tiếp:

1. Tạo access key gắn với hộp thư nhận tại [Web3Forms](https://web3forms.com/#start).
2. Điền key vào `web3formsAccessKey` trong `data/site.json`, rồi build/deploy lại. Đây là khóa form phía client theo thiết kế Web3Forms; không sử dụng mật khẩu hộp thư hoặc API key quản trị.
3. Thử gửi một yêu cầu có kiểm soát tới hộp thư đó và kiểm tra cả lỗi mạng, trạng thái đang gửi và thành công. Các bài kiểm tra tự động dùng fetch giả lập, không gửi email thật.

Đã chuẩn bị timeout, kiểm tra HTTP/API response, honeypot, nhãn trường nhập, lỗi theo trường và kiểm tra checkbox bằng `checked`. Form gửi trực tiếp không có upload hồ sơ; khách có thể gửi tệp qua email. File attachment của Web3Forms phụ thuộc gói dịch vụ và cần tích hợp riêng nếu sử dụng: [tài liệu chính thức](https://docs.web3forms.com/getting-started/installation).

## Nội dung cần chủ sở hữu tiếp tục cập nhật

Các tên dự án, địa điểm, năm và lĩnh vực được giữ từ JSON có sẵn; không tạo thêm thành tích, khối lượng hay ảnh công trình. Trang chi tiết ghi rõ ảnh/hồ sơ đang cập nhật. Một bài tin có nội dung sẵn được giữ; các tin chỉ có đoạn giới thiệu được đánh dấu chưa công bố. Cần bổ sung ảnh, hồ sơ dự án và bài viết thực tế trước khi bật các bản nháp.

Tên công ty, hai địa chỉ và số liên hệ được đồng bộ từ data/site.json. Giao diện không hiển thị mã số doanh nghiệp. Header/footer không tự gắn thêm chứng nhận chưa có tài liệu. Cấu hình declaration chọn bản scan nguồn và URL công bố. Build chép bản này vào dist, đồng thời phục vụ các URL PDF cũ để giữ liên kết đã chia sẻ.

## Kiểm tra trước deploy

`npm run check` kiểm tra cấu trúc HTML, H1/main, liên kết và anchor, tài nguyên CSS/srcset, label, canonical, sitemap và cú pháp JavaScript. `npm test` kiểm tra luồng form, consent, API giả lập, email URL, ngân sách ảnh và định tuyến/đọc PDF của preview server.

Sau thay đổi giao diện, kiểm tra menu bằng bàn phím/điện thoại, tìm phép thử không dấu, bộ lọc dự án, tìm tin và luồng soạn email. Sitemap chỉ gồm bốn trang chính. Các URL nội dung cũ vẫn hoạt động với noindex và được bỏ khỏi điều hướng chính. Form nhận service bằng ID có trong danh sách nhóm và giữ hỗ trợ project cho các URL cũ. Link hồ sơ tùy chọn được đưa vào cả email nháp lẫn dữ liệu gửi API.

Các header trong vercel.json cho phép font Google, Analytics, API form và PDF cùng nguồn. Dữ liệu Analytics không được gửi khi xem trên localhost.
