import EngravingIcon from '../asset/icons/EngravingIcon';
import Gift from '../asset/icons/GIft';
import HandShake from '../asset/icons/HandShake';
import Promotion from '../asset/icons/Promotion';

export const PRICE_OPTIONS = [
  { id: 'lt200', label: '200만원 이하', min: 0, max: 2_000_000 },
  { id: '200-500', label: '200 ~ 500만원', min: 2_000_000, max: 5_000_000 },
  { id: '500-1000', label: '500 ~ 1000만원', min: 5_000_000, max: 10_000_000 },
  { id: 'gt1000', label: '1000만원 이상', min: 10_000_000, max: 15_000_000 },
  { id: 'gt1500', label: '1000만원 이상', min: 10_000_000, max: 15_000_000 },
];

export const CATEGORY_OPTIONS = [
  { id: 'premium', label: '프리미엄 선물', Icon: Gift },
  { id: 'return', label: '답례품', Icon: HandShake },
  { id: 'promo', label: '판촉물/홍보용', Icon: Promotion },
  { id: 'engrave', label: '각인서비스', Icon: EngravingIcon },
];
