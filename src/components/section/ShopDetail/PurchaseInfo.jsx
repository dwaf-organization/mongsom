import { useState } from 'react';

import ProductHeader from '../../ui/ShopDetail/ProductHeader';
import OptionSelector from '../../ui/ShopDetail/OptionSelector';
import TotalPrice from '../../ui/ShopDetail/TotalPrice';
import PurchaseBar from '../../ui/ShopDetail/PurchaseBar';

export default function PurchaseInfo({ product }) {
  const [totalPrice, setTotalPrice] = useState(0);

  const handleTotalPriceChange = newTotalPrice => {
    setTotalPrice(newTotalPrice);
  };

  return (
    <div className='flex flex-col gap-4 min-w-[400px] px-4'>
      <ProductHeader product={product} />
      <OptionSelector
        product={product}
        onTotalPriceChange={handleTotalPriceChange}
      />
      <TotalPrice totalPrice={totalPrice} />
      <PurchaseBar />
    </div>
  );
}
