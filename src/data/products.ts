/**
 * Danh mục sản phẩm (dữ liệu demo).
 * Ảnh: /public/images/p/<key>-{400|800|1200}.webp — ảnh từ Unsplash (giấy phép Unsplash), xem README.
 */
import type { CategoryKey, MetalKey, Mood, RingStyle, Shape } from '../lib/catalog';

export interface Variant { value: string; label: string; price: number }
export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: CategoryKey;
  type: string;
  price: number;
  compareAt?: number;
  images: string[];
  style?: RingStyle;
  shape?: Shape;
  moods: Mood[];
  collection?: string;
  metals: MetalKey[];
  sizing?: 'ring' | 'pair';
  engravable?: boolean;
  variants?: { label: string; options: Variant[] };
  badges?: ('new' | 'bestseller' | 'signature' | 'limited')[];
  rating: number;
  reviews: number;
  sold: number;
  createdAt: string;
  leadTime: string;
  description: string;
  details: [string, string][];
}

const GOLD: MetalKey[] = ['vang-vang-18k', 'vang-hong-18k', 'vang-trang-18k'];
const WHITE: MetalKey[] = ['vang-trang-18k', 'bach-kim', 'vang-vang-18k', 'vang-hong-18k'];
const ROSE: MetalKey[] = ['vang-hong-18k', 'vang-vang-18k', 'vang-trang-18k'];
const ALL4: MetalKey[] = ['vang-vang-18k', 'vang-hong-18k', 'vang-trang-18k', 'bach-kim'];
const MADE = 'Chế tác theo ni tay trong 7–10 ngày';
const READY = 'Sẵn hàng · giao trong 1–3 ngày';

export const PRODUCTS: Product[] = [
  // ───────────────────────── NHẪN CẦU HÔN ─────────────────────────
  {
    id: 'SL-NCH-01', slug: 'nhan-cau-hon-silk-veil-solitaire', name: 'Silk Veil Solitaire', subtitle: 'Nhẫn cầu hôn kim cương 0.75ct',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 68900000, images: ['ring-silk-solitaire', 'ed-satin-hand', 'life-ring-box'],
    style: 'solitaire', shape: 'round', moods: ['thanh-lich', 'dai-cac'], collection: 'silk-veil', metals: ALL4, sizing: 'ring', engravable: true,
    badges: ['signature', 'bestseller'], rating: 4.9, reviews: 128, sold: 412, createdAt: '2026-03-02', leadTime: MADE,
    description: 'Lấy cảm hứng từ dải voan lụa trong ngày cưới, Silk Veil Solitaire tôn vinh viên kim cương tròn 0.75ct trên bốn chấu mảnh như cánh hoa. Đai nhẫn đính pavé 22 viên kim cương tấm thon dần về phía viên chủ, ôm trọn ngón tay và bắt sáng ở mọi góc nhìn — thiết kế biểu tượng của Solène.',
    details: [['Chất liệu', 'Vàng 18K (Au750) hoặc Bạch kim PT950'], ['Viên chủ', 'Kim cương thiên nhiên 0.75ct · Round Brilliant'], ['Nước màu · Độ tinh khiết', 'F · VS1'], ['Giác cắt', 'Excellent'], ['Chứng nhận', 'GIA'], ['Đá tấm', '22 viên · tổng 0.18ct'], ['Bản nhẫn', '1.8 mm']],
  },
  {
    id: 'SL-NCH-02', slug: 'nhan-cau-hon-etoile-cushion-halo', name: 'Étoile Cushion Halo', subtitle: 'Nhẫn cầu hôn kim cương cushion 1.0ct',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 89500000, images: ['ring-cushion-halo', 'life-hands-diamonds'],
    style: 'halo', shape: 'cushion', moods: ['dai-cac', 'quyen-ru'], collection: 'starlit-vow', metals: WHITE, sizing: 'ring', engravable: true,
    badges: ['bestseller'], rating: 4.9, reviews: 86, sold: 233, createdAt: '2026-01-18', leadTime: MADE,
    description: 'Viên kim cương cushion 1.0ct được bao quanh bởi vòng halo kép, tạo hiệu ứng như một ngôi sao vừa thức giấc. Đai nhẫn pavé hai hàng giúp ánh sáng chảy liền mạch từ thân nhẫn lên viên chủ — lộng lẫy nhưng vẫn vô cùng tinh tế.',
    details: [['Chất liệu', 'Vàng trắng 18K / Bạch kim PT950'], ['Viên chủ', 'Kim cương thiên nhiên 1.0ct · Cushion'], ['Nước màu · Độ tinh khiết', 'E · VS1'], ['Chứng nhận', 'GIA'], ['Đá tấm', '64 viên · tổng 0.42ct'], ['Bản nhẫn', '2.0 mm']],
  },
  {
    id: 'SL-NCH-03', slug: 'nhan-cau-hon-royal-pear-cluster', name: 'Royal Pear Cluster', subtitle: 'Nhẫn cầu hôn kim cương giọt lệ 1.2ct',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 126000000, images: ['ring-pear-royal', 'life-hands-diamonds'],
    style: 'royal', shape: 'pear', moods: ['dai-cac', 'quyen-ru'], collection: 'eternal-grace', metals: WHITE, sizing: 'ring', engravable: true,
    badges: ['limited'], rating: 5, reviews: 24, sold: 41, createdAt: '2026-05-10', leadTime: 'Chế tác theo yêu cầu trong 14–21 ngày',
    description: 'Viên giọt lệ 1.2ct ngự giữa một vương miện kim cương cắt marquise và tròn, gợi nhớ những món trang sức hoàng gia châu Âu. Đai nhẫn đính đá kép cùng viền milgrain thủ công khiến Royal Pear Cluster trở thành tuyên ngôn cho một lời cầu hôn khó quên.',
    details: [['Chất liệu', 'Vàng trắng 18K / Bạch kim PT950'], ['Viên chủ', 'Kim cương thiên nhiên 1.2ct · Pear'], ['Nước màu · Độ tinh khiết', 'D · VVS2'], ['Chứng nhận', 'GIA'], ['Đá tấm', '48 viên · tổng 1.05ct'], ['Số lượng', 'Giới hạn 30 chiếc/năm']],
  },
  {
    id: 'SL-NCH-04', slug: 'nhan-cau-hon-goutte-de-rosee', name: 'Goutte de Rosée', subtitle: 'Nhẫn cầu hôn giọt lệ halo 0.6ct',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 72800000, images: ['ring-pear-halo', 'ed-hands-white'],
    style: 'halo', shape: 'pear', moods: ['ngot-ngao', 'thanh-lich'], collection: 'ma-cherie', metals: WHITE, sizing: 'ring', engravable: true,
    rating: 4.8, reviews: 57, sold: 164, createdAt: '2025-11-20', leadTime: MADE,
    description: '“Giọt sương mai” — viên kim cương giọt lệ 0.6ct trong vòng halo mảnh, đặt trên đai nhẫn đính đá tròn xen viền milgrain. Một thiết kế dịu dàng dành cho người con gái yêu sự lãng mạn cổ điển.',
    details: [['Chất liệu', 'Vàng trắng 18K / Bạch kim PT950'], ['Viên chủ', 'Kim cương thiên nhiên 0.6ct · Pear'], ['Nước màu · Độ tinh khiết', 'F · VS2'], ['Chứng nhận', 'GIA'], ['Đá tấm', '36 viên · tổng 0.32ct']],
  },
  {
    id: 'SL-NCH-05', slug: 'nhan-cau-hon-emerald-lumiere', name: 'Emerald Lumière', subtitle: 'Nhẫn cầu hôn kim cương emerald 1.0ct',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 94600000, images: ['ring-emerald-gold', 'life-hand-emerald'],
    style: 'cathedral', shape: 'emerald', moods: ['hien-dai', 'dai-cac'], collection: 'silk-veil', metals: GOLD, sizing: 'ring', engravable: true,
    badges: ['new'], rating: 4.9, reviews: 31, sold: 77, createdAt: '2026-09-15', leadTime: MADE,
    description: 'Giác cắt bậc thang (step-cut) của viên emerald 1.0ct tạo nên những “tấm gương” ánh sáng sang trọng và trầm lắng. Vai nhẫn cathedral nâng viên chủ lên cao, đai pavé vàng 18K ấm áp — vẻ đẹp hiện đại đầy khí chất.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Viên chủ', 'Kim cương thiên nhiên 1.0ct · Emerald'], ['Nước màu · Độ tinh khiết', 'F · VVS2'], ['Chứng nhận', 'GIA'], ['Đá tấm', '26 viên · tổng 0.22ct'], ['Kiểu vai', 'Cathedral']],
  },
  {
    id: 'SL-NCH-06', slug: 'nhan-cau-hon-princesse-solitaire', name: 'Princesse Solitaire', subtitle: 'Nhẫn cầu hôn kim cương princess 0.5ct',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 45900000, images: ['ring-princess-trio', 'life-touch-hands'],
    style: 'solitaire', shape: 'princess', moods: ['hien-dai', 'thanh-lich'], collection: 'starlit-vow', metals: WHITE, sizing: 'ring', engravable: true,
    rating: 4.7, reviews: 44, sold: 138, createdAt: '2025-08-02', leadTime: MADE,
    description: 'Đường nét vuông vức của giác cắt princess mang lại vẻ thanh lịch hiện đại. Bốn chấu góc giữ chắc viên chủ 0.5ct trên đai nhẫn trơn bóng gương — tối giản để kim cương lên tiếng.',
    details: [['Chất liệu', 'Vàng trắng 18K / Bạch kim PT950'], ['Viên chủ', 'Kim cương thiên nhiên 0.5ct · Princess'], ['Nước màu · Độ tinh khiết', 'G · VS1'], ['Chứng nhận', 'GIA'], ['Bản nhẫn', '2.0 mm']],
  },
  {
    id: 'SL-NCH-07', slug: 'nhan-cau-hon-rose-sapphire-halo', name: 'Rose Sapphire Halo', subtitle: 'Nhẫn sapphire hồng 2.1ct viền kim cương',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 58500000, images: ['ring-pink-sapphire', 'ring-pink-sapphire-2'],
    style: 'halo', shape: 'emerald', moods: ['ngot-ngao', 'quyen-ru'], collection: 'ma-cherie', metals: ROSE, sizing: 'ring', engravable: true,
    badges: ['new'], rating: 4.9, reviews: 19, sold: 52, createdAt: '2026-10-01', leadTime: MADE,
    description: 'Viên sapphire hồng Ceylon 2.1ct sắc hồng đào hiếm có, ôm trong vòng halo kim cương và đai vàng hồng 18K. Dành cho cô dâu muốn một chiếc nhẫn cầu hôn khác biệt — ngọt ngào, rực rỡ và đầy cá tính.',
    details: [['Chất liệu', 'Vàng hồng 18K'], ['Đá chủ', 'Sapphire hồng thiên nhiên 2.1ct · Cushion-emerald'], ['Xuất xứ đá', 'Sri Lanka'], ['Đá tấm', 'Kim cương 52 viên · tổng 0.38ct'], ['Chứng nhận', 'GRS']],
  },
  {
    id: 'SL-NCH-08', slug: 'nhan-cau-hon-infinity-twist-pave', name: 'Infinity Twist Pavé', subtitle: 'Nhẫn cầu hôn đai xoắn pavé 0.5ct',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 52400000, images: ['ring-twist-pave', 'life-touch-hands'],
    style: 'twist', shape: 'round', moods: ['hien-dai', 'quyen-ru'], collection: 'starlit-vow', metals: WHITE, sizing: 'ring', engravable: true,
    rating: 4.8, reviews: 38, sold: 96, createdAt: '2025-12-12', leadTime: MADE,
    description: 'Hai dải đai — một trơn bóng, một đính pavé — quấn lấy nhau như biểu tượng vô cực, nâng đỡ viên kim cương 0.5ct ở trung tâm. Lời hứa về hai cuộc đời đan cài, mãi không tách rời.',
    details: [['Chất liệu', 'Vàng trắng 18K / Bạch kim PT950'], ['Viên chủ', 'Kim cương thiên nhiên 0.5ct · Round'], ['Nước màu · Độ tinh khiết', 'F · VS2'], ['Chứng nhận', 'GIA'], ['Đá tấm', '30 viên · tổng 0.24ct']],
  },
  {
    id: 'SL-NCH-09', slug: 'nhan-cau-hon-lotus-vintage-cluster', name: 'Lotus Vintage Cluster', subtitle: 'Nhẫn kim cương champagne đính cụm hoa sen',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 38900000, images: ['ring-vintage-bloom', 'ed-gold-stilllife'],
    style: 'trellis', shape: 'round', moods: ['dai-cac', 'ngot-ngao'], collection: 'lotus-bloom', metals: GOLD, sizing: 'ring', engravable: true,
    rating: 4.8, reviews: 27, sold: 71, createdAt: '2025-10-05', leadTime: MADE,
    description: 'Những cánh sen bằng kim cương champagne xếp lớp quanh nhụy, đặt trên chấu đan giàn hoa trellis chạm khắc thủ công. Một thiết kế mang hơi thở hoài cổ Á Đông, ấm áp trên nền vàng 18K.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Đá', 'Kim cương champagne thiên nhiên · tổng 0.85ct'], ['Kỹ thuật', 'Chạm khắc thủ công, viền milgrain'], ['Kiểu chấu', 'Trellis']],
  },
  {
    id: 'SL-NCH-10', slug: 'nhan-kim-cuong-petite-etoile', name: 'Petite Étoile', subtitle: 'Nhẫn kim cương trái tim mini',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 18900000, compareAt: 21500000, images: ['ring-petite-gold', 'ed-hands-shirt'],
    style: 'solitaire', shape: 'heart', moods: ['ngot-ngao'], collection: 'petite-lumiere', metals: GOLD, sizing: 'ring', engravable: true,
    badges: ['bestseller'], rating: 4.8, reviews: 142, sold: 520, createdAt: '2025-06-14', leadTime: READY,
    description: 'Ba trái tim kim cương nhỏ xinh nối nhau trên đai vàng mảnh — món quà cầu hôn đầu tiên hoàn hảo, hay chiếc nhẫn kỷ niệm để đeo mỗi ngày. Nhẹ nhàng, tinh nghịch mà vẫn rất sang.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Đá', 'Kim cương thiên nhiên · tổng 0.12ct'], ['Bản nhẫn', '1.4 mm'], ['Phù hợp', 'Đeo hằng ngày, xếp tầng']],
  },
  {
    id: 'SL-NCH-11', slug: 'nhan-cau-hon-aurore-halo', name: 'Aurore Halo', subtitle: 'Nhẫn cầu hôn halo đai tách 0.7ct',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 64200000, images: ['ring-halo-split', 'life-ring-box'],
    style: 'bridge-accent', shape: 'round', moods: ['quyen-ru', 'dai-cac'], collection: 'eternal-grace', metals: WHITE, sizing: 'ring', engravable: true,
    rating: 4.8, reviews: 33, sold: 88, createdAt: '2026-02-11', leadTime: MADE,
    description: 'Đai nhẫn tách đôi mềm mại như tia nắng ban mai, hội tụ về viên kim cương 0.7ct được nâng bởi thanh cầu đính đá tinh xảo. Nhìn nghiêng, những viên kim cương nhỏ dưới ổ chấu khẽ lấp lánh — bí mật chỉ người đeo mới thấy.',
    details: [['Chất liệu', 'Vàng trắng 18K / Bạch kim PT950'], ['Viên chủ', 'Kim cương thiên nhiên 0.7ct · Round'], ['Nước màu · Độ tinh khiết', 'F · VS1'], ['Chứng nhận', 'GIA'], ['Đá tấm', '44 viên · tổng 0.36ct']],
  },
  {
    id: 'SL-NCH-12', slug: 'nhan-cau-hon-oval-rose', name: 'Oval Rosé', subtitle: 'Nhẫn cầu hôn kim cương oval 1.0ct',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 82300000, images: ['ring-oval-rose', 'ed-satin-hand'],
    style: 'halo', shape: 'oval', moods: ['ngot-ngao', 'thanh-lich'], collection: 'ma-cherie', metals: ROSE, sizing: 'ring', engravable: true,
    badges: ['new'], rating: 5, reviews: 22, sold: 64, createdAt: '2026-08-21', leadTime: MADE,
    description: 'Dáng oval thon dài giúp ngón tay trông thanh mảnh hơn; vòng halo trên nền vàng hồng 18K phủ lên viên kim cương 1.0ct một sắc hồng phớt dịu dàng như má hồng của cô dâu.',
    details: [['Chất liệu', 'Vàng hồng 18K'], ['Viên chủ', 'Kim cương thiên nhiên 1.0ct · Oval'], ['Nước màu · Độ tinh khiết', 'F · VS1'], ['Chứng nhận', 'GIA'], ['Đá tấm', '40 viên · tổng 0.28ct']],
  },
  {
    id: 'SL-NCH-13', slug: 'nhan-cau-hon-illusion-princess', name: 'Illusion Princess', subtitle: 'Nhẫn kim cương princess ổ illusion',
    category: 'nhan-cau-hon', type: 'nhan-cau-hon', price: 26800000, images: ['ring-princess-gold', 'life-touch-hands'],
    style: 'cathedral', shape: 'princess', moods: ['hien-dai'], collection: 'petite-lumiere', metals: ['vang-hong-18k', 'vang-vang-18k'], sizing: 'ring', engravable: true,
    rating: 4.6, reviews: 41, sold: 150, createdAt: '2025-07-30', leadTime: READY,
    description: 'Ổ illusion bằng vàng trắng khéo léo khuếch đại viên kim cương princess, tạo cảm giác viên đá lớn hơn kích thước thật. Đai vàng hồng hai tầng đính đá — lựa chọn tinh tế với ngân sách hợp lý.',
    details: [['Chất liệu', 'Vàng hồng 18K phối vàng trắng'], ['Viên chủ', 'Kim cương thiên nhiên 0.25ct · Princess'], ['Nước màu · Độ tinh khiết', 'G · VS2'], ['Đá tấm', '18 viên · tổng 0.09ct']],
  },

  // ───────────────────────── NHẪN CƯỚI ─────────────────────────
  {
    id: 'SL-NC-01', slug: 'nhan-cuoi-hand-in-hand-classic', name: 'Hand in Hand Classic', subtitle: 'Cặp nhẫn cưới vàng 18K trơn',
    category: 'nhan-cuoi', type: 'cap-nhan-cuoi', price: 16800000, images: ['band-interlock', 'life-bouquet-hands'],
    moods: ['thanh-lich'], collection: 'hand-in-hand', metals: ALL4, sizing: 'pair', engravable: true,
    badges: ['bestseller'], rating: 4.9, reviews: 236, sold: 980, createdAt: '2025-04-01', leadTime: MADE,
    description: 'Cặp nhẫn cưới kinh điển với bề mặt cong comfort-fit, đánh bóng gương thủ công. Thiết kế không bao giờ lỗi thời — để hai bàn tay nắm lấy nhau suốt cuộc đời.',
    details: [['Chất liệu', 'Vàng 18K (Au750) hoặc Bạch kim PT950'], ['Nhẫn nữ', 'Bản 2.5 mm'], ['Nhẫn nam', 'Bản 3.5 mm'], ['Kiểu dáng', 'Comfort-fit, đánh bóng gương'], ['Khắc chữ', 'Miễn phí 2 nhẫn']],
  },
  {
    id: 'SL-NC-02', slug: 'nhan-cuoi-silk-veil-wedding-bands', name: 'Silk Veil Wedding Bands', subtitle: 'Cặp nhẫn cưới kim cương Silk Veil',
    category: 'nhan-cuoi', type: 'cap-nhan-cuoi', price: 21500000, images: ['band-baby-breath', 'ed-satin-hand'],
    moods: ['thanh-lich', 'ngot-ngao'], collection: 'silk-veil', metals: ALL4, sizing: 'pair', engravable: true,
    badges: ['signature'], rating: 4.9, reviews: 118, sold: 455, createdAt: '2026-03-02', leadTime: MADE,
    description: 'Phiên bản nhẫn cưới đồng điệu cùng Silk Veil Solitaire: nhẫn nữ đính 7 viên kim cương như hạt sương trên voan cưới, nhẫn nam phay xước sợi lụa mềm mại. Khi đeo cạnh nhẫn cầu hôn Silk Veil, hai chiếc khớp nhau hoàn hảo.',
    details: [['Chất liệu', 'Vàng 18K (Au750) hoặc Bạch kim PT950'], ['Nhẫn nữ', 'Bản 2.2 mm · 7 viên kim cương tổng 0.07ct'], ['Nhẫn nam', 'Bản 4.0 mm · phay xước satin'], ['Khắc chữ', 'Miễn phí 2 nhẫn']],
  },
  {
    id: 'SL-NC-03', slug: 'nhan-cuoi-forever-gold-duo', name: 'Forever Gold Duo', subtitle: 'Cặp nhẫn cưới vàng phay mờ',
    category: 'nhan-cuoi', type: 'cap-nhan-cuoi', price: 14900000, images: ['band-dried-flowers', 'life-wedding-hands'],
    moods: ['thanh-lich', 'hien-dai'], collection: 'hand-in-hand', metals: GOLD, sizing: 'pair', engravable: true,
    rating: 4.8, reviews: 97, sold: 402, createdAt: '2025-05-19', leadTime: MADE,
    description: 'Bề mặt phay mờ satin kết hợp đường viền bóng gương tạo nên vẻ đẹp trầm ấm, ít trầy xước khi đeo hằng ngày. Lựa chọn tinh tế cho những cặp đôi yêu sự giản dị.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Nhẫn nữ', 'Bản 3.0 mm'], ['Nhẫn nam', 'Bản 4.0 mm'], ['Hoàn thiện', 'Phay mờ satin, viền bóng gương']],
  },
  {
    id: 'SL-NC-04', slug: 'nhan-cuoi-twin-light', name: 'Twin Light', subtitle: 'Cặp nhẫn cưới hai tông vàng hồng & trắng',
    category: 'nhan-cuoi', type: 'cap-nhan-cuoi', price: 18600000, images: ['band-twin-light', 'life-wedding-hands'],
    moods: ['hien-dai', 'ngot-ngao'], collection: 'hand-in-hand', metals: ['vang-hong-18k', 'vang-trang-18k'], sizing: 'pair', engravable: true,
    rating: 4.8, reviews: 64, sold: 233, createdAt: '2025-09-09', leadTime: MADE,
    description: 'Hai sắc vàng — hồng ấm áp và trắng thanh khiết — giao hòa trên từng chiếc nhẫn như hai tâm hồn bổ khuyết cho nhau. Nhẫn nữ điểm một viên kim cương nhỏ ở đường giao sắc.',
    details: [['Chất liệu', 'Vàng hồng 18K phối vàng trắng 18K'], ['Nhẫn nữ', 'Bản 2.5 mm · 1 viên kim cương 0.02ct'], ['Nhẫn nam', 'Bản 4.5 mm']],
  },
  {
    id: 'SL-NC-05', slug: 'nhan-cuoi-promesse-blanche', name: 'Promesse Blanche', subtitle: 'Cặp nhẫn cưới bạch kim vát cạnh',
    category: 'nhan-cuoi', type: 'cap-nhan-cuoi', price: 24900000, images: ['band-white-roses', 'life-heart-shadow'],
    moods: ['hien-dai', 'thanh-lich'], collection: 'eternal-grace', metals: ['bach-kim', 'vang-trang-18k'], sizing: 'pair', engravable: true,
    rating: 4.9, reviews: 58, sold: 190, createdAt: '2025-11-11', leadTime: MADE,
    description: 'Bạch kim PT950 tinh khiết, không phai màu theo thời gian — như lời hứa trắng ngần không đổi. Các cạnh vát kim cương bắt sáng tạo vẻ hiện đại, nam tính mà vẫn thanh lịch.',
    details: [['Chất liệu', 'Bạch kim PT950 / Vàng trắng 18K'], ['Nhẫn nữ', 'Bản 3.0 mm'], ['Nhẫn nam', 'Bản 5.0 mm'], ['Hoàn thiện', 'Vát cạnh, bóng gương']],
  },
  {
    id: 'SL-NC-06', slug: 'nhan-cuoi-nuit-doree-pave', name: 'Nuit Dorée Pavé', subtitle: 'Cặp nhẫn cưới pavé kim cương',
    category: 'nhan-cuoi', type: 'cap-nhan-cuoi', price: 27800000, images: ['band-noir-stack', 'life-bouquet-hands'],
    moods: ['quyen-ru', 'dai-cac'], collection: 'starlit-vow', metals: GOLD, sizing: 'pair', engravable: true,
    badges: ['new'], rating: 4.9, reviews: 21, sold: 70, createdAt: '2026-09-28', leadTime: MADE,
    description: '“Đêm vàng” — nhẫn nữ đính pavé kim cương nửa vòng lấp lánh như dải ngân hà, nhẫn nam trơn mạnh mẽ với rãnh khắc mảnh. Một cặp nhẫn dành cho những lễ cưới buổi tối lộng lẫy.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Nhẫn nữ', 'Bản 2.4 mm · 15 viên kim cương tổng 0.22ct'], ['Nhẫn nam', 'Bản 4.5 mm']],
  },
  {
    id: 'SL-NC-07', slug: 'nhan-cuoi-love-letter', name: 'Love Letter', subtitle: 'Cặp nhẫn cưới khắc lời thề',
    category: 'nhan-cuoi', type: 'cap-nhan-cuoi', price: 13900000, images: ['band-dictionary', 'band-paper'],
    moods: ['ngot-ngao', 'thanh-lich'], collection: 'ma-cherie', metals: GOLD, sizing: 'pair', engravable: true,
    rating: 4.9, reviews: 175, sold: 640, createdAt: '2025-02-14', leadTime: MADE,
    description: 'Mặt trong mỗi nhẫn được khắc laser lời thề của riêng hai bạn bằng nét chữ viết tay — gửi gắm như một lá thư tình chỉ hai người cùng đọc. Miễn phí khắc tối đa 30 ký tự mỗi nhẫn.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Nhẫn nữ', 'Bản 2.5 mm'], ['Nhẫn nam', 'Bản 3.5 mm'], ['Khắc chữ', 'Laser, tối đa 30 ký tự/nhẫn']],
  },
  {
    id: 'SL-NC-08', slug: 'bo-nhan-co-dau-bridal-rose', name: 'Bridal Rosé Set', subtitle: 'Bộ nhẫn cô dâu (nhẫn cầu hôn + nhẫn cưới)',
    category: 'nhan-cuoi', type: 'bo-nhan-cuoi', price: 39600000, images: ['band-bridal-roses', 'life-pearl-bride'],
    style: 'solitaire', shape: 'round', moods: ['ngot-ngao', 'dai-cac'], collection: 'lotus-bloom', metals: WHITE, sizing: 'ring', engravable: true,
    rating: 4.8, reviews: 46, sold: 120, createdAt: '2025-10-25', leadTime: MADE,
    description: 'Bộ đôi nhẫn cầu hôn solitaire và nhẫn cưới đính đá được thiết kế khớp nhau tuyệt đối — tiết kiệm hơn khi mua lẻ, đồng bộ hoàn hảo trên ngón áp út.',
    details: [['Chất liệu', 'Vàng trắng 18K / Bạch kim PT950'], ['Nhẫn cầu hôn', 'Kim cương 0.3ct · G · VS2 · GIA'], ['Nhẫn cưới', '9 viên kim cương tổng 0.1ct'], ['Ưu đãi', 'Tiết kiệm 8% so với mua lẻ']],
  },
  {
    id: 'SL-NC-09', slug: 'bo-nhan-eternity-stack', name: 'Eternity Stack', subtitle: 'Bộ 3 nhẫn xếp tầng kim cương',
    category: 'nhan-cuoi', type: 'bo-nhan-cuoi', price: 46800000, images: ['band-eternity-stack', 'ed-hands-white'],
    moods: ['dai-cac', 'hien-dai'], collection: 'eternal-grace', metals: GOLD, sizing: 'ring', engravable: false,
    badges: ['limited'], rating: 4.9, reviews: 18, sold: 39, createdAt: '2026-06-06', leadTime: MADE,
    description: 'Ba chiếc nhẫn — đính cụm, pavé và bezel — có thể đeo riêng hay xếp tầng thành một tác phẩm. Phiên bản giới hạn cho những cô dâu muốn tự sáng tạo phong cách của mình.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Đá', 'Kim cương thiên nhiên · tổng 0.65ct'], ['Bộ gồm', '3 nhẫn có thể đeo riêng']],
  },

  // ───────────────────────── TRANG SỨC ─────────────────────────
  {
    id: 'SL-DC-01', slug: 'day-chuyen-halo-cushion', name: 'Halo Cushion Pendant', subtitle: 'Dây chuyền mặt kim cương cushion halo',
    category: 'trang-suc', type: 'day-chuyen', price: 32600000, images: ['neck-cushion-halo', 'neck-cushion-halo-2', 'life-neck-solitaire'],
    shape: 'cushion', moods: ['thanh-lich', 'dai-cac'], collection: 'starlit-vow', metals: WHITE,
    badges: ['bestseller'], rating: 4.9, reviews: 92, sold: 301, createdAt: '2025-09-01', leadTime: READY,
    description: 'Mặt dây cushion halo kép với viên chủ 0.4ct, treo trên dây box chain mảnh có thể điều chỉnh 40–45 cm. Món trang sức “đeo cả đời” dành tặng người thương trong những dịp ý nghĩa nhất.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Viên chủ', 'Kim cương thiên nhiên 0.4ct'], ['Đá tấm', '32 viên · tổng 0.25ct'], ['Dây', 'Box chain 40–45 cm']],
  },
  {
    id: 'SL-DC-02', slug: 'day-chuyen-larme-de-lune', name: 'Larme de Lune', subtitle: 'Dây chuyền kim cương giọt lệ 0.5ct',
    category: 'trang-suc', type: 'day-chuyen', price: 28900000, images: ['neck-pear-leaf', 'ed-off-shoulder'],
    shape: 'pear', moods: ['quyen-ru', 'thanh-lich'], collection: 'eternal-grace', metals: WHITE,
    rating: 4.8, reviews: 37, sold: 98, createdAt: '2026-04-04', leadTime: READY,
    description: '“Giọt lệ của trăng” — viên kim cương giọt lệ 0.5ct trong viền halo, khẽ đung đưa theo từng chuyển động. Đẹp nhất khi đeo cùng cổ áo trễ vai hay đầm dạ tiệc.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Viên chủ', 'Kim cương thiên nhiên 0.5ct · Pear'], ['Dây', '42 cm, khóa an toàn']],
  },
  {
    id: 'SL-DC-03', slug: 'day-chuyen-coeur-pave', name: 'Cœur Pavé', subtitle: 'Dây chuyền trái tim pavé kim cương',
    category: 'trang-suc', type: 'day-chuyen', price: 15800000, images: ['neck-open-heart', 'life-layered'],
    shape: 'heart', moods: ['ngot-ngao'], collection: 'ma-cherie', metals: WHITE,
    badges: ['bestseller'], rating: 4.9, reviews: 211, sold: 870, createdAt: '2025-02-01', leadTime: READY,
    description: 'Trái tim rỗng đính pavé 28 viên kim cương — biểu tượng tình yêu rộng mở và chân thành. Món quà được chọn nhiều nhất cho ngày Valentine, 8/3 và kỷ niệm ngày cưới.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Đá', '28 viên kim cương · tổng 0.18ct'], ['Dây', 'Rolo chain 40–45 cm']],
  },
  {
    id: 'SL-DC-04', slug: 'day-chuyen-golden-drop', name: 'Golden Drop Pendant', subtitle: 'Dây chuyền vàng giọt nước đính kim cương',
    category: 'trang-suc', type: 'day-chuyen', price: 24500000, images: ['neck-golden-drop', 'neck-golden-drop-2'],
    moods: ['dai-cac', 'thanh-lich'], collection: 'lotus-bloom', metals: ['vang-vang-18k'],
    rating: 4.7, reviews: 29, sold: 85, createdAt: '2025-12-20', leadTime: READY,
    description: 'Giọt nước vàng 18K uốn cong mềm mại, lòng giọt khảm kim cương champagne lấp lánh như ánh nắng chiều. Kết hợp cùng bông tai Golden Drop để thành một bộ hoàn chỉnh.',
    details: [['Chất liệu', 'Vàng vàng 18K'], ['Đá', 'Kim cương champagne · tổng 0.32ct'], ['Dây', 'Snake chain 45 cm']],
  },
  {
    id: 'SL-DC-05', slug: 'day-chuyen-baguette-bar', name: 'Baguette Bar', subtitle: 'Dây chuyền mặt kim cương baguette',
    category: 'trang-suc', type: 'day-chuyen', price: 19900000, images: ['neck-baguette-bar', 'ed-necklace-light'],
    shape: 'emerald', moods: ['hien-dai'], collection: 'petite-lumiere', metals: GOLD,
    badges: ['new'], rating: 4.8, reviews: 16, sold: 47, createdAt: '2026-10-12', leadTime: READY,
    description: 'Mặt dây chữ nhật xếp 10 viên kim cương baguette — tối giản, hình học và rất “thành thị”. Đeo riêng thanh lịch, xếp tầng cùng dây xích mảnh càng cá tính.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Đá', '10 viên kim cương baguette · tổng 0.3ct'], ['Dây', 'Cable chain 42 cm']],
  },
  {
    id: 'SL-DC-06', slug: 'day-chuyen-perle-de-soie', name: 'Perle de Soie', subtitle: 'Dây chuyền ngọc trai Akoya',
    category: 'trang-suc', type: 'day-chuyen', price: 9800000, images: ['neck-pearl-pendant', 'ed-off-shoulder'],
    moods: ['thanh-lich', 'ngot-ngao'], collection: 'silk-veil', metals: ['vang-vang-18k', 'vang-trang-18k'],
    rating: 4.8, reviews: 73, sold: 260, createdAt: '2025-07-07', leadTime: READY,
    description: 'Một viên ngọc trai Akoya 8mm ánh hồng, lơ lửng trong khung vàng giọt nước. Vẻ đẹp nhẹ như lụa, hợp cả áo sơ mi công sở lẫn váy cưới.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Ngọc trai', 'Akoya 8.0–8.5 mm, ánh hồng'], ['Dây', '45 cm']],
  },
  {
    id: 'SL-DC-07', slug: 'chuoi-ngoc-trai-perle-classique', name: 'Perle Classique', subtitle: 'Chuỗi ngọc trai Akoya 7.5mm',
    category: 'trang-suc', type: 'day-chuyen', price: 36500000, images: ['neck-pearl-strand', 'life-pearl-bride'],
    moods: ['dai-cac', 'thanh-lich'], collection: 'eternal-grace', metals: ['vang-trang-18k', 'vang-vang-18k'],
    rating: 4.9, reviews: 34, sold: 80, createdAt: '2025-11-02', leadTime: READY,
    description: 'Chuỗi 56 viên ngọc trai Akoya được tuyển chọn đồng đều về kích thước và độ ánh, xâu thắt nút lụa thủ công giữa từng viên. Món trang sức gia truyền của mọi quý cô.',
    details: [['Ngọc trai', 'Akoya 7.0–7.5 mm · 56 viên'], ['Độ ánh', 'AAA'], ['Khóa', 'Vàng 18K đính kim cương'], ['Chiều dài', '42 cm']],
  },
  {
    id: 'SL-BT-01', slug: 'bong-tai-halo-brilliance', name: 'Halo Brilliance Studs', subtitle: 'Bông tai kim cương halo',
    category: 'trang-suc', type: 'bong-tai', price: 26400000, images: ['ear-halo-studs', 'ear-halo-studs-2'],
    shape: 'round', moods: ['thanh-lich'], collection: 'starlit-vow', metals: WHITE,
    badges: ['bestseller'], rating: 4.9, reviews: 128, sold: 377, createdAt: '2025-05-05', leadTime: READY,
    description: 'Mỗi bông tai là một viên kim cương 0.2ct trong vòng halo 16 viên — từ xa trông như viên đá 0.5ct. Khóa vặn an toàn, phù hợp đeo hằng ngày.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Viên chủ', '2 × 0.2ct · G · VS2'], ['Đá tấm', '32 viên · tổng 0.16ct'], ['Khóa', 'Chốt vặn']],
  },
  {
    id: 'SL-BT-02', slug: 'bong-tai-fleur-de-diamant', name: 'Fleur de Diamant', subtitle: 'Bông tai hoa kim cương vàng hồng',
    category: 'trang-suc', type: 'bong-tai', price: 17600000, images: ['ear-fleur', 'ed-hands-shirt'],
    moods: ['ngot-ngao'], collection: 'lotus-bloom', metals: ROSE,
    rating: 4.8, reviews: 55, sold: 190, createdAt: '2025-08-18', leadTime: READY,
    description: 'Sáu cánh hoa vàng hồng ôm lấy nhụy kim cương — đóa hoa nhỏ xinh nở trên dái tai. Món quà sinh nhật được yêu thích nhất của Solène.',
    details: [['Chất liệu', 'Vàng hồng 18K'], ['Đá', '14 viên kim cương · tổng 0.2ct'], ['Kích thước', 'Đường kính 8 mm']],
  },
  {
    id: 'SL-BT-03', slug: 'bong-tai-torsade-hoops', name: 'Torsade Hoops', subtitle: 'Bông tai vòng xoắn vàng 18K',
    category: 'trang-suc', type: 'bong-tai', price: 12800000, images: ['ear-torsade-hoops', 'ed-white-shirt'],
    moods: ['hien-dai'], collection: 'petite-lumiere', metals: ['vang-vang-18k'],
    badges: ['new'], rating: 4.7, reviews: 23, sold: 66, createdAt: '2026-10-20', leadTime: READY,
    description: 'Vòng xoắn torsade bằng vàng 18K nguyên khối, đúc rỗng giúp nhẹ tai. Đường xoắn bắt sáng theo từng nghiêng đầu — điểm nhấn hiện đại cho mọi trang phục.',
    details: [['Chất liệu', 'Vàng vàng 18K'], ['Kích thước', 'Đường kính 22 mm'], ['Trọng lượng', '≈ 3.2 g/đôi']],
  },
  {
    id: 'SL-BT-04', slug: 'bong-tai-golden-drop', name: 'Golden Drop Earrings', subtitle: 'Bông tai vàng giọt nước đính kim cương',
    category: 'trang-suc', type: 'bong-tai', price: 21900000, images: ['ear-golden-drop', 'ear-golden-drop-2'],
    moods: ['dai-cac'], collection: 'lotus-bloom', metals: ['vang-vang-18k'],
    rating: 4.8, reviews: 26, sold: 72, createdAt: '2025-12-20', leadTime: READY,
    description: 'Đôi giọt nước vàng 18K lòng khảm kim cương champagne, móc tai kiểu Pháp thanh mảnh. Bộ đôi hoàn hảo cùng dây chuyền Golden Drop Pendant.',
    details: [['Chất liệu', 'Vàng vàng 18K'], ['Đá', 'Kim cương champagne · tổng 0.46ct'], ['Kiểu móc', 'Móc Pháp (lever-back)']],
  },
  {
    id: 'SL-BT-05', slug: 'bong-tai-perle-doree', name: 'Perle Dorée', subtitle: 'Bông tai ngọc trai Nam Dương',
    category: 'trang-suc', type: 'bong-tai', price: 11500000, images: ['ear-perle-doree', 'life-pearl-earring'],
    moods: ['thanh-lich', 'ngot-ngao'], collection: 'silk-veil', metals: ['vang-vang-18k'],
    rating: 4.8, reviews: 49, sold: 158, createdAt: '2025-06-26', leadTime: READY,
    description: 'Viên ngọc trai Nam Dương 10mm ánh vàng kim, ôm trong khung vàng chạm như vỏ sò. Sang trọng kín đáo, hợp với tóc búi và áo cổ thuyền.',
    details: [['Chất liệu', 'Vàng vàng 18K'], ['Ngọc trai', 'South Sea 10 mm'], ['Khóa', 'Chốt bấm']],
  },
  {
    id: 'SL-BT-06', slug: 'bong-tai-marguerite', name: 'Marguerite', subtitle: 'Bông tai hoa cúc kim cương',
    category: 'trang-suc', type: 'bong-tai', price: 23800000, images: ['ear-marguerite', 'ed-gold-stilllife'],
    moods: ['ngot-ngao', 'dai-cac'], collection: 'lotus-bloom', metals: ['vang-vang-18k', 'vang-trang-18k'],
    rating: 4.9, reviews: 31, sold: 83, createdAt: '2026-04-18', leadTime: READY,
    description: 'Những cánh cúc họa mi vàng chải xước, nhụy hoa là cụm kim cương tròn. Thiết kế thủ công tỉ mỉ đến từng đường gân cánh hoa.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Đá', '18 viên kim cương · tổng 0.24ct'], ['Kích thước', 'Đường kính 14 mm']],
  },
  {
    id: 'SL-LT-01', slug: 'lac-tay-chaine-doree', name: 'Chaîne Dorée', subtitle: 'Lắc tay xích vàng 18K',
    category: 'trang-suc', type: 'lac-tay', price: 18500000, images: ['brace-chain', 'life-bracelet'],
    moods: ['hien-dai'], collection: 'petite-lumiere', metals: ['vang-vang-18k'],
    rating: 4.8, reviews: 40, sold: 133, createdAt: '2025-09-24', leadTime: READY,
    description: 'Mắt xích oval đan nối bằng tay, khóa bấm chữ T đầy cá tính. Một món trang sức “xương sống” trong tủ đồ của người phụ nữ hiện đại.',
    details: [['Chất liệu', 'Vàng vàng 18K'], ['Chiều dài', '17 cm + 2 cm nối'], ['Trọng lượng', '≈ 6.5 g']],
  },
  {
    id: 'SL-LT-02', slug: 'lac-tay-rose-pave', name: 'Rosé Pavé Bracelet', subtitle: 'Lắc tay pavé kim cương vàng hồng',
    category: 'trang-suc', type: 'lac-tay', price: 42600000, images: ['brace-rose-pave', 'ed-hands-white'],
    moods: ['quyen-ru', 'dai-cac'], collection: 'ma-cherie', metals: ROSE,
    rating: 4.9, reviews: 21, sold: 49, createdAt: '2026-01-30', leadTime: READY,
    description: 'Họa tiết sóng lụa đan xen, đính pavé gần 100 viên kim cương trên nền vàng hồng 18K. Lấp lánh dịu dàng trên cổ tay mỗi khi bạn cử động.',
    details: [['Chất liệu', 'Vàng hồng 18K'], ['Đá', '96 viên kim cương · tổng 0.85ct'], ['Chiều dài', '17 cm']],
  },
  {
    id: 'SL-LT-03', slug: 'lac-tay-medaillon-etoile', name: 'Médaillon Étoile', subtitle: 'Lắc tay mặt medallion kim cương',
    category: 'trang-suc', type: 'lac-tay', price: 14200000, images: ['brace-medallion', 'ed-hands-shirt'],
    moods: ['ngot-ngao'], collection: 'petite-lumiere', metals: ROSE,
    badges: ['bestseller'], rating: 4.8, reviews: 88, sold: 302, createdAt: '2025-03-15', leadTime: READY,
    description: 'Mặt medallion tròn đính kim cương như vì sao nhỏ, hai dây xích mảnh đan song song. Có thể khắc tên viết tắt ở mặt sau.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Đá', '19 viên kim cương · tổng 0.1ct'], ['Chiều dài', '16–18 cm (điều chỉnh)']],
  },
  {
    id: 'SL-LT-04', slug: 'lac-tay-petite-charms', name: 'Petite Charms', subtitle: 'Lắc tay charm vàng 18K',
    category: 'trang-suc', type: 'lac-tay', price: 8900000, images: ['brace-charms', 'ed-hands-shirt'],
    moods: ['ngot-ngao', 'hien-dai'], collection: 'petite-lumiere', metals: ['vang-vang-18k'],
    badges: ['new'], rating: 4.7, reviews: 15, sold: 61, createdAt: '2026-10-28', leadTime: READY,
    description: 'Dây xích mảnh điểm những charm ngôi sao, mặt trăng và giọt nước nhỏ xíu — kể câu chuyện riêng của bạn. Mảnh mai, dễ phối, hợp làm quà tặng.',
    details: [['Chất liệu', 'Vàng vàng 18K'], ['Chiều dài', '16 cm + 2 cm nối'], ['Charm', '5 charm cố định']],
  },
  {
    id: 'SL-LT-05', slug: 'vong-tay-ngoc-trai-perle', name: 'Perle Bracelet', subtitle: 'Vòng tay & bông tai ngọc trai',
    category: 'trang-suc', type: 'lac-tay', price: 12600000, images: ['brace-pearl', 'life-pearl-earring'],
    moods: ['thanh-lich'], collection: 'silk-veil', metals: ['vang-vang-18k'],
    rating: 4.7, reviews: 20, sold: 58, createdAt: '2025-10-10', leadTime: READY,
    description: 'Bộ quà tặng gồm vòng tay ngọc trai Akoya 7mm và đôi bông tai cùng tông, đựng trong hộp nhung Solène. Món quà trọn vẹn cho mẹ, cho vợ, cho chính mình.',
    details: [['Ngọc trai', 'Akoya 6.5–7.0 mm'], ['Khóa', 'Vàng 18K'], ['Bộ gồm', 'Vòng tay + bông tai']],
  },

  // ───────────────────────── TRANG SỨC CAO CẤP ─────────────────────────
  {
    id: 'SL-HJ-01', slug: 'trang-suc-cao-cap-emeraude-imperiale', name: 'Émeraude Impériale', subtitle: 'Kiềng ngọc lục bảo & kim cương',
    category: 'trang-suc-cao-cap', type: 'bo-trang-suc', price: 1280000000, images: ['hj-emerald-set', 'ed-jeweler-loupe'],
    moods: ['dai-cac', 'quyen-ru'], collection: 'eternal-grace', metals: ['vang-trang-18k'],
    badges: ['limited'], rating: 5, reviews: 6, sold: 3, createdAt: '2026-07-01', leadTime: 'Tác phẩm độc bản · xem trực tiếp tại showroom',
    description: 'Tác phẩm độc bản với 23 viên ngọc lục bảo Colombia cắt giọt lệ và oval, đan xen hơn 300 viên kim cương. 640 giờ chế tác của 4 nghệ nhân bậc thầy tại xưởng Solène.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Ngọc lục bảo', 'Colombia · tổng 18.6ct'], ['Kim cương', '312 viên · tổng 11.2ct'], ['Chứng nhận', 'GRS · GIA'], ['Thời gian chế tác', '640 giờ']],
  },
  {
    id: 'SL-HJ-02', slug: 'trang-suc-cao-cap-saphir-royal', name: 'Saphir Royal', subtitle: 'Bộ lắc tay & bông tai sapphire hoàng gia',
    category: 'trang-suc-cao-cap', type: 'bo-trang-suc', price: 865000000, images: ['hj-sapphire-set', 'hj-sapphire-2'],
    moods: ['dai-cac'], collection: 'eternal-grace', metals: ['vang-trang-18k'],
    rating: 5, reviews: 4, sold: 2, createdAt: '2026-06-15', leadTime: 'Tác phẩm độc bản · xem trực tiếp tại showroom',
    description: 'Sapphire xanh hoàng gia từ Sri Lanka với sắc lam nhung hiếm có, viền kim cương tròn và baguette. Bộ trang sức dành cho những dịp trọng đại nhất.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Sapphire', 'Sri Lanka · tổng 9.4ct'], ['Kim cương', '186 viên · tổng 6.1ct'], ['Chứng nhận', 'GRS · GIA']],
  },
  {
    id: 'SL-HJ-03', slug: 'trang-suc-cao-cap-cascade-de-lumiere', name: 'Cascade de Lumière', subtitle: 'Bông tai chùm kim cương',
    category: 'trang-suc-cao-cap', type: 'bong-tai', price: 468000000, images: ['hj-cascade-earrings', 'ed-setting-stone'],
    shape: 'pear', moods: ['quyen-ru', 'dai-cac'], collection: 'eternal-grace', metals: ['vang-trang-18k'],
    rating: 5, reviews: 9, sold: 7, createdAt: '2026-05-20', leadTime: 'Đặt trước · giao trong 21 ngày',
    description: '“Thác ánh sáng” — những tầng kim cương giọt lệ và marquise buông dài như thác nước, chuyển động mềm mại theo từng bước đi. Tuyệt tác cho thảm đỏ và lễ cưới.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Kim cương', '142 viên · tổng 7.8ct'], ['Chiều dài', '62 mm'], ['Chứng nhận', 'GIA (viên chủ)']],
  },
  {
    id: 'SL-HJ-04', slug: 'trang-suc-cao-cap-soleil-dor', name: "Soleil d'Or", subtitle: 'Bộ trang sức kim cương vàng Fancy',
    category: 'trang-suc-cao-cap', type: 'bo-trang-suc', price: 1650000000, images: ['hj-soleil-set', 'ed-workbench'],
    moods: ['dai-cac', 'quyen-ru'], collection: 'eternal-grace', metals: ['vang-trang-18k', 'vang-vang-18k'],
    badges: ['limited'], rating: 5, reviews: 3, sold: 1, createdAt: '2026-08-08', leadTime: 'Tác phẩm độc bản · xem trực tiếp tại showroom',
    description: 'Viên kim cương Fancy Intense Yellow 5.02ct ngự giữa vòng cổ hoa kim cương trắng, kèm đôi bông tai cùng tông. “Mặt trời vàng” của bộ sưu tập Eternal Grace.',
    details: [['Viên chủ', 'Kim cương Fancy Intense Yellow 5.02ct'], ['Kim cương trắng', '228 viên · tổng 14.5ct'], ['Bộ gồm', 'Vòng cổ + bông tai'], ['Chứng nhận', 'GIA']],
  },
  {
    id: 'SL-HJ-05', slug: 'trang-suc-cao-cap-riviere-eternelle', name: 'Rivière Éternelle', subtitle: 'Lắc tay kim cương Rivière',
    category: 'trang-suc-cao-cap', type: 'lac-tay', price: 528000000, images: ['hj-riviere-bracelet', 'ed-setting-stone'],
    shape: 'round', moods: ['dai-cac'], collection: 'eternal-grace', metals: ['vang-trang-18k', 'bach-kim'],
    rating: 5, reviews: 7, sold: 5, createdAt: '2026-03-21', leadTime: 'Đặt trước · giao trong 21 ngày',
    description: 'Dòng sông kim cương với những mắt oval đính viên chủ xen kẽ pavé — mỗi mắt xích được khớp nối thủ công để lắc tay buông mềm như lụa trên cổ tay.',
    details: [['Chất liệu', 'Vàng trắng 18K / Bạch kim'], ['Kim cương', '84 viên · tổng 9.6ct'], ['Chiều dài', '17.5 cm']],
  },
  {
    id: 'SL-HJ-06', slug: 'trang-suc-cao-cap-feuille-de-diamant', name: 'Feuille de Diamant', subtitle: 'Bông tai lá nguyệt quế kim cương marquise',
    category: 'trang-suc-cao-cap', type: 'bong-tai', price: 312000000, images: ['hj-feuille-earrings', 'ed-jeweler-loupe'],
    moods: ['dai-cac', 'thanh-lich'], collection: 'eternal-grace', metals: ['vang-trang-18k'],
    rating: 5, reviews: 5, sold: 6, createdAt: '2026-02-02', leadTime: 'Đặt trước · giao trong 21 ngày',
    description: 'Vòng nguyệt quế bằng kim cương marquise ôm theo vành tai — biểu tượng của vinh quang và chiến thắng. Thiết kế ear-climber độc đáo, đeo lên là một tác phẩm điêu khắc.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Kim cương', 'Marquise & tròn · tổng 4.2ct'], ['Kiểu dáng', 'Ear-climber']],
  },

  // ───────────────────────── PHỤ KIỆN ─────────────────────────
  {
    id: 'SL-PK-01', slug: 'khuy-mang-set-mat-ho', name: "Khuy măng sét Tiger's Eye", subtitle: 'Khuy măng sét đá mắt hổ vàng 18K',
    category: 'phu-kien', type: 'khuy-mang-set', price: 12400000, images: ['acc-cufflinks-gold', 'life-cufflinks'],
    moods: ['dai-cac'], metals: ['vang-vang-18k'],
    rating: 4.8, reviews: 26, sold: 90, createdAt: '2025-11-27', leadTime: READY,
    description: 'Đá mắt hổ nâu vàng ánh lụa trong khung vàng 18K vát cạnh — phụ kiện của quý ông lịch lãm cho lễ cưới, sự kiện và những bộ suit may đo.',
    details: [['Chất liệu', 'Vàng vàng 18K'], ['Đá', "Mắt hổ (Tiger's Eye) cabochon"], ['Kiểu chốt', 'Chốt xoay']],
  },
  {
    id: 'SL-PK-02', slug: 'khuy-mang-set-monogram', name: 'Khuy măng sét Monogram', subtitle: 'Khuy măng sét khắc tên viết tắt',
    category: 'phu-kien', type: 'khuy-mang-set', price: 9600000, images: ['acc-cufflinks-monogram', 'life-cuff-shirt'],
    moods: ['hien-dai', 'thanh-lich'], metals: ['vang-trang-18k', 'vang-vang-18k'], engravable: true,
    rating: 4.9, reviews: 34, sold: 120, createdAt: '2026-01-08', leadTime: 'Khắc & hoàn thiện trong 5–7 ngày',
    description: 'Mặt khuy vuông khắc monogram theo tên viết tắt của bạn — món quà cưới ý nghĩa cho chú rể và phù rể. Đi kèm hộp gỗ óc chó khắc tên.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Khắc', 'Monogram tối đa 3 ký tự'], ['Hộp', 'Gỗ óc chó']],
  },
  {
    id: 'SL-PK-03', slug: 'cai-ao-laurier', name: 'Cài áo Laurier', subtitle: 'Cài áo nguyệt quế kim cương',
    category: 'phu-kien', type: 'cai-ao', price: 18800000, images: ['acc-laurel-brooch', 'ed-blazer'],
    moods: ['dai-cac', 'thanh-lich'], collection: 'eternal-grace', metals: ['vang-trang-18k'],
    rating: 4.9, reviews: 17, sold: 44, createdAt: '2026-04-30', leadTime: READY,
    description: 'Vòng nguyệt quế kim cương marquise cài trên ve áo blazer hay khăn lụa — điểm nhấn quyền lực, thanh lịch cho cả nam và nữ.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Đá', 'Kim cương marquise & tròn · tổng 0.62ct'], ['Kích thước', '32 mm']],
  },
  {
    id: 'SL-PK-04', slug: 'cai-ao-rubis-perle', name: 'Cài áo Rubis Perle', subtitle: 'Cài áo hồng ngọc & ngọc trai',
    category: 'phu-kien', type: 'cai-ao', price: 16500000, images: ['acc-ruby-brooch', 'life-pearl-bride'],
    moods: ['quyen-ru'], metals: ['vang-trang-18k'],
    rating: 4.7, reviews: 12, sold: 30, createdAt: '2025-12-02', leadTime: READY,
    description: 'Giọt hồng ngọc viền đá đỏ rực rỡ, điểm xuyết viên ngọc trai trắng tinh — có thể dùng như cài áo hoặc mặt dây chuyền.',
    details: [['Chất liệu', 'Vàng trắng 18K'], ['Đá chủ', 'Hồng ngọc (ruby) giọt lệ'], ['Ngọc trai', 'Nước ngọt 9 mm']],
  },
  {
    id: 'SL-PK-05', slug: 'nhan-nam-signet-heritage', name: 'Signet Héritage', subtitle: 'Nhẫn nam signet vàng 18K',
    category: 'phu-kien', type: 'nhan-nam', price: 22800000, images: ['acc-signet', 'life-cufflinks'],
    moods: ['dai-cac'], metals: ['vang-vang-18k', 'vang-trang-18k'], sizing: 'ring', engravable: true,
    rating: 4.8, reviews: 19, sold: 57, createdAt: '2025-10-19', leadTime: MADE,
    description: 'Nhẫn signet chạm nổi họa tiết gia huy cổ điển, vai nhẫn khắc hoa văn thủ công. Có thể đặt khắc chữ cái hoặc biểu tượng riêng trên mặt nhẫn.',
    details: [['Chất liệu', 'Vàng 18K (Au750)'], ['Trọng lượng', '≈ 9.5 g'], ['Mặt nhẫn', '14 × 12 mm']],
  },
  {
    id: 'SL-PK-06', slug: 'hop-trang-suc-coffret', name: 'Hộp trang sức Coffret', subtitle: 'Hộp trang sức da 3 tầng',
    category: 'phu-kien', type: 'hop-trang-suc', price: 4900000, images: ['acc-jewelry-box', 'ed-gold-stilllife'],
    moods: ['thanh-lich'], metals: [],
    rating: 4.8, reviews: 42, sold: 160, createdAt: '2025-08-08', leadTime: READY,
    description: 'Hộp da bê trần chần trám, lót nhung 3 tầng với ngăn nhẫn, khay bông tai và móc dây chuyền chống rối. Bảo quản trang sức đúng cách — và đẹp như một món nội thất.',
    details: [['Chất liệu', 'Da bê, lót nhung'], ['Kích thước', '24 × 17 × 15 cm'], ['Ngăn', '3 tầng, có khóa']],
  },
  {
    id: 'SL-PK-07', slug: 'hop-nhan-du-lich-ecrin', name: 'Hộp nhẫn du lịch Écrin', subtitle: 'Hộp đựng nhẫn & bông tai mini',
    category: 'phu-kien', type: 'hop-trang-suc', price: 1850000, images: ['acc-ring-case', 'band-paper'],
    moods: ['ngot-ngao'], metals: [],
    rating: 4.7, reviews: 63, sold: 280, createdAt: '2025-06-01', leadTime: READY,
    description: 'Hộp tròn khóa kéo nhỏ gọn bọc da mềm, lót nhung với khe nhẫn và khay bông tai. Người bạn đồng hành cho trang sức của bạn trong mọi chuyến đi.',
    details: [['Chất liệu', 'Da PU cao cấp, lót nhung'], ['Kích thước', 'Đường kính 10 cm'], ['Màu', 'Kem ngà']],
  },

  // ───────────────────────── KIM CƯƠNG VIÊN ─────────────────────────
  {
    id: 'SL-KC-01', slug: 'kim-cuong-vien-gia-4-5-ly', name: 'Kim cương GIA 4.5 ly', subtitle: 'Kim cương viên tròn 0.33ct',
    category: 'kim-cuong', type: 'kim-cuong-vien', price: 23900000, images: ['dia-single', 'dia-row'],
    shape: 'round', moods: ['thanh-lich'], metals: [],
    variants: { label: 'Nước màu · Độ tinh khiết', options: [{ value: 'f-vs1', label: 'F · VS1', price: 23900000 }, { value: 'e-vvs2', label: 'E · VVS2', price: 27800000 }, { value: 'd-vvs1', label: 'D · VVS1', price: 32500000 }] },
    badges: ['bestseller'], rating: 4.9, reviews: 64, sold: 240, createdAt: '2025-01-10', leadTime: READY,
    description: 'Kim cương thiên nhiên giác cắt Round Brilliant, kích thước 4.5 ly (≈ 0.33ct), kiểm định GIA đầy đủ và khắc laser mã số trên gờ viên. Phù hợp làm viên chủ nhẫn nữ thanh mảnh hoặc mặt dây chuyền.',
    details: [['Kích thước', '4.5 ly (≈ 0.33ct)'], ['Giác cắt · Đánh bóng · Đối xứng', 'Excellent · Excellent · Excellent'], ['Phát quang', 'None'], ['Chứng nhận', 'GIA, khắc laser trên gờ']],
  },
  {
    id: 'SL-KC-02', slug: 'kim-cuong-vien-gia-5-4-ly', name: 'Kim cương GIA 5.4 ly', subtitle: 'Kim cương viên tròn 0.60ct',
    category: 'kim-cuong', type: 'kim-cuong-vien', price: 74900000, images: ['dia-tweezers', 'dia-two'],
    shape: 'round', moods: ['thanh-lich'], metals: [],
    variants: { label: 'Nước màu · Độ tinh khiết', options: [{ value: 'f-vs1', label: 'F · VS1', price: 74900000 }, { value: 'e-vvs2', label: 'E · VVS2', price: 86500000 }, { value: 'd-vvs1', label: 'D · VVS1', price: 98000000 }] },
    rating: 4.9, reviews: 41, sold: 132, createdAt: '2025-01-10', leadTime: READY,
    description: 'Kích thước 5.4 ly được yêu thích nhất cho nhẫn cầu hôn tại Việt Nam — đủ nổi bật mà vẫn thanh lịch trên tay. Kim cương thiên nhiên, 3EX, kiểm định GIA.',
    details: [['Kích thước', '5.4 ly (≈ 0.60ct)'], ['Giác cắt · Đánh bóng · Đối xứng', 'Excellent · Excellent · Excellent'], ['Phát quang', 'None'], ['Chứng nhận', 'GIA, khắc laser trên gờ']],
  },
  {
    id: 'SL-KC-03', slug: 'kim-cuong-vien-gia-6-3-ly', name: 'Kim cương GIA 6.3 ly', subtitle: 'Kim cương viên tròn 0.90ct',
    category: 'kim-cuong', type: 'kim-cuong-vien', price: 172000000, images: ['dia-two', 'dia-row'],
    shape: 'round', moods: ['dai-cac'], metals: [],
    variants: { label: 'Nước màu · Độ tinh khiết', options: [{ value: 'g-vs2', label: 'G · VS2', price: 172000000 }, { value: 'e-vs1', label: 'E · VS1', price: 219000000 }, { value: 'd-vvs1', label: 'D · VVS1', price: 268000000 }] },
    rating: 5, reviews: 18, sold: 46, createdAt: '2025-01-10', leadTime: READY,
    description: 'Viên 6.3 ly (≈ 0.90ct) mang lại độ phản quang mạnh mẽ, phù hợp làm viên chủ cho nhẫn solitaire và halo. Kiểm định GIA, chế độ thu đổi trọn đời tại Solène.',
    details: [['Kích thước', '6.3 ly (≈ 0.90ct)'], ['Giác cắt · Đánh bóng · Đối xứng', 'Excellent · Excellent · Excellent'], ['Phát quang', 'None'], ['Chứng nhận', 'GIA']],
  },
  {
    id: 'SL-KC-04', slug: 'kim-cuong-vien-gia-7-2-ly', name: 'Kim cương GIA 7.2 ly', subtitle: 'Kim cương viên tròn 1.35ct',
    category: 'kim-cuong', type: 'kim-cuong-vien', price: 389000000, images: ['dia-row', 'dia-tweezers'],
    shape: 'round', moods: ['dai-cac'], metals: [],
    variants: { label: 'Nước màu · Độ tinh khiết', options: [{ value: 'g-vs2', label: 'G · VS2', price: 389000000 }, { value: 'e-vs1', label: 'E · VS1', price: 486000000 }, { value: 'd-vvs1', label: 'D · VVS1', price: 598000000 }] },
    badges: ['limited'], rating: 5, reviews: 7, sold: 12, createdAt: '2025-01-10', leadTime: 'Xem trực tiếp tại showroom',
    description: 'Viên kim cương hơn 1 carat — cột mốc của sự sang trọng. Kích thước 7.2 ly, giác cắt 3EX, kiểm định GIA. Solène hỗ trợ xem đá trực tiếp dưới kính lúp chuyên dụng tại showroom.',
    details: [['Kích thước', '7.2 ly (≈ 1.35ct)'], ['Giác cắt · Đánh bóng · Đối xứng', 'Excellent · Excellent · Excellent'], ['Phát quang', 'None'], ['Chứng nhận', 'GIA']],
  },
  {
    id: 'SL-KC-05', slug: 'kim-cuong-fancy-shape-1ct', name: 'Kim cương Fancy 1.0ct', subtitle: 'Kim cương dáng đặc biệt GIA 1.0ct',
    category: 'kim-cuong', type: 'kim-cuong-vien', price: 145000000, images: ['dia-shapes', 'dia-shapes-grey'],
    shape: 'oval', moods: ['hien-dai', 'dai-cac'], metals: [],
    variants: { label: 'Dáng viên (F · VS1)', options: [{ value: 'princess', label: 'Princess', price: 145000000 }, { value: 'cushion', label: 'Cushion', price: 149000000 }, { value: 'pear', label: 'Pear', price: 159000000 }, { value: 'heart', label: 'Heart', price: 162000000 }, { value: 'oval', label: 'Oval', price: 168000000 }, { value: 'emerald', label: 'Emerald', price: 172000000 }] },
    badges: ['new'], rating: 4.9, reviews: 12, sold: 25, createdAt: '2026-09-01', leadTime: READY,
    description: 'Tuyển chọn kim cương 1.0ct dáng fancy: oval, pear, emerald, cushion, princess và heart — tất cả F · VS1, kiểm định GIA. Lựa chọn lý tưởng để thiết kế nhẫn cầu hôn mang dấu ấn riêng.',
    details: [['Trọng lượng', '1.0ct'], ['Nước màu · Độ tinh khiết', 'F · VS1'], ['Đánh bóng · Đối xứng', 'Excellent · Very Good+'], ['Chứng nhận', 'GIA']],
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const byCategory = (cat: CategoryKey) => PRODUCTS.filter((p) => p.category === cat);
export const byCollection = (slug: string) => PRODUCTS.filter((p) => p.collection === slug);
export const bestsellers = (n = 8) => [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, n);
export const newest = (n = 8) => [...PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, n);
