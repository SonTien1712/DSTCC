# Đánh giá tổng quan website DSTCC

Ngày đánh giá: 10/11/2026. Phạm vi: mã nguồn và bản xem trước local trong workspace, đối chiếu tài liệu `dich-vu/cong_bo/SCAN1185-Scan công bố Las.pdf`. Không xác minh website production, đăng ký doanh nghiệp hoặc hiệu lực chứng nhận qua cơ quan cấp.

## Nhận định

Website có nền tảng kỹ thuật phù hợp để vận hành một website doanh nghiệp static: nội dung nguồn, template, dữ liệu cấu hình và đầu ra công bố được tách rõ; có kiểm tra liên kết, metadata và luồng liên hệ. Nhận diện xanh đậm, vàng, hình công trình và lời kêu gọi tư vấn phù hợp ngành xây dựng.

Chưa nên phát hành nguyên trạng như một bản công bố năng lực chính thức. Khoảng cách lớn nhất nằm ở nội dung chuyên môn và bằng chứng: bản PDF mới chưa được đưa vào gói phát hành, một số tiêu chuẩn ghi khác hồ sơ, một số năng lực và chứng nhận chưa được tài liệu cung cấp chứng minh.

## Tài liệu chính thức xác nhận điều gì?

Đây là bản “Công bố thông tin về năng lực đủ điều kiện hoạt động thí nghiệm chuyên ngành xây dựng”, số 01/CB-DSTCC, ghi ngày 21/03/2026, gồm 33 trang. Đây là hồ sơ công bố về hoạt động thí nghiệm, không phải hồ sơ chứng minh toàn bộ lĩnh vực kinh doanh của công ty.

Trang 1 nêu:

- Tên: Công ty Cổ phần Khoa học Công nghệ và Tư vấn Xây dựng Đà Nẵng.
- Mã số doanh nghiệp: 0400722377; đăng ký lần đầu 08/01/2009; thay đổi lần 9 ngày 15/12/2025.
- Địa chỉ công ty: số 10 Xuân Thiều 26, phường Hải Vân, thành phố Đà Nẵng.
- Điện thoại: 0388.279.279; email: dstcc.jsc@gmail.com.
- Tên phòng: PHÒNG THÍ NGHIỆM TRỌNG ĐIỂM.
- Địa chỉ phòng thí nghiệm: số 08 Xuân Thiều 26, phường Hải Vân, thành phố Đà Nẵng.
- Địa chỉ trạm thí nghiệm hiện trường: không.

Danh mục tiếp theo đánh số chỉ tiêu từ 1 đến 320, có các cột tên chỉ tiêu, tiêu chuẩn, thiết bị và người thực hiện. Trang 33 có chữ ký, dấu và tên người đại diện Nguyễn Tiến Sơn. Nên gọi đây là “320 chỉ tiêu theo danh mục công bố”, tránh biến thành tuyên bố 320 phép thử độc lập đã được một cơ quan chứng nhận.

## Đối chiếu và mức ưu tiên

| Ưu tiên | Phát hiện | Căn cứ | Hành động đề nghị |
|---|---|---|---|
| P1 — trước phát hành | Bản scan mới chưa phải tài liệu được website phục vụ | Các trang hồ sơ, tài liệu, footer vẫn trỏ `Don_Cong_bo_Chuan_CHinh_Thuc.pdf`; `scripts/build.mjs` chỉ chép PDF này vào dist | Đưa bản người dùng chọn làm chính thức vào build và đồng bộ mọi liên kết. Hai file cùng có số/ngày công bố trên trang đầu nên cần quản lý phiên bản rõ, không chỉ căn cứ tên file |
| P1 | Có tiêu chuẩn khác hồ sơ | Website ghi TCVN 3118:1993 và 3119:1993; trang 3 hồ sơ ghi 3118:2022 và 3119:2022 | Rà soát từng chỉ tiêu và phiên bản tiêu chuẩn trước công bố |
| P1 | Hằn lún vệt bánh xe gắn mã khác hồ sơ | Website ghi TCVN 8866:2011 / EN 12697-22; trang 9, mục 75 ghi TCVN 11782:2017, TCVN 13899:2023, AASHTO T324 | Dùng đúng danh mục công bố; tiêu chuẩn bổ sung phải có cơ sở riêng. Trang 33 dùng TCVN 8866:2011 cho độ nhám mặt đường bằng con lắc Anh |
| P1 | Mã tiêu chuẩn gối cầu khác hồ sơ | Website gắn TCVN 9360:2012 / EN 1337; hồ sơ trang 22–24 có TCVN 10308:2014, TCVN 10269:2014, ASTM D4014 và các tiêu chuẩn theo từng chỉ tiêu | Đối chiếu theo từng phép thử gối cầu; không thay toàn bộ nhóm bằng một mã duy nhất |
| P1 | Chứng nhận, thông số và một số năng lực chưa đủ căn cứ từ hồ sơ này | Badge ISO 9001:2015, LAS-XD 15.021; các mức 6000 kN, 3000 kN, 5000 kN; siêu âm CSL, tải tĩnh cọc, PDA; lời khẳng định phần lớn lab khác không có | Bổ sung hồ sơ chứng minh hoặc điều chỉnh nội dung. Chưa thấy tài liệu này xác lập mã LAS-XD 15.021 hay chứng nhận ISO; điều đó không có nghĩa công ty không sở hữu các hồ sơ riêng |
| P1 | Thiếu phân biệt trụ sở và nơi nhận mẫu | `data/site.json` và trang liên hệ hiện dùng số 10; PDF ghi phòng thí nghiệm số 08 | Hiển thị riêng địa chỉ công ty và phòng thí nghiệm, kèm hướng dẫn nơi giao mẫu đã xác nhận |
| P1 | Có tuyên bố thành tích/nhân sự chưa được chứng minh | Metadata trang chủ ghi “200+ dự án”; giới thiệu ghi PGS, TS, thiết bị “hiện đại bậc nhất”; hồ sơ liệt kê nhân sự với chức danh khác | Bổ sung chứng cứ tương ứng hoặc dùng diễn đạt có thể xác minh; đăng ký năm 2009 chỉ chứng minh mốc thành lập, không tự chứng minh kinh nghiệm liên tục ở mọi dịch vụ |
| P2 — hoàn thiện nội dung | Danh mục web chưa phản ánh đầy đủ năng lực | Web có 12 nhóm và danh sách rút gọn; hồ sơ có 320 mục, gồm cả nước, bentonite, gạch đá, vật liệu địa kỹ thuật, sơn và an toàn giao thông… | Ghi rõ “chỉ tiêu tiêu biểu”; tiến tới danh mục đầy đủ có tên, mã/năm tiêu chuẩn, số mục/trang PDF và nhóm vật liệu |
| P2 | Các dịch vụ ngoài thí nghiệm chưa có nguồn đối chiếu phù hợp | Web giới thiệu thiết kế, thi công, giám sát, khảo sát, nghiên cứu và chuyển giao | Dùng hồ sơ năng lực doanh nghiệp, nhân sự/chứng chỉ và dự án tương ứng để chứng minh; tài liệu hiện tại không đủ kết luận các dịch vụ đó đúng hoặc sai |
| P2 | Dự án có thông tin cơ bản nhưng chưa đủ thuyết phục B2B | Có 6 dự án trong JSON; trang chi tiết báo đang cập nhật ảnh/hồ sơ; khu dự án trang chủ và menu dự án đang ẩn, footer vẫn dẫn tới | Chọn 3–5 hồ sơ được phép công bố, nêu vai trò DSTCC, phạm vi việc, thời gian, ảnh thực tế và kết quả bàn giao |
| P2 | Luồng liên hệ hiện yêu cầu khách tự gửi email | `web3formsAccessKey` rỗng; mã form tạo email nháp và không gửi API | Luồng hiện tại minh bạch. Nếu cần nhận lead trực tiếp, cấu hình dịch vụ rồi kiểm tra email thực tế; chưa nên coi các test giả lập là bằng chứng đã nhận thư |
| P2 | Cam kết vận hành cần chủ sở hữu xác nhận | Nội dung “phản hồi trong 24 giờ”, tư vấn miễn phí, giờ làm việc và “giá trị pháp lý đầy đủ” | Chỉ giữ cam kết công ty thực hiện được; mô tả rõ phạm vi kết quả thay vì khẳng định bao trùm |

## Thiết kế và trải nghiệm

- Trang chủ desktop có nhận diện nhất quán, chữ tiêu đề nổi bật, tương phản rõ và hai hành động dễ thấy. Cấu trúc giới thiệu → dịch vụ → liên hệ phù hợp website doanh nghiệp.
- Điểm cần nhấn mạnh hơn là bằng chứng: số/ngày công bố, địa chỉ phòng, danh mục chỉ tiêu và nút tải hồ sơ ngay gần phần giới thiệu năng lực. Hiện khẩu hiệu và hình minh họa nổi bật hơn dữ liệu chuyên môn.
- Trang dịch vụ có tra cứu, bộ lọc và đường dẫn báo giá. Tìm kiếm hiện lọc theo cả nhóm card, không trả từng chỉ tiêu riêng. Tìm “be tong” trả 5 nhóm, đúng đơn vị đếm đang hiển thị.
- Nhiều thẻ dịch vụ và mục tầm nhìn/sứ mệnh dùng lại ảnh hero. Nên bổ sung ảnh thật của phòng, thiết bị và nhân sự có chú thích, nguồn/quyền sử dụng rõ. Ảnh công trình minh họa không tự chứng minh DSTCC thực hiện công trình đó.
- Trang chủ có nghiên cứu/chuyển giao và khảo sát/lập dự án nhưng liên kết về trang lĩnh vực tổng hợp; menu còn ẩn một số nhánh. Cần thống nhất nhóm dịch vụ giữa trang chủ, menu và trang lĩnh vực.
- Kiểm tra nhanh trang LAS ở 375px không thấy tràn ngang. Chưa phải kiểm định đầy đủ bàn phím, trình đọc màn hình, mọi breakpoint hoặc mọi trình duyệt. Chỉ dẫn “rê chuột” nên bổ sung cách chạm/bàn phím để khách điện thoại hiểu cách đọc chi tiết tiêu chuẩn.

## Kiến trúc và kiểm chứng

Kiến trúc hiện tại đủ phù hợp nhu cầu: Node build không cần thư viện npm ngoài, nguồn ở `src/pages`, template dùng chung, cấu hình/data ở `data`, gói xuất ở `dist`. Chưa có nhu cầu rõ để chuyển sang framework hoặc CMS. Trước mắt nên hoàn thiện nguồn dữ liệu nội dung, tái sử dụng dữ liệu đó cho danh mục và metadata để giảm sai lệch.

Các điểm tốt: canonical, sitemap, robots, JSON-LD, trang 404, cấu hình security header, ảnh responsive/lazy loading, nhãn form, kiểm tra consent, lỗi API và phương án email nháp được tổ chức rõ.

Kiểm tra đã thực hiện trên phiên bản workspace hiện có:

- `npm run check`: đạt, kiểm tra 21 trang và 1.020 tham chiếu cục bộ, label, cấu trúc HTML, metadata, JSON-LD và cú pháp JavaScript.
- `npm test`: 12/12 đạt, gồm form/consent/email/API giả lập, tìm kiếm không dấu, ngân sách ảnh, định tuyến, PDF ranges và liên kết static.
- Xem trang chủ desktop, trang dịch vụ LAS và kiểm tra nhanh trang LAS ở 375px; tìm không dấu hoạt động.
- Render toàn bộ 33 trang PDF để xem tổng thể; đọc riêng các trang làm căn cứ so sánh. PDF là scan không có lớp văn bản trích xuất được.

Không chạy build vì build ghi đè HTML và tạo lại dist trong khi đây là yêu cầu đánh giá. Các kiểm tra đạt không chứng minh đầu ra dist vừa được tái tạo, độ chính xác chuyên môn, hiệu lực pháp lý, email thật hay hiệu năng production. Chưa đo Lighthouse/Core Web Vitals hoặc đối chiếu từng dòng trong toàn bộ 320 mục.

## Thứ tự hoàn thiện đề nghị

1. Chốt bản công bố chính thức, đồng bộ file được build và các liên kết tải/xem.
2. Kiểm duyệt mã/năm tiêu chuẩn, phạm vi phép thử, địa chỉ phòng, chứng nhận và mọi con số năng lực/thành tích.
3. Đưa thông tin hồ sơ xác minh được lên trang chủ và trang phòng thí nghiệm; phân biệt danh mục tiêu biểu với danh mục đầy đủ.
4. Bổ sung ảnh phòng/thiết bị thật và hồ sơ dự án có vai trò DSTCC rõ ràng; thống nhất điều hướng.
5. Chốt cách tiếp nhận yêu cầu; thử thực tế, rồi build/verify và kiểm tra bản triển khai trước phát hành.

Đánh giá này không sửa nội dung website hoặc tài liệu gốc. Chỉ bổ sung báo cáo và tệp trung gian dùng để đọc PDF trong `tmp/pdfs`.
