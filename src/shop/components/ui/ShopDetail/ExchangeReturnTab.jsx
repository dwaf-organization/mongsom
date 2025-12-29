export default function ExchangeReturnTab({ product }) {
  return (
    <section class='mx-auto max-w-3xl p-6 text-sm leading-relaxed text-gray-800'>
      <h2 class='mb-4 text-2xl font-bold'>교환/환불 안내</h2>

      <div class='rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-left'>
        <h3 class='mb-2 text-lg font-semibold'>1) 교환·환불 규정</h3>
        <ul class='list-disc pl-5 space-y-1'>
          <li>
            상품 수령일로부터 <b>7일 이내</b> 신청 가능합니다.
          </li>
          <li>
            제품 <b>하자</b> 또는 <b>오배송</b> 시: 동일 상품 교환 또는 전액
            환불 (배송비 <b>판매자 부담</b>)
          </li>
        </ul>

        <p className='font-semibold'>단순 변심 시</p>
        <ul class='list-disc pl-5 space-y-1'>
          <li>미개봉·미사용 & 구성품 완비 상태에 한해 7일 이내 가능</li>
          <li>편도 배송비 3,000원 / 교환 배송비 6000원</li>
          <li> 최초 배송비 무료인 경우 6,000원</li>
        </ul>

        <p className='font-semibold'>제품 불량 또는 오배송 시</p>
        <ul class='list-disc pl-5 space-y-1'>
          <li> 동일 상품 교환 또는 전액 환불</li>
          <li> 배송비 판매자 부담 </li>
          <li>교환/반품 주소지 : 부산광역시 강서구 녹산산단361로 42</li>
        </ul>

        <p className='font-semibold'>교환 및 반품 불가</p>
        <ul class='list-disc pl-5 space-y-1'>
          <li>
            반품 요청기간이 지난 경우 고객 부주의로 상품·포장·구성품이
            훼손되거나 사용 흔적이 있는 경우
          </li>
          <li>
            구매일로부터 시간이 지나 재판매가 곤란할 정도로 가치가 감소한 경우
          </li>
          <li>프로모션/한정 특가 등에서 사전에 별도 고지된 상품</li>
        </ul>

        <h3 class='mt-6 mb-2 text-lg font-semibold'>2) 신청 방법</h3>
        <ol class='list-decimal pl-5 space-y-1'>
          <li>수령 후 7일 이내 고객센터로 교환/환불 신청</li>
          <li>불량·오배송의 경우 확인 가능한 사진 첨부</li>
          <li>사전 접수 후 안내된 주소로 상품 반송</li>
        </ol>
        {/* <div class='mt-6 grid gap-2 rounded-lg bg-gray-50 p-4 text-sm'>
          <p>
            <b>고객센터</b> : 0000-0000 / weekdays 10:00–17:00 (점심
            12:30–13:30)
          </p>
          <p>
            <b>반품 주소</b> : (우) 00000, 주소를 입력해주세요
          </p>
          <p class='text-gray-500'>
            ※ 전자상거래법 등 관련 법령 및 당사 약관을 따릅니다.
          </p>
        </div> */}
      </div>
    </section>
  );
}
