import type { CategoryKey } from '../lib/catalog';

export type FilterKey = 'style' | 'shape' | 'type' | 'metal' | 'mood' | 'collection' | 'price';

export interface Category {
  key: CategoryKey | 'cua-hang';
  name: string;
  eyebrow: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  banner: string;
  mobile: string;
  filters: FilterKey[];
  quick?: 'style' | 'shape' | 'type';
  seo: { heading: string; paragraphs: string[] };
  faq?: { q: string; a: string }[];
}

export const CATEGORIES: Category[] = [
  {
    key: 'nhan-cau-hon', name: 'Nhẫn cầu hôn', eyebrow: 'Engagement Rings', h1: 'Nhẫn cầu hôn kim cương',
    title: 'Nhẫn cầu hôn kim cương GIA cao cấp',
    description: 'Nhẫn cầu hôn kim cương thiên nhiên kiểm định GIA: Solitaire, Halo, Cathedral, Twist, Royal… Chế tác theo ni tay, khắc chữ miễn phí, bảo hành trọn đời tại Solène.',
    intro: 'Tám kiểu dáng, bảy dáng viên chủ và bốn chất liệu quý — tìm chiếc nhẫn kể đúng câu chuyện tình yêu của bạn.',
    banner: 'life-ring-box', mobile: 'life-ring-box',
    filters: ['style', 'shape', 'mood', 'metal', 'collection', 'price'], quick: 'style',
    seo: {
      heading: 'Chọn nhẫn cầu hôn kim cương như thế nào?',
      paragraphs: [
        'Một chiếc nhẫn cầu hôn đẹp là sự cân bằng giữa kiểu dáng (setting), viên chủ và chất liệu. Kiểu Solitaire tôn vinh trọn vẹn viên kim cương; Halo giúp viên chủ trông lớn hơn tới 0.5ct; Cathedral và Royal mang vẻ cổ điển, đài các; Twist và Trellis phù hợp với người yêu sự mềm mại, khác biệt.',
        'Tại Solène, mọi viên chủ từ 0.3ct đều có giấy kiểm định GIA, khắc laser mã số trên gờ viên. Nhẫn được chế tác theo đúng ni tay trong 7–10 ngày, khắc chữ miễn phí và được bảo hành, làm mới trọn đời.',
      ],
    },
    faq: [
      { q: 'Nên chọn kim cương bao nhiêu ly cho nhẫn cầu hôn?', a: 'Kích thước phổ biến nhất tại Việt Nam là 5.4 ly (≈ 0.6ct) đến 6.3 ly (≈ 0.9ct). Với ngón tay thon, 4.5–5.4 ly đã rất nổi bật; nếu muốn viên chủ trông lớn hơn, hãy cân nhắc kiểu Halo.' },
      { q: 'Tôi không biết ni tay của người ấy?', a: 'Bạn có thể đặt ni phổ biến (ni 10–12 cho nữ). Solène hỗ trợ chỉnh ni miễn phí một lần trong 60 ngày sau khi nhận nhẫn.' },
      { q: 'Bao lâu thì nhận được nhẫn?', a: 'Mẫu sẵn hàng giao trong 1–3 ngày. Mẫu chế tác theo ni hoàn thiện trong 7–10 ngày làm việc, giao miễn phí và có bảo hiểm toàn quốc.' },
    ],
  },
  {
    key: 'nhan-cuoi', name: 'Nhẫn cưới', eyebrow: 'Wedding Bands', h1: 'Nhẫn cưới',
    title: 'Nhẫn cưới vàng 18K, bạch kim & kim cương',
    description: 'Cặp nhẫn cưới vàng 18K, bạch kim PT950 và nhẫn cưới kim cương chế tác thủ công theo ni tay. Khắc chữ miễn phí, bảo hành trọn đời, giao hàng bảo hiểm toàn quốc.',
    intro: 'Những cặp nhẫn được chế tác riêng theo ni tay hai bạn — thoải mái để đeo mỗi ngày, bền bỉ để đeo trọn đời.',
    banner: 'life-bouquet-hands', mobile: 'life-bouquet-hands',
    filters: ['type', 'mood', 'metal', 'collection', 'price'], quick: 'type',
    seo: {
      heading: 'Kinh nghiệm chọn nhẫn cưới bền đẹp trọn đời',
      paragraphs: [
        'Vàng 18K (Au750) là lựa chọn được ưa chuộng nhờ độ cứng tốt, ít biến dạng và giữ màu bền. Bạch kim PT950 có độ tinh khiết cao, không gây kích ứng và không bao giờ phai màu — phù hợp cho người có làn da nhạy cảm.',
        'Bản nhẫn nữ thường từ 2–3 mm, nhẫn nam 3.5–5 mm. Kiểu comfort-fit (lòng nhẫn bo tròn) giúp đeo cả ngày không cấn tay. Đừng quên khắc ngày cưới hay một lời nhắn nhỏ ở mặt trong — dịch vụ miễn phí tại Solène.',
      ],
    },
    faq: [
      { q: 'Cặp nhẫn cưới đã bao gồm cả nhẫn nam và nữ?', a: 'Có. Giá hiển thị là giá trọn cặp; bạn chọn ni riêng cho nhẫn nữ và nhẫn nam khi đặt hàng.' },
      { q: 'Có được khắc chữ khác nhau trên hai nhẫn?', a: 'Hoàn toàn được. Bạn nhập lời khắc ở trang sản phẩm, đội ngũ Solène sẽ liên hệ để xác nhận nội dung cho từng nhẫn.' },
    ],
  },
  {
    key: 'trang-suc', name: 'Trang sức', eyebrow: 'Fine Jewelry', h1: 'Trang sức kim cương & ngọc trai',
    title: 'Trang sức kim cương, ngọc trai, vàng 18K',
    description: 'Dây chuyền, bông tai, lắc tay kim cương và ngọc trai Akoya chế tác từ vàng 18K. Quà tặng sang trọng cho người thương — đóng hộp cao cấp, giao nhanh toàn quốc.',
    intro: 'Dây chuyền, bông tai và lắc tay — những món trang sức để đeo mỗi ngày hay trao tặng trong những dịp đáng nhớ.',
    banner: 'ed-necklace-light', mobile: 'ed-necklace-light',
    filters: ['type', 'shape', 'mood', 'metal', 'collection', 'price'], quick: 'type',
    seo: {
      heading: 'Trang sức cao cấp — món quà không bao giờ lỗi thời',
      paragraphs: [
        'Trang sức Solène được chế tác từ vàng 18K và bạch kim, đính kim cương thiên nhiên cùng ngọc trai Akoya, South Sea tuyển chọn. Mỗi sản phẩm đều đi kèm giấy bảo hành, giấy kiểm định và hộp quà cao cấp.',
        'Gợi ý quà tặng: dây chuyền trái tim pavé cho dịp Valentine, bông tai ngọc trai cho mẹ, lắc tay mảnh để xếp tầng cho bạn thân — tất cả đều có thể khắc chữ hoặc gửi kèm thiệp viết tay.',
      ],
    },
  },
  {
    key: 'kim-cuong', name: 'Kim cương viên', eyebrow: 'GIA Certified Diamonds', h1: 'Kim cương viên kiểm định GIA',
    title: 'Kim cương viên GIA 4.5 – 7.2 ly, giá tốt',
    description: 'Kim cương viên thiên nhiên kiểm định GIA từ 4.5 ly đến 7.2 ly và dáng fancy 1.0ct. Giác cắt 3EX, thu đổi trọn đời, xem đá trực tiếp tại showroom Solène.',
    intro: 'Kim cương thiên nhiên kiểm định GIA, giác cắt 3EX — xem trực tiếp dưới kính lúp chuyên dụng tại showroom.',
    banner: 'dia-shapes', mobile: 'dia-tweezers',
    filters: ['shape', 'price'], quick: 'shape',
    seo: {
      heading: 'Mua kim cương viên: cần biết gì về 4C?',
      paragraphs: [
        '4C gồm Cut (giác cắt), Color (nước màu), Clarity (độ tinh khiết) và Carat (trọng lượng). Trong đó giác cắt quyết định độ lấp lánh nhiều nhất — vì vậy Solène chỉ chọn kim cương tròn đạt chuẩn 3EX (Excellent cho cắt, đánh bóng và đối xứng).',
        'Tại Việt Nam, kim cương thường được gọi theo đường kính “ly” (mm): 4.5 ly ≈ 0.33ct, 5.4 ly ≈ 0.6ct, 6.3 ly ≈ 0.9ct, 7.2 ly ≈ 1.35ct. Mọi viên đều có giấy GIA và được áp dụng chính sách thu đổi trọn đời.',
      ],
    },
    faq: [
      { q: 'Kim cương GIA là gì?', a: 'GIA (Gemological Institute of America) là viện ngọc học uy tín hàng đầu thế giới. Giấy GIA xác nhận đầy đủ 4C, kích thước và mã số khắc laser trên gờ viên kim cương.' },
      { q: 'Tôi có thể xem kim cương trước khi mua?', a: 'Có. Bạn đặt lịch hẹn tại showroom để chuyên viên giám định hướng dẫn xem đá dưới kính lúp 10x và máy kiểm tra chuyên dụng.' },
    ],
  },
  {
    key: 'trang-suc-cao-cap', name: 'Trang sức cao cấp', eyebrow: 'Haute Joaillerie', h1: 'Trang sức cao cấp',
    title: 'Trang sức cao cấp – Haute Joaillerie',
    description: 'Tác phẩm trang sức cao cấp độc bản: ngọc lục bảo Colombia, sapphire Sri Lanka, kim cương fancy. Chế tác thủ công hàng trăm giờ, xem riêng tại showroom Solène.',
    intro: 'Những tác phẩm độc bản với đá quý hiếm, hàng trăm giờ chế tác thủ công — chỉ giới thiệu trong buổi hẹn riêng.',
    banner: 'hj-emerald-set', mobile: 'hj-emerald-set',
    filters: ['type', 'price'],
    seo: {
      heading: 'Haute Joaillerie — đỉnh cao nghệ thuật kim hoàn',
      paragraphs: [
        'Mỗi tác phẩm trang sức cao cấp của Solène bắt đầu từ một viên đá quý đặc biệt. Từ bản phác thảo bằng màu nước đến khi hoàn thiện, tác phẩm trải qua hàng trăm giờ làm việc của các nghệ nhân chế tác, gắn đá và đánh bóng.',
        'Để trải nghiệm trọn vẹn, vui lòng đặt lịch hẹn riêng — chuyên viên Solène sẽ đón tiếp bạn trong phòng VIP với đầy đủ hồ sơ chế tác và giấy chứng nhận đá quý.',
      ],
    },
  },
  {
    key: 'phu-kien', name: 'Phụ kiện', eyebrow: 'Accessories', h1: 'Phụ kiện cao cấp',
    title: 'Phụ kiện cao cấp: khuy măng sét, cài áo, hộp trang sức',
    description: 'Khuy măng sét vàng 18K, cài áo kim cương, nhẫn nam signet và hộp trang sức da cao cấp — quà tặng tinh tế cho quý ông và quý cô.',
    intro: 'Khuy măng sét, cài áo, nhẫn signet và hộp trang sức — những chi tiết nhỏ làm nên phong thái.',
    banner: 'life-cufflinks', mobile: 'life-cufflinks',
    filters: ['type', 'metal', 'price'], quick: 'type',
    seo: {
      heading: 'Phụ kiện — dấu ấn của người tinh tế',
      paragraphs: [
        'Một đôi khuy măng sét bằng vàng, chiếc cài áo kim cương trên ve áo hay hộp trang sức da chần trám — những phụ kiện nhỏ nhưng nói rất nhiều về gu thẩm mỹ của chủ nhân.',
        'Tất cả phụ kiện Solène đều có thể khắc tên hoặc monogram, đóng hộp quà cao cấp và gửi kèm thiệp viết tay miễn phí.',
      ],
    },
  },
];

export const SHOP_ALL: Category = {
  key: 'cua-hang', name: 'Cửa hàng', eyebrow: 'Solène Boutique', h1: 'Tất cả sản phẩm',
  title: 'Cửa hàng trang sức Solène',
  description: 'Toàn bộ nhẫn cầu hôn, nhẫn cưới, kim cương viên GIA, trang sức và phụ kiện cao cấp của Solène Fine Jewelry.',
  intro: 'Toàn bộ thiết kế của Solène — từ chiếc nhẫn mảnh cho mỗi ngày đến tác phẩm trang sức cao cấp độc bản.',
  banner: 'ed-gold-stilllife', mobile: 'ed-gold-stilllife',
  filters: ['type', 'style', 'shape', 'mood', 'metal', 'collection', 'price'],
  seo: {
    heading: 'Solène — trang sức chế tác thủ công từ 1998',
    paragraphs: [
      'Solène Fine Jewelry chế tác nhẫn cầu hôn, nhẫn cưới và trang sức kim cương cao cấp tại xưởng riêng ở TP. Hồ Chí Minh. Mọi sản phẩm đều được bảo hành trọn đời, làm sạch và đánh bóng miễn phí.',
    ],
  },
};

export const getCategory = (key: string) => CATEGORIES.find((c) => c.key === key) || (key === 'cua-hang' ? SHOP_ALL : undefined);
