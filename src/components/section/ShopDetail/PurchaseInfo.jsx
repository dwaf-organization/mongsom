import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../../ui/button';
import ProductHeader from '../../ui/ShopDetail/ProductHeader';
import OptionSelector from '../../ui/ShopDetail/OptionSelector';
import TotalPrice from '../../ui/ShopDetail/TotalPrice';
import CartButton from '../../../layout/button/CartButton';

export default function PurchaseInfo({ product }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleTotalPriceChange = newTotalPrice => {
    setTotalPrice(newTotalPrice);
  };

  const handleOptionsChange = options => {
    setSelectedOptions(options);
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
        {/* <Link to='/order' className='w-full'>
          <Button
            className=' font-bold text-xl font-pretendard'
            variant='default'
          >
            구매하기
          </Button>
        </Link> */}
      </div>
    </div>
  );
}
