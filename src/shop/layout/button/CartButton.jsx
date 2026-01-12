import { Button } from '../../components/ui/button';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { addCart } from '../../api/cart';
import { useAuth } from '../../context/AuthContext';
import {
  setInstantPurchase,
  clearInstantPurchase,
} from '../../utils/instantPurchase';

export default function CartButton({ selectedOptions = [], product = {} }) {
  console.log('🚀 ~ CartButton ~ product:', product);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { userCode } = useAuth();

  const soldOut = product.stockStatus === 0;
  console.log('🚀 ~ CartButton ~ soldOut:', soldOut);

  const productId = Number(product.productId ?? product.id);
  const isOptionSelected =
    Array.isArray(selectedOptions) && selectedOptions.length > 0;

  const handleBuy = () => {
    if (!isOptionSelected) {
      addToast('상품 옵션을 선택한 후 구매하기 버튼을 눌러주세요.', 'warning');
      return;
    }

    if (!userCode) {
      addToast('로그인이 필요합니다.', 'warning');
      navigate('/login');
      return;
    }

    clearInstantPurchase();

    const prodId = Number(product.productId ?? product.id);
    const basePrice = Number(product.basePrice ?? product.price ?? 0);
    const discountPrice = Number(
      product.discountPrice ?? product.salePrice ?? basePrice,
    );

    // 이미지 URL 추출
    let mainImageUrl = product.mainImageUrl ?? '';

    // productImages 배열에서 추출 (새 형식)
    if (
      !mainImageUrl &&
      Array.isArray(product.productImages) &&
      product.productImages.length > 0
    ) {
      mainImageUrl = product.productImages[0]?.productImgUrl ?? '';
    }

    // productImgUrls에서 추출
    if (
      !mainImageUrl &&
      Array.isArray(product.productImgUrls) &&
      product.productImgUrls.length > 0
    ) {
      mainImageUrl = product.productImgUrls[0] ?? '';
    }

    // productImgUrl에서 추출
    if (!mainImageUrl && product.productImgUrl) {
      if (
        Array.isArray(product.productImgUrl) &&
        product.productImgUrl.length > 0
      ) {
        mainImageUrl = product.productImgUrl[0] ?? '';
      } else if (typeof product.productImgUrl === 'string') {
        mainImageUrl = product.productImgUrl;
      }
    }

    const payload = {
      product: {
        productId: prodId,
        name: product.name,
        price: basePrice,
        basePrice,
        discountPer: product.discountPer,
        discountPrice,
        mainImageUrl,
      },
      options: selectedOptions.map((opt, idx) => {
        // OptionSelector에서는 totalPriceAdjustment로 넘어옴
        const optionPrice = Number(
          opt.totalPriceAdjustment ?? opt.optionPrice ?? 0,
        );
        const unitPrice = discountPrice + optionPrice;
        const quantity = Number(opt.quantity) || 1;

        // selectedInfos에서 option1, option2 추출
        const optionIds = (opt.selectedInfos || []).map(
          info => info.optionValueId,
        );

        return {
          cartId: `instant-${opt.combinationKey ?? idx}-${Date.now()}`,
          productId: prodId,
          productName: product.name,
          basePrice,
          discountPrice,
          discountPer: product.discountPer,
          optionPrice,
          unitPrice,
          quantity,
          totalPrice: unitPrice * quantity,
          checkStatus: 1,
          mainImageUrl,
          // OptionSelector에서는 typeName, optionName으로 넘어옴
          selectedOptions:
            opt.selectedInfos?.map(info => ({
              optionTypeName: info.typeName ?? info.optionTypeName ?? '',
              optionValueName: info.optionName ?? info.optionValueName ?? '',
              priceAdjustment: Number(info.priceAdjustment ?? 0),
            })) ?? [],
          // 기존 호환용
          optId: Number(opt.value ?? opt.optId) || null,
          optName: opt.name ?? opt.label ?? opt.optName ?? null,
          // 주문 생성용 option1, option2 추가
          option1: optionIds[0] ?? null,
          option2: optionIds[1] ?? null,
        };
      }),
    };

    setInstantPurchase(payload);

    navigate('/order');
  };

  const handleAddToCart = async () => {
    if (!userCode) {
      addToast('로그인이 필요합니다.', 'warning');
      navigate('/login');
      return;
    }
    if (!isOptionSelected) {
      addToast('상품 옵션을 선택한 후 장바구니에 추가해주세요.', 'warning');
      return;
    }

    try {
      const results = await Promise.all(
        selectedOptions.map(opt => {
          // selectedInfos에서 option1, option2 추출
          const optionIds = (opt.selectedInfos || []).map(
            info => info.optionValueId,
          );
          const payload = {
            userCode,
            productId,
            option1: optionIds[0] ?? null,
            option2: optionIds[1] ?? null,
            quantity: Number(opt.quantity) || 1,
          };
          return addCart(payload);
        }),
      );
      console.log('🚀 ~ handleAddToCart ~ results:', results);

      const ok = results.every(r => r?.code === 1);
      if (ok) addToast('장바구니에 담았습니다.', 'success');
      else addToast('일부 옵션 담기에 실패했습니다.', 'error');
    } catch (e) {
      console.error(e);
      addToast('장바구니 담기 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <>
      <Button
        className='w-full font-bold md:text-xl font-pretendard'
        variant='outline'
        onClick={handleAddToCart}
        disabled={soldOut}
      >
        장바구니
      </Button>
      <Button
        className='w-full font-bold md:text-xl font-pretendard'
        variant='default'
        onClick={handleBuy}
        disabled={soldOut}
      >
        구매하기
      </Button>
    </>
  );
}
