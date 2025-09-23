export const orderList = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    orderDate: '2024-01-15',
    status: '배송완료',
    trackingNumber: '1234567890123',
    products: [
      {
        id: 23,
        name: '프리미엄 꿀 선물세트',
        image:
          'https://contents.kyobobook.co.kr/sih/fit-in/400x0/gift/pdt/1106/hot1711961219730.jpg',
        price: 45000,
        quantity: 2,
        totalPrice: 90000,
        option: '선물포장 + 리본',
      },
      {
        id: 2,
        name: '천연 벌꿀 500g',
        image:
          'https://contents.kyobobook.co.kr/sih/fit-in/400x0/gift/pdt/1106/hot1711961219730.jpg',
        price: 25000,
        quantity: 1,
        totalPrice: 25000,
        option: '유리병',
      },
    ],
    shippingFee: 3000,
    totalAmount: 118000,
    shippingAddress: {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울특별시 강남구 테헤란로 123',
      detailAddress: 'ABC빌딩 10층',
      option: '프리미엄 꿀 선물세트',
    },
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    orderDate: '2024-01-20',
    status: '배송중',
    trackingNumber: '9876543210987',
    products: [
      {
        id: 3,
        name: '로얄젤리 캡슐 60정',
        image:
          'https://contents.kyobobook.co.kr/sih/fit-in/400x0/gift/pdt/1106/hot1711961219730.jpg',
        price: 35000,
        quantity: 1,
        totalPrice: 35000,
        option: '60정',
      },
    ],
    shippingFee: 0,
    totalAmount: 35000,
    shippingAddress: {
      name: '김영희',
      phone: '010-9876-5432',
      address: '부산광역시 해운대구 센텀중앙로 456',
      detailAddress: '센텀시티 2동 201호',
      option: '로얄젤리 캡슐 60정',
    },
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    orderDate: '2024-01-25',
    status: '주문확인',
    trackingNumber: '', // 송장번호 없음
    products: [
      {
        id: 4,
        name: '프로폴리스 스프레이 30ml',
        image:
          'https://contents.kyobobook.co.kr/sih/fit-in/400x0/gift/pdt/1106/hot1711961219730.jpg',
        price: 18000,
        quantity: 3,
        totalPrice: 54000,
        option: '30ml',
      },
      {
        id: 5,
        name: '벌꿀 비누 3개 세트',
        image:
          'https://contents.kyobobook.co.kr/sih/fit-in/400x0/gift/pdt/1106/hot1711961219730.jpg',
        price: 12000,
        quantity: 2,
        totalPrice: 24000,
        option: '3개 세트',
      },
    ],
    shippingFee: 3000,
    totalAmount: 81000,
    shippingAddress: {
      name: '이민수',
      phone: '010-5555-7777',
      address: '대구광역시 수성구 동대구로 789',
      detailAddress: '수성아파트 3동 502호',
    },
  },
  {
    id: 4,
    orderNumber: 'ORD-2024-004',
    orderDate: '2024-01-28',
    status: '배송준비중',
    trackingNumber: '', // 송장번호 없음
    products: [
      {
        id: 6,
        name: '꿀벌 밀랍 크림 50g',
        image:
          'https://contents.kyobobook.co.kr/sih/fit-in/400x0/gift/pdt/1106/hot1711961219730.jpg',
        price: 22000,
        quantity: 1,
        totalPrice: 22000,
        option: '50g',
      },
    ],
    shippingFee: 3000,
    totalAmount: 25000,
    shippingAddress: {
      name: '박지영',
      phone: '010-3333-9999',
      address: '인천광역시 연수구 컨벤시아대로 321',
      detailAddress: '송도아파트 1동 101호',
    },
  },
];
