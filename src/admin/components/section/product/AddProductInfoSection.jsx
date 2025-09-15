import { useState, useRef } from 'react';

import RichEditor from '../../ui/RichEditor';
import 'quill/dist/quill.snow.css';
import Plus from '../../../assets/icons/Plus';
import { Button } from '../../ui/button';

export default function AddProductInfoSection() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const editorRef = useRef(null);

  const submit = e => {
    e.preventDefault();
    const html = editorRef.current?.getHTML() || desc;
    console.log({ name, html });
  };
  return (
    <form onSubmit={submit}>
      <div className='rounded-lg border border-gray-400 w-full max-w-[980px] h-full'>
        <div className='grid grid-cols-[200px_1fr] rounded-2xl'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
            상품명
          </div>
          <div className='p-4 border-b flex flex-wrap items-center gap-3'>
            <input
              placeholder='상품명을 입력하세요'
              name='productName'
              className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
            />
          </div>
        </div>

        <div className='grid grid-cols-[200px_1fr] h-full w-full'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
            상품 설명
          </div>
          <RichEditor
            ref={editorRef}
            value={desc}
            onChange={setDesc}
            variant='full'
            maxChars={20000}
            minHeight={300}
          />
        </div>
      </div>
      <section className='py-10'>
        <p className='font-semibold text-xl mb-4'>이미지 정보</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b whitespace-nowrap'>
            썸네일 등록
          </div>
          <div className='p-6 border-b flex flex-wrap items-center gap-3'>
            <img
              src='https://picsum.photos/200/300'
              alt='product'
              className='w-[100px] h-[100px] object-cover rounded-lg'
            />
            <button className=' h-[100px] bg-primary-100 w-[100px] rounded-lg flex items-center justify-center'>
              <Plus />
            </button>
          </div>
        </div>
      </section>

      <section className='py-10'>
        <p className='font-semibold text-xl mb-4'>표시 설정</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b whitespace-nowrap'>
            상품분류 선택
          </div>
          <div className='p-6 flex items-center gap-3'>
            <div className='flex items-start gap-3'>
              <Button
                className='w-fit py-2 px-4 border-gray-500 text-gray-500'
                variant='outline'
              >
                프리미엄 선물용
              </Button>

              <Button
                className='w-fit py-2 px-4 border-gray-500 text-gray-500'
                variant='outline'
              >
                일반 상품
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className='py-10'>
        <p className='font-semibold text-xl mb-4'>옵션 등록</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b whitespace-nowrap'>
            옵션 등록
          </div>
          <div className='p-6 flex flex-col gap-3'>
            <div className='flex items-start gap-3'>
              <input
                type='text'
                placeholder='옵션명을 입력하세요'
                className='border rounded-md p-2 w-full max-w-[500px] focus:outline-primary-200 border-gray-400'
              />
              <div className='flex flex-col gap-2'>
                <Button className='w-fit py-2 px-4'>+ 등록</Button>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <p className='text-gray-600 w-full max-w-[500px]'>
                1)옵션명이 들어갑니다
              </p>
              <Button
                className='w-fit py-2 px-4 border-gray-500 text-gray-500'
                variant='outline'
              >
                X 삭제
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className='py-10'>
        <div className='rounded-lg border border-gray-400'>
          <di className='grid grid-cols-[200px_1fr]'>
            <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
              <div className='w-fit text-center'></div>
              <p>공급가</p>
              <p>+</p>
              <p>판매 마진</p>
              <p>+</p>
              <p>할인</p>
            </div>

            <div className='p-4 border-b flex flex-wrap items-center gap-3'>
              <input
                name='category'
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
              />
              <p>KRW</p>
              <input
                name='category'
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
              />
              <p>KRW</p>
              <input
                name='category'
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
              />
              <p>%</p>
            </div>
          </di>

          <div className='grid grid-cols-[200px_1fr]'>
            <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
              판매 가격
            </div>

            <div className='p-4 border-b flex flex-wrap items-center gap-3'>
              <input
                name='totalPrice'
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
              />
              <p>KRW</p>
            </div>
          </div>
        </div>
      </section>
      <div className='flex justify-center'>
        <Button type='submit' className='w-fit px-20 py-4'>
          상품 등록
        </Button>
      </div>
    </form>
  );
}
