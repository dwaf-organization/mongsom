import { Button } from '../../ui/button';
import RichEditor from '../../ui/RichEditor';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getNoticeDetail, updateNotice } from '../../../api/notice';
import { useToast } from '../../../context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditNoticeSection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    contents: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNoticeDetail(id);
      const data = res?.data ?? res;
      setForm({
        title: data?.title ?? '',
        contents: data?.contents ?? '',
      });
      requestAnimationFrame(() => {
        editorRef.current?.setHTML?.(data?.contents ?? '');
      });
    } catch (e) {
      addToast('공지 정보를 불러오지 못했습니다.', 'error');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [id, addToast, navigate]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChangeHTML = html => {
    setForm(prev => ({ ...prev, contents: html }));
  };

  const submit = async e => {
    e.preventDefault();
    if (!form.title.trim()) {
      addToast('제목을 입력해 주세요.', 'error');
      return;
    }

    const quill = editorRef.current?.getEditor?.();
    const plain = (quill?.getText?.() || '').trim();
    const ops = quill?.getContents?.().ops || [];
    const hasMedia =
      ops?.some(
        op =>
          typeof op.insert === 'object' && (op.insert.image || op.insert.video),
      ) || false;

    if (!plain && !hasMedia) {
      addToast('내용을 입력해 주세요.', 'error');
      return;
    }

    const html = editorRef.current?.getHTML?.() ?? form.contents;
    const payload = { title: form.title, contents: html };

    try {
      setSubmitting(true);

      const resp = await updateNotice(id, payload);
      if (resp === false || resp?.code === 0) {
        addToast('공지 수정에 실패했습니다.', 'error');
        return;
      }
      addToast('공지 수정이 완료되었습니다.', 'success');

      navigate(-1);
    } catch (err) {
      console.error('❌ 공지 수정 실패:', err);
      addToast('공지 수정에 실패했습니다.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='max-w-[980px] mx-auto p-6 text-gray-500'>
        불러오는 중...
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className='rounded-lg border border-gray-400 w-full max-w-[980px] h-full'>
        <div className='grid grid-cols-[200px_1fr] rounded-2xl'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b'>
            제목
          </div>
          <div className='p-4 border-b flex flex-wrap items-center gap-3'>
            <input
              placeholder='제목을 입력하세요'
              name='title'
              className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
              value={form.title}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className='grid grid-cols-[200px_1fr] h-full w-full'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b'>
            내용
          </div>
          <RichEditor
            ref={editorRef}
            initialValue={form.contents}
            variant='full'
            maxChars={20000}
            minHeight={300}
            onChangeHTML={handleEditorChangeHTML}
          />
        </div>
      </div>

      <div className='flex items-center gap-4 justify-center pt-10'>
        <Button
          type='button'
          variant='outline'
          className='w-fit px-10 py-3 border-gray-500 text-gray-500'
          onClick={() => fetchDetail()}
          disabled={submitting}
        >
          되돌리기
        </Button>
        <Button
          type='button'
          variant='outline'
          className='w-fit px-10 py-3'
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          취소
        </Button>
        <Button
          type='submit'
          className='w-fit px-10 py-3'
          disabled={submitting}
        >
          {submitting ? '수정 중…' : '수정 완료'}
        </Button>
      </div>
    </form>
  );
}
