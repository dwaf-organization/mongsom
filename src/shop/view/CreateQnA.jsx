import React from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createQnA } from '../api/qna';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CreateQnA() {
  const [searchParams] = useSearchParams();
  const productCode = searchParams.get('productCode');
  const productName = searchParams.get('productName');
  const [formData, setFormData] = useState({
    qnaTitle: '',
    qnaContents: '',
    orderId: '',
    productId: productCode,
    productName: productName,
    lockStatus: 0,
  });
  const { userCode } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.qnaTitle || !formData.qnaContents) {
      addToast('제목과 내용을 입력해주세요.', 'warning');
      return;
    }
    const response = await createQnA({
      productName: formData.productName,
      userCode: userCode,
      productId: formData.productId,
      qnaTitle: formData.qnaTitle,
      orderId: formData.orderId,
      qnaContents: formData.qnaContents,
      lockStatus: formData.lockStatus,
    });
    console.log('🚀 ~ handleSubmit ~ response:', response);
    if (response.code === 1) {
      navigate(-1);
      addToast('QnA가 등록되었습니다.', 'success');
    }
  };
  return (
    <InnerPaddingSectionWrapper>
      <div className='border  border-gray-400 flex gap-6 p-4 text-sm mb-6'>
        <p className='text-gray-500'>문의상품</p>
        <p> {productName}</p>
      </div>

      <form action='submit'>
        <input
          type='text'
          id='qnaTitle'
          className='border p-4 border-gray-400 w-full mb-2  text-sm'
          placeholder='문의 제목을 입력하세요.'
          onChange={handleInputChange}
        />
        <input
          type='text'
          id='qnaContents'
          className='border p-4 border-gray-400 w-full min-h-[400px] text-sm'
          placeholder='문의하실 내용을 입력하세요'
          onChange={handleInputChange}
        />

        <label
          htmlFor=''
          className='flex mt-4 border p-4 border-gray-400 w-full text-sm gap-6'
        >
          <p className='text-gray-500'>주문번호</p>
          <input
            type='text'
            placeholder='주문번호를 입력하세요.'
            onChange={handleInputChange}
            id='orderId'
          />
        </label>

        <label className='mt-4 flex items-center cursor-pointer'>
          <input
            type='checkbox'
            checked={formData.lockStatus === 1}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                lockStatus: e.target.checked ? 1 : 0,
              }))
            }
          />
          <span className='ml-2 text-sm'>비공개</span>
        </label>

        <div className='mt-6 flex items-center w-full'>
          <button
            className='bg-black-200 text-white p-2 rounded-md font-semibold text-xs'
            onClick={handleSubmit}
          >
            QnA 등록하기
          </button>
        </div>
      </form>
    </InnerPaddingSectionWrapper>
  );
}
