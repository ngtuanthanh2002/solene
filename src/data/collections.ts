export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  banner: string;
  image: string;
  season: string;
  intro: string;
  story: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'silk-veil', name: 'Silk Veil', tagline: 'Mềm mại như lụa, rạng rỡ như ngày cưới', season: 'Signature · 2026',
    banner: 'ed-satin-hand', image: 'ring-silk-solitaire',
    intro: 'Bộ sưu tập Signature của Solène — lấy cảm hứng từ tà voan lụa và ánh sáng buổi sớm trong ngày cưới.',
    story: [
      'Silk Veil bắt đầu từ một khoảnh khắc: tà voan cô dâu khẽ bay lên trong nắng sớm, để lộ ánh lấp lánh trên ngón áp út. Chúng tôi muốn giữ lại khoảnh khắc ấy trong kim loại quý.',
      'Mỗi thiết kế trong Silk Veil có đường cong mềm như nếp lụa, chấu nhẫn mảnh như cánh hoa và bề mặt đánh bóng nhiều lớp để ánh sáng “chảy” liền mạch từ thân nhẫn đến viên chủ.',
    ],
  },
  {
    slug: 'lotus-bloom', name: 'Lotus Bloom', tagline: 'Đóa sen vàng — thanh khiết giữa đời thường', season: 'Heritage · 2025',
    banner: 'ear-marguerite', image: 'ring-vintage-bloom',
    intro: 'Hoa sen, hoa cúc và những cánh hoa Á Đông được chạm khắc thủ công trên nền vàng 18K ấm áp.',
    story: [
      'Lotus Bloom là lời tri ân dành cho vẻ đẹp Á Đông: đóa sen vươn lên thanh khiết, cánh cúc họa mi mỏng manh, những đường chạm khắc gợi nhớ nghề kim hoàn truyền thống.',
      'Kim cương champagne và vàng 18K chải xước tạo nên bảng màu ấm áp, hoài cổ — những món trang sức để trao truyền qua nhiều thế hệ.',
    ],
  },
  {
    slug: 'starlit-vow', name: 'Starlit Vow', tagline: 'Lời thề dưới ngàn vì sao', season: 'Bridal · 2026',
    banner: 'life-ring-box', image: 'ring-cushion-halo',
    intro: 'Những thiết kế halo và pavé rực rỡ như bầu trời sao — dành cho lời cầu hôn đáng nhớ nhất đời.',
    story: [
      'Có những lời hứa chỉ có thể nói dưới bầu trời đầy sao. Starlit Vow tập hợp các thiết kế halo, pavé và twist với mật độ kim cương cao, để chiếc nhẫn lấp lánh ngay cả trong ánh nến dịu nhẹ.',
      'Từ viên cushion halo kép đến cặp nhẫn cưới pavé nửa vòng, Starlit Vow là bộ sưu tập của những khoảnh khắc “đồng ý” bừng sáng.',
    ],
  },
  {
    slug: 'petite-lumiere', name: 'Petite Lumière', tagline: 'Những tia sáng nhỏ cho mỗi ngày', season: 'Everyday · 2026',
    banner: 'ed-gold-stilllife', image: 'brace-charms',
    intro: 'Trang sức mảnh mai, dễ xếp tầng — để kim cương và vàng 18K đồng hành cùng bạn mỗi ngày.',
    story: [
      'Không phải khoảnh khắc nào cũng cần lộng lẫy. Petite Lumière dành cho những ngày thường: một chiếc nhẫn mảnh khi gõ phím, sợi lắc tay nhỏ khi nâng tách cà phê, đôi khuyên vàng khi bước vào cuộc họp.',
      'Thiết kế nhẹ, bền, dễ phối và được hoàn thiện kỹ lưỡng như mọi món trang sức cao cấp khác của Solène.',
    ],
  },
  {
    slug: 'hand-in-hand', name: 'Hand in Hand', tagline: 'Nắm tay nhau, đi hết cuộc đời', season: 'Wedding · 2025',
    banner: 'life-bouquet-hands', image: 'band-interlock',
    intro: 'Những cặp nhẫn cưới kinh điển với form comfort-fit, khắc chữ miễn phí — cho hành trình trọn đời.',
    story: [
      'Nhẫn cưới là món trang sức bạn đeo nhiều nhất trong đời. Vì vậy Hand in Hand được thiết kế để thoải mái tuyệt đối: lòng nhẫn bo tròn comfort-fit, trọng lượng cân bằng, bề mặt bền bỉ theo năm tháng.',
      'Mỗi cặp nhẫn được chế tác theo đúng ni tay của hai bạn và khắc miễn phí lời nhắn ở mặt trong — một bí mật chỉ hai người cùng giữ.',
    ],
  },
  {
    slug: 'eternal-grace', name: 'Eternal Grace', tagline: 'Vẻ đẹp vượt thời gian', season: 'Haute Joaillerie',
    banner: 'hj-emerald-set', image: 'hj-soleil-set',
    intro: 'Dòng trang sức cao cấp với đá quý hiếm và kim cương lớn — những tác phẩm độc bản của xưởng Solène.',
    story: [
      'Eternal Grace là nơi các nghệ nhân bậc thầy của Solène thử thách giới hạn tay nghề: hàng trăm giờ chế tác cho một tác phẩm, những viên ngọc lục bảo Colombia, sapphire Sri Lanka và kim cương fancy được tuyển chọn từ khắp thế giới.',
      'Mỗi tác phẩm đều có hồ sơ chế tác riêng, giấy chứng nhận đá quý quốc tế và chỉ được giới thiệu trong những buổi hẹn riêng tại showroom.',
    ],
  },
  {
    slug: 'ma-cherie', name: 'Ma Chérie', tagline: 'Gửi người thương yêu nhất', season: 'Romance · 2026',
    banner: 'life-heart-shadow', image: 'neck-open-heart',
    intro: 'Trái tim, giọt lệ và sắc hồng dịu dàng — những món quà nói thay lời yêu thương.',
    story: [
      '“Ma chérie” — người yêu dấu của tôi. Bộ sưu tập dành cho những lời yêu chưa kịp nói: chiếc nhẫn oval vàng hồng, mặt dây trái tim pavé, cặp nhẫn cưới khắc lời thề.',
      'Bảng màu hồng phấn, vàng hồng và kim cương trắng tạo nên vẻ ngọt ngào nhưng không kém phần sang trọng.',
    ],
  },
];

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
