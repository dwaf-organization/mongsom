// src/.../RichEditor.jsx
import React, {
  forwardRef,
  useMemo,
  useRef,
  useEffect,
  useImperativeHandle,
  memo,
} from 'react';
import ReactQuill from 'react-quill-new';
import 'quill/dist/quill.snow.css';

const RichEditorInner = forwardRef(function RichEditor(
  {
    /** 최초 1회 세팅할 HTML (비제어). 바뀌는 값을 반영하고 싶으면 부모에서 ref.setHTML 사용 */
    initialValue = '',
    /** 'full' | 'minimal' | 'title' */
    variant = 'full',
    /** 업로드 콜백들(없으면 해당 버튼 숨김) */
    onUploadImage,
    onUploadFile,
    onUploadVideo,
    /** 최대 입력 글자수(텍스트 기준). 초과 시 잘라냄 */
    maxChars,
    placeholder = '내용을 입력하세요…',
    minHeight = 240,
    className = '',
    /** 선택: 에디터가 blur될 때 최종 HTML을 알려줌 */
    onChangeHTML,
  },
  ref,
) {
  const quillRef = useRef(null);

  // 최신 콜백을 참조하기 위한 ref (modules 핸들러는 identity 유지)
  const imgCbRef = useRef(onUploadImage);
  const fileCbRef = useRef(onUploadFile);
  const videoCbRef = useRef(onUploadVideo);
  useEffect(() => {
    imgCbRef.current = onUploadImage;
  }, [onUploadImage]);
  useEffect(() => {
    fileCbRef.current = onUploadFile;
  }, [onUploadFile]);
  useEffect(() => {
    videoCbRef.current = onUploadVideo;
  }, [onUploadVideo]);

  const pickFile = (accept, cb) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (accept) input.accept = accept;
    input.onchange = () => {
      const f = input.files && input.files[0];
      if (f) cb(f);
    };
    input.click();
  };

  // 툴바 구성 (불필요한 재계산 최소화)
  const toolbarContainer = useMemo(() => {
    const hasImg = !!onUploadImage;
    const hasVid = !!onUploadVideo;
    const hasFile = !!onUploadFile;

    if (variant === 'title') {
      return [
        [{ header: [false, 2] }],
        ['bold', 'italic', 'underline'],
        ['clean'],
      ];
    }
    if (variant === 'minimal') {
      return [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', ...(hasImg ? ['image'] : [])],
        ['clean'],
      ];
    }
    return [
      [{ header: [1, 2, 3, false] }],
      [
        'bold',
        'italic',
        'underline',
        'strike',
        { script: 'sub' },
        { script: 'super' },
      ],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [
        'link',
        ...(hasImg ? ['image'] : []),
        ...(hasVid ? ['video'] : []),
        ...(hasFile ? ['file'] : []),
      ],
      ['clean'],
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, !!onUploadImage, !!onUploadVideo, !!onUploadFile]);

  // modules 객체 (toolbarContainer 변경시에만 새로 만듦)
  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolbarContainer,
        handlers: {
          image: function () {
            const cb = imgCbRef.current;
            if (!cb) return;
            pickFile('image/*', async file => {
              const url = await cb(file);
              if (!url) return;
              const quill = quillRef.current?.getEditor();
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', url, 'user');
              quill.setSelection(range.index + 1);
            });
          },
          video: function () {
            const cb = videoCbRef.current;
            if (!cb) return;
            pickFile('video/*', async file => {
              const url = await cb(file);
              if (!url) return;
              const quill = quillRef.current?.getEditor();
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'video', url, 'user');
              quill.setSelection(range.index + 1);
            });
          },
          file: function () {
            const cb = fileCbRef.current;
            if (!cb) return;
            pickFile('', async file => {
              const url = await cb(file);
              if (!url) return;
              const quill = quillRef.current?.getEditor();
              const range = quill.getSelection(true);
              const text = file.name;
              quill.insertText(range.index, text, 'link', url, 'user');
              quill.setSelection(range.index + text.length);
            });
          },
        },
      },
    }),
    [toolbarContainer],
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'script',
    'color',
    'background',
    'list',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
  ];

  // 글자수 제한만 처리(상태 동기화 X → 깜빡임 방지)
  const handleChange = (_html, _delta, _source, editor) => {
    if (!maxChars) return;
    const textLen = editor.getText().replace(/\n$/, '').length;
    if (textLen > maxChars) {
      const quill = quillRef.current?.getEditor();
      quill.deleteText(maxChars, textLen);
    }
  };

  // blur 시점에만 최종 HTML을 부모로 알림(선택)
  useEffect(() => {
    if (!onChangeHTML) return;
    const q = quillRef.current?.getEditor();
    if (!q) return;
    const root = q.root;
    const onBlur = () => {
      const html = q.root.innerHTML || '';
      onChangeHTML(html);
    };
    root.addEventListener('blur', onBlur, true);
    return () => root.removeEventListener('blur', onBlur, true);
  }, [onChangeHTML]);

  // 외부에서 제어할 수 있는 메서드 노출
  useImperativeHandle(
    ref,
    () => ({
      /** 현재 HTML 가져오기 */
      getHTML: () => quillRef.current?.getEditor()?.root?.innerHTML || '',
      /** HTML 설정(초기값 변경 등 수동 반영) */
      setHTML: html => {
        const q = quillRef.current?.getEditor();
        if (q) q.root.innerHTML = html ?? '';
      },
      /** 필요하면 에디터 인스턴스 직접 접근 */
      getEditor: () => quillRef.current?.getEditor(),
    }),
    [],
  );

  // initialValue 변경 시 수동으로만 반영 (defaultValue는 최초 1회만 적용)
  useEffect(() => {
    const q = quillRef.current?.getEditor();
    if (!q) return;
    q.root.innerHTML = initialValue || '';
  }, [initialValue]);

  const minH =
    typeof minHeight === 'number' ? `${minHeight}px` : minHeight || '240px';

  return (
    <div
      className={[
        'rt-editor rounded-md border bg-white',
        '[&_.ql-toolbar]:border-0 [&_.ql-container]:border-0',
        '[&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md',
        className,
      ].join(' ')}
      style={{ ['--rt-min-h']: minH }}
    >
      <ReactQuill
        ref={quillRef}
        theme='snow'
        defaultValue={initialValue} // 비제어
        onChange={handleChange} // 글자수 제한만
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: 'auto' }}
      />
    </div>
  );
});

export default memo(RichEditorInner);
