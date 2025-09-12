import { useState } from 'react';

export default function AddressSearchButton({
  onAddressSelect,
  className = '',
  buttonText = '주소검색',
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressSearch = () => {
    setIsLoading(true);

    if (!window.daum) {
      const script = document.createElement('script');
      script.src =
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        openAddressPopup();
      };
      document.head.appendChild(script);
    } else {
      openAddressPopup();
    }
  };

  const openAddressPopup = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.address;
        const extraAddress = data.addressType === 'R' ? data.bname : '';

        const addressData = {
          zonecode: data.zonecode,
          address: fullAddress,
          extraAddress: extraAddress,
          roadAddress: data.roadAddress,
          jibunAddress: data.jibunAddress,
        };

        if (onAddressSelect) {
          onAddressSelect(addressData);
        }

        setIsLoading(false);
      },
      onclose: function () {
        setIsLoading(false);
      },
    }).open();
  };

  return (
    <button
      type='button'
      onClick={handleAddressSearch}
      disabled={isLoading}
      className={`bg-black-100 text-white whitespace-nowrap h-[48px] rounded-md p-2 max-w-[166px] w-full disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? '검색중...' : buttonText}
    </button>
  );
}
