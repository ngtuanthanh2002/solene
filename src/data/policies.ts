export interface Policy { slug: string; title: string; description: string; updated: string; sections: { h: string; p: string[] }[] }

export const POLICIES: Policy[] = [
  {
    slug: 'bao-hanh', title: 'Chính sách bảo hành trọn đời', updated: '2026-01-01',
    description: 'Bảo hành trọn đời, làm sạch – đánh bóng miễn phí, siết chấu và kiểm tra đá định kỳ cho mọi sản phẩm Solène.',
    sections: [
      { h: 'Phạm vi bảo hành', p: ['Mọi sản phẩm trang sức Solène được bảo hành trọn đời đối với lỗi kỹ thuật chế tác: bong mối hàn, lỏng chấu, rơi đá tấm do lỗi gắn đá.', 'Kim cương viên chủ được bảo hành trọn đời về chất lượng đúng như giấy kiểm định GIA đi kèm.'] },
      { h: 'Dịch vụ miễn phí trọn đời', p: ['Làm sạch bằng sóng siêu âm, đánh bóng và xi mạ rhodium (với vàng trắng) miễn phí không giới hạn số lần.', 'Kiểm tra độ chắc chấu và siết chấu miễn phí — khuyến nghị 6 tháng/lần.', 'Chỉnh ni miễn phí 1 lần trong 60 ngày kể từ ngày nhận nhẫn (tăng/giảm tối đa 2 ni).'] },
      { h: 'Trường hợp không áp dụng', p: ['Sản phẩm bị biến dạng, gãy, đứt do va đập mạnh hoặc sử dụng sai cách; mất đá do tác động ngoại lực.', 'Sản phẩm đã được sửa chữa tại đơn vị khác ngoài hệ thống Solène.'] },
      { h: 'Cách thức bảo hành', p: ['Mang sản phẩm kèm phiếu bảo hành (hoặc số điện thoại đã đặt hàng) tới bất kỳ showroom Solène nào, hoặc gửi qua đường bưu điện — Solène chịu phí vận chuyển hai chiều cho sản phẩm bảo hành.'] },
    ],
  },
  {
    slug: 'doi-tra', title: 'Chính sách thu đổi & hoàn tiền', updated: '2026-01-01',
    description: 'Đổi mẫu trong 15 ngày, thu đổi kim cương trọn đời với giá trị lên tới 100%. Quy định chi tiết về hoàn tiền tại Solène.',
    sections: [
      { h: 'Đổi sản phẩm trong 15 ngày', p: ['Sản phẩm mua sẵn (không khắc chữ, không chế tác theo yêu cầu) được đổi sang mẫu khác có giá trị tương đương hoặc cao hơn trong 15 ngày, còn nguyên tem, hộp và phiếu bảo hành.'] },
      { h: 'Thu đổi kim cương trọn đời', p: ['Kim cương viên chủ từ 4.5 ly có giấy GIA do Solène phân phối được thu đổi trọn đời: đổi lên viên lớn hơn — tính 100% giá trị hóa đơn; thu lại — tính 85% giá trị hóa đơn.'] },
      { h: 'Hoàn tiền', p: ['Hoàn tiền 100% nếu sản phẩm có lỗi kỹ thuật từ nhà sản xuất hoặc giao sai mẫu. Tiền được hoàn trong 3–7 ngày làm việc theo phương thức thanh toán ban đầu.'] },
      { h: 'Sản phẩm chế tác riêng', p: ['Sản phẩm khắc chữ, chế tác theo ni hoặc thiết kế riêng không áp dụng đổi mẫu, nhưng vẫn được hưởng đầy đủ chính sách bảo hành và chỉnh ni miễn phí.'] },
    ],
  },
  {
    slug: 'van-chuyen', title: 'Chính sách giao hàng', updated: '2026-01-01',
    description: 'Giao hàng miễn phí có bảo hiểm 100% giá trị trên toàn quốc. Giao hỏa tốc 2 giờ nội thành TP. HCM và Hà Nội.',
    sections: [
      { h: 'Phí giao hàng', p: ['Miễn phí giao hàng tiêu chuẩn trên toàn quốc cho mọi đơn hàng, được bảo hiểm 100% giá trị sản phẩm trong suốt quá trình vận chuyển.', 'Giao hỏa tốc trong 2 giờ nội thành TP. Hồ Chí Minh và Hà Nội: 150.000 ₫/đơn.'] },
      { h: 'Thời gian giao hàng', p: ['Sản phẩm sẵn hàng: 1–3 ngày làm việc. Sản phẩm chế tác theo ni: 7–10 ngày làm việc. Trang sức cao cấp đặt trước: theo thỏa thuận.'] },
      { h: 'Nhận hàng an toàn', p: ['Kiện hàng được niêm phong bằng tem Solène. Vui lòng kiểm tra tem niêm phong và quay video khi mở hộp. Với đơn hàng trên 50 triệu, nhân viên Solène sẽ trực tiếp giao và yêu cầu xác minh danh tính người nhận.'] },
    ],
  },
  {
    slug: 'thanh-toan', title: 'Phương thức thanh toán', updated: '2026-01-01',
    description: 'Thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, thanh toán tại showroom và trả góp 0% qua thẻ tín dụng.',
    sections: [
      { h: 'Các phương thức', p: ['Thanh toán khi nhận hàng (COD) cho đơn hàng dưới 50 triệu đồng.', 'Chuyển khoản ngân hàng — nội dung chuyển khoản là mã đơn hàng.', 'Thanh toán tại showroom bằng tiền mặt, thẻ ATM nội địa, Visa, Mastercard, JCB.', 'Trả góp 0% lãi suất kỳ hạn 3–12 tháng qua thẻ tín dụng của 25 ngân hàng liên kết.'] },
      { h: 'Hóa đơn', p: ['Solène xuất hóa đơn điện tử (VAT) cho mọi đơn hàng theo thông tin bạn cung cấp khi đặt hàng.'] },
    ],
  },
  {
    slug: 'bao-mat', title: 'Chính sách bảo mật thông tin', updated: '2026-01-01',
    description: 'Cách Solène thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng.',
    sections: [
      { h: 'Thông tin thu thập', p: ['Họ tên, số điện thoại, email, địa chỉ giao hàng và lịch sử mua hàng — chỉ nhằm mục đích xử lý đơn hàng, bảo hành và chăm sóc khách hàng.'] },
      { h: 'Đăng nhập bằng Google', p: ['Khi bạn đăng nhập bằng Google, Solène chỉ nhận tên, email và ảnh đại diện công khai từ tài khoản Google của bạn. Chúng tôi không bao giờ nhận hoặc lưu mật khẩu Google.'] },
      { h: 'Lưu trữ trên trình duyệt', p: ['Website sử dụng bộ nhớ trình duyệt (localStorage) để lưu giỏ hàng, danh sách yêu thích và phiên đăng nhập trên thiết bị của bạn. Bạn có thể xóa bất kỳ lúc nào trong phần cài đặt trình duyệt.'] },
      { h: 'Cam kết', p: ['Solène không bán, trao đổi hay chia sẻ thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại.'] },
    ],
  },
  {
    slug: 'cau-hoi-thuong-gap', title: 'Câu hỏi thường gặp', updated: '2026-01-01',
    description: 'Giải đáp thắc mắc thường gặp về đặt hàng, ni tay, kim cương GIA, bảo hành và giao hàng tại Solène.',
    sections: [
      { h: 'Làm sao để biết ni tay của mình?', p: ['Bạn có thể dùng công cụ đo ni trực tuyến tại trang Hướng dẫn đo ni tay, đo bằng sợi chỉ, hoặc ghé showroom để được đo miễn phí bằng bộ ni chuẩn.'] },
      { h: 'Solène có bán kim cương nhân tạo không?', p: ['Không. Solène chỉ sử dụng kim cương thiên nhiên; viên chủ từ 0.3ct đều có giấy kiểm định GIA.'] },
      { h: 'Tôi có thể đặt thiết kế riêng?', p: ['Có. Hãy thử công cụ Thiết kế nhẫn trên website hoặc đặt lịch hẹn với nhà thiết kế của Solène để phác thảo mẫu riêng.'] },
      { h: 'Đơn hàng của tôi đang ở đâu?', p: ['Đăng nhập và vào mục Tài khoản → Đơn hàng để theo dõi trạng thái chi tiết, hoặc gọi hotline 1800 1998 (miễn phí).'] },
    ],
  },
];

export const getPolicy = (slug: string) => POLICIES.find((p) => p.slug === slug);
