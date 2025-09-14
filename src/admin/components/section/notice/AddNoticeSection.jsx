import { Button } from '../../ui/button';
import RichEditor from '../../ui/RichEditor';
import { useState, useRef } from 'react';

export default function AddNoticeSection() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const editorRef = useRef(null);

  const submit = e => {
    e.preventDefault();
    const html = editorRef.current?.getHTML() || desc;
    console.log({ title, html });
  };
  return (
    <form onSubmit={submit}>
      <div className='rounded-lg border border-gray-400 w-full max-w-[980px] h-full'>
        <div className='grid grid-cols-[200px_1fr] rounded-2xl'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
            제목
          </div>
          <div className='p-4 border-b flex flex-wrap items-center gap-3'>
            <input placeholder='상품명을 입력하세요' name='category' />
          </div>
        </div>

        <div className='grid grid-cols-[200px_1fr] h-full w-full'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
            내용
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
      <div className='flex items-center gap-4 justify-center pt-10'>
        <Button
          variant='outline'
          className='w-fit px-10 py-3 border-gray-500 text-gray-500'
        >
          취소
        </Button>
        <Button type='submit' className='w-fit px-10 py-3'>
          등록
        </Button>
      </div>
    </form>
  );
}
