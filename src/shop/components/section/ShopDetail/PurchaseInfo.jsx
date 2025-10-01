import { useState } from 'react';

import ProductHeader from '../../ui/ShopDetail/ProductHeader';
import OptionSelector from '../../ui/ShopDetail/OptionSelector';
import TotalPrice from '../../ui/ShopDetail/TotalPrice';
import CartButton from '../../../layout/button/CartButton';
import { useModal } from '../../../context/ModalContext';
import InquireModal from '../../ui/InquireModal';

export default function PurchaseInfo({ product }) {
  const { openModal } = useModal();
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleTotalPriceChange = newTotalPrice => {
    setTotalPrice(newTotalPrice);
  };

  const handleOptionsChange = options => {
    setSelectedOptions(options);
  };

  const handleClick = () => {
    openModal(<InquireModal />);
  };

  return (
    <div className='flex flex-col gap-4 min-w-[400px] px-4'>
      <ProductHeader product={product} />
      <OptionSelector
        product={product}
        onTotalPriceChange={handleTotalPriceChange}
        onOptionsChange={handleOptionsChange}
      />
      <TotalPrice totalPrice={totalPrice} />
      <div className='flex justify-between gap-2'>
        <CartButton selectedOptions={selectedOptions} product={product} />
      </div>
      <hr className='border border-gray-400' />
      <button
        className='text-sm text-gray-700 underline hover:text-primary-200'
        onClick={handleClick}
      >
        대량 주문 견적 할인 문의
      </button>
    </div>
  );
}
