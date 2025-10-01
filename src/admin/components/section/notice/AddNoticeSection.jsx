import { Button } from '../../ui/button';
import RichEditor from '../../ui/RichEditor';
import { useState, useRef } from 'react';
import { createNotice } from '../../../api/notice';
import { useToast } from '../../../context/ToastContext';

export default function AddNoticeSection() {
  const editorRef = useRef(null);
  const { addToast } = useToast();
  const [productData, setProductData] = useState({
    title: '',
    contents: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ 에디터 blur 등에서 넘어온 HTML을 그대로 저장
  const handleEditorChangeHTML = html => {
    setProductData(prev => ({ ...prev, contents: html }));
  };

  const submit = async e => {
    e.preventDefault();

    if (!productData.title.trim()) {
      addToast('제목을 입력해 주세요.', 'error');
      return;
    }

    // 에디터 실제 입력 여부 체크 (텍스트/미디어)
    const quill = editorRef.current?.getEditor?.();
    const plain = (quill?.getText?.() || '').trim();
    const ops = quill?.getContents?.().ops || [];
    const hasMedia = ops.some(
      op =>
        typeof op.insert === 'object' && (op.insert.image || op.insert.video),
    );
    if (!plain && !hasMedia) {
      addToast('내용을 입력해 주세요.', 'error');
      return;
    }

    // ✅ 최종 HTML은 ref에서 한 번 더 가져와 보정
    const html = editorRef.current?.getHTML?.() ?? productData.contents;
    const payload = { ...productData, contents: html };

    try {
      setSubmitting(true);
      const resp = await createNotice(payload);
      if (resp === false) {
        addToast('공지 등록에 실패했습니다.', 'error');
        return;
      }
      console.log('✅ 공지 등록 성공:', resp);
      alert('공지 등록이 완료되었습니다.');

      // 폼 초기화 + 에디터도 비움
      setProductData({ title: '', contents: '' });
      editorRef.current?.setHTML?.('');
    } catch (err) {
      console.error('❌ 공지 등록 실패:', err);
      alert('공지 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className='rounded-lg border border-gray-400 w-full max-w-[980px] h-full'>
        {/* 제목 */}
        <div className='grid grid-cols-[200px_1fr] rounded-2xl'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
            제목
          </div>
          <div className='p-4 border-b flex flex-wrap items-center gap-3'>
            <input
              placeholder='제목을 입력하세요'
              name='title'
              className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
              value={productData.title}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 내용 */}
        <div className='grid grid-cols-[200px_1fr] h-full w-full'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
            내용
          </div>
          <RichEditor
            ref={editorRef}
            initialValue={productData.contents} // ✅ 비제어 초기값
            variant='full'
            maxChars={20000}
            minHeight={300}
            onChangeHTML={handleEditorChangeHTML} // ✅ blur 시점 HTML 저장
          />
        </div>
      </div>

      <div className='flex items-center gap-4 justify-center pt-10'>
        <Button
          type='button'
          variant='outline'
          className='w-fit px-10 py-3 border-gray-500 text-gray-500'
          onClick={() => {
            setProductData({ title: '', contents: '' });
            editorRef.current?.setHTML?.('');
          }}
        >
          취소
        </Button>
        <Button
          type='submit'
          className='w-fit px-10 py-3'
          disabled={submitting}
        >
          {submitting ? '등록 중…' : '등록'}
        </Button>
      </div>
    </form>
  );
}
