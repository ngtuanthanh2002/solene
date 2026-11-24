/** Nội dung phụ: đánh giá mẫu, cảm nhận khách hàng, tỉnh thành, mã ưu đãi. (Dữ liệu DEMO) */
import type { CategoryKey } from '../lib/catalog';

export interface Review { name: string; city: string; rating: number; date: string; title: string; text: string; categories: CategoryKey[] }

/** Đánh giá mẫu hiển thị trên trang sản phẩm — thay bằng đánh giá thật khi vận hành. */
export const SAMPLE_REVIEWS: Review[] = [
  { name: 'Minh Anh', city: 'TP. Hồ Chí Minh', rating: 5, date: '2026-10-12', title: 'Cô ấy đã nói “đồng ý”', text: 'Mình chọn nhẫn qua website rồi đặt lịch xem trực tiếp. Chuyên viên tư vấn rất kỹ về 4C, nhẫn thật đẹp hơn ảnh nhiều. Khắc chữ ở mặt trong cực kỳ tinh tế.', categories: ['nhan-cau-hon'] },
  { name: 'Quốc Bảo', city: 'Hà Nội', rating: 5, date: '2026-09-03', title: 'Đúng ni, giao đúng hẹn', text: 'Mình không biết ni tay bạn gái nên dùng công cụ đo trên web với chiếc nhẫn cũ của cô ấy — vừa khít luôn. Hộp nhẫn sang, có cả giấy GIA.', categories: ['nhan-cau-hon', 'kim-cuong'] },
  { name: 'Thu Hà', city: 'Đà Nẵng', rating: 5, date: '2026-08-21', title: 'Lấp lánh dưới mọi ánh đèn', text: 'Viên chủ lửa rất đẹp, đeo đi tiệc ai cũng hỏi. Sau 3 tháng mang lên showroom làm sạch miễn phí, nhẫn sáng như mới.', categories: ['nhan-cau-hon', 'trang-suc'] },
  { name: 'Hoàng Nam', city: 'Cần Thơ', rating: 4, date: '2026-07-15', title: 'Rất hài lòng', text: 'Nhẫn đẹp, hoàn thiện tốt. Thời gian chế tác 9 ngày đúng như cam kết. Trừ 1 sao vì mình phải chờ xác nhận lời khắc hơi lâu.', categories: ['nhan-cau-hon', 'nhan-cuoi'] },
  { name: 'Lan Phương', city: 'TP. Hồ Chí Minh', rating: 5, date: '2026-10-28', title: 'Cặp nhẫn đeo cả ngày không cấn', text: 'Form comfort-fit thật sự thoải mái, chồng mình vốn không thích đeo nhẫn mà giờ không tháo ra. Khắc ngày cưới rất sắc nét.', categories: ['nhan-cuoi'] },
  { name: 'Đức Huy', city: 'Hải Phòng', rating: 5, date: '2026-06-09', title: 'Dịch vụ như khách VIP', text: 'Đặt lịch tư vấn nhẫn cưới buổi tối sau giờ làm, được đón tiếp chu đáo, có trà và bánh. Giá minh bạch, không phát sinh.', categories: ['nhan-cuoi', 'phu-kien'] },
  { name: 'Ngọc Trâm', city: 'Huế', rating: 5, date: '2026-05-30', title: 'Món quà cho mẹ', text: 'Mua chuỗi ngọc trai tặng mẹ dịp sinh nhật 60 tuổi. Ngọc đều hạt, ánh rất đẹp, hộp nhung sang trọng. Mẹ mình xúc động lắm.', categories: ['trang-suc'] },
  { name: 'Khánh Linh', city: 'Hà Nội', rating: 5, date: '2026-09-18', title: 'Tinh tế từng chi tiết', text: 'Bông tai halo đeo hằng ngày rất nhẹ, khóa vặn chắc chắn. Mình đã quay lại mua thêm dây chuyền cùng bộ.', categories: ['trang-suc'] },
  { name: 'Thanh Tùng', city: 'TP. Hồ Chí Minh', rating: 5, date: '2026-08-02', title: 'Kim cương chuẩn GIA', text: 'Được xem đá dưới kính lúp, đối chiếu mã laser với giấy GIA ngay tại chỗ. Giá tốt hơn mình tham khảo ở vài nơi khác.', categories: ['kim-cuong'] },
  { name: 'Bảo Ngọc', city: 'Vĩnh Long', rating: 5, date: '2026-07-21', title: 'Khuy măng sét cho ngày cưới', text: 'Đặt khắc monogram cho chồng và hai phù rể, hộp gỗ rất đẹp. Giao nhanh trước ngày cưới.', categories: ['phu-kien'] },
  { name: 'Mai Chi', city: 'TP. Hồ Chí Minh', rating: 5, date: '2026-10-05', title: 'Tác phẩm nghệ thuật', text: 'Được mời xem bộ trang sức cao cấp trong phòng riêng, nghe kể về quá trình chế tác 600 giờ. Trải nghiệm rất đáng nhớ.', categories: ['trang-suc-cao-cap'] },
];

export const TESTIMONIALS = [
  { quote: 'Chúng tôi chọn Solène vì cách họ lắng nghe câu chuyện của mình. Chiếc nhẫn không chỉ đẹp — nó mang đúng tinh thần của tình yêu chúng tôi.', name: 'Minh Anh & Quốc Việt', meta: 'Nhẫn cầu hôn Silk Veil · Cưới tháng 10/2026', image: 'life-touch-hands' },
  { quote: 'Từ lúc đo ni bằng công cụ trên web đến khi nhận nhẫn chỉ 9 ngày. Hộp nhẫn mở ra là cả hai đứa cùng “wow”.', name: 'Thảo & Long', meta: 'Cặp nhẫn Hand in Hand · Hà Nội', image: 'life-bouquet-hands' },
  { quote: 'Chuyên viên giải thích 4C dễ hiểu đến mức tôi tự tin chọn được viên kim cương ưng ý nhất trong ngân sách.', name: 'Anh Hoàng Phúc', meta: 'Kim cương GIA 5.4 ly · TP. Hồ Chí Minh', image: 'dia-tweezers' },
];

/** 34 tỉnh, thành phố (theo sắp xếp đơn vị hành chính từ 01/07/2025) */
export const PROVINCES = [
  'TP. Hồ Chí Minh', 'Hà Nội', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Huế',
  'An Giang', 'Bắc Ninh', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Tĩnh',
  'Hưng Yên', 'Khánh Hòa', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Nghệ An', 'Ninh Bình', 'Phú Thọ', 'Quảng Ngãi',
  'Quảng Ninh', 'Quảng Trị', 'Sơn La', 'Tây Ninh', 'Thái Nguyên', 'Thanh Hóa', 'Tuyên Quang', 'Vĩnh Long',
];

/** Mã ưu đãi demo */
export const PROMOS: Record<string, { label: string; type: 'percent' | 'fixed'; value: number; max?: number; min?: number; category?: CategoryKey }> = {
  SOLENE10: { label: 'Giảm 10% (tối đa 5.000.000 ₫)', type: 'percent', value: 10, max: 5000000 },
  CUOI2026: { label: 'Giảm 5% cho nhẫn cưới', type: 'percent', value: 5, category: 'nhan-cuoi' },
  WELCOME: { label: 'Giảm 1.000.000 ₫ cho đơn từ 10 triệu', type: 'fixed', value: 1000000, min: 10000000 },
};
