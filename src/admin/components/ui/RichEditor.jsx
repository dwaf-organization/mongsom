import {
  forwardRef,
  useMemo,
  useRef,
  useEffect,
  useImperativeHandle,
  memo,
} from 'react';
import ReactQuill from 'react-quill-new';
import Quill from 'quill'; // ✅ clipboard matcher 사용
import 'quill/dist/quill.snow.css';

const Delta = Quill.import('delta'); // ✅ empty delta용

const RichEditorInner = forwardRef(function RichEditor(
  {
    initialValue = '',
    variant = 'full',
    onUploadImage,
    onUploadFile,
    onUploadVideo,
    maxChars,
    placeholder = '내용을 입력하세요…',
    minHeight = 240,
    className = '',
    onChangeHTML,
  },
  ref,
) {
  const quillRef = useRef(null);

  // 최신 콜백 ref
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

  // 툴바
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
      // ✅ Quill clipboard 모듈에 직접 관여는 useEffect에서 할 거라 여기선 그대로
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

  // 입력 길이 제한
  const handleChange = (_html, _delta, _source, editor) => {
    if (!maxChars) return;
    const textLen = editor.getText().replace(/\n$/, '').length;
    if (textLen > maxChars) {
      const quill = quillRef.current?.getEditor();
      quill.deleteText(maxChars, textLen);
    }
  };

  // blur 시 부모에 HTML 전달
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

  // 외부 제어 API
  useImperativeHandle(
    ref,
    () => ({
      getHTML: () => quillRef.current?.getEditor()?.root?.innerHTML || '',
      setHTML: html => {
        const q = quillRef.current?.getEditor();
        if (q) q.root.innerHTML = html ?? '';
      },
      getEditor: () => quillRef.current?.getEditor(),
    }),
    [],
  );

  // initialValue 반영
  useEffect(() => {
    const q = quillRef.current?.getEditor();
    if (!q) return;
    q.root.innerHTML = initialValue || '';
  }, [initialValue]);

  // ✅ 붙여넣기 & 드롭 완전 차단
  useEffect(() => {
    const q = quillRef.current?.getEditor?.();
    const root = q?.root;
    if (!q || !root) return;

    // 1) Quill clipboard 수준에서 paste 내용 자체를 무시
    try {
      q.clipboard.addMatcher(Node.ELEMENT_NODE, () => new Delta());
      q.clipboard.addMatcher(Node.TEXT_NODE, () => new Delta());
    } catch (e) {
      // 일부 환경에서 Node 상수가 없을 수 있음 → 이벤트 차단으로 충분
    }

    // 2) DOM 이벤트를 캡처 단계에서 전파 차단
    const hardStop = e => {
      e.preventDefault();
      e.stopPropagation();
      // Quill 내부 핸들러까지 못 가게
      if (typeof e.stopImmediatePropagation === 'function') {
        e.stopImmediatePropagation();
      }
    };

    // 드롭 전용: 파일/텍스트 모두 차단 (이미지 여러 개 포함)
    const onDrop = e => {
      // 모든 드롭 차단
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'none';
      }
      hardStop(e);
    };

    const onDragOver = e => {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'none';
      }
      hardStop(e);
    };

    const onBeforeInput = e => {
      const t = e.inputType || '';
      if (t.includes('insertFromPaste') || t.includes('insertFromDrop')) {
        hardStop(e);
      }
    };

    const onPaste = e => hardStop(e);

    const onKeydown = e => {
      const k = e.key?.toLowerCase?.();
      if ((e.ctrlKey || e.metaKey) && ['v'].includes(k)) {
        hardStop(e);
      }
    };

    const onContext = e => {
      // 우클릭 메뉴 자체를 막고 싶으면 주석 해제
      // hardStop(e);
      // 우클릭 메뉴는 열리게 두되, 붙여넣기 동작은 paste 이벤트에서 막힌다.
    };

    // 캡처 단계(true)로 등록
    root.addEventListener('paste', onPaste, true);
    root.addEventListener('beforeinput', onBeforeInput, true);
    root.addEventListener('drop', onDrop, true);
    root.addEventListener('dragover', onDragOver, true);
    root.addEventListener('dragenter', hardStop, true);
    root.addEventListener('dragstart', hardStop, true);
    root.addEventListener('keydown', onKeydown, true);
    root.addEventListener('contextmenu', onContext, true);

    // 창 전체로 떨어지는 파일 드롭(탭 이동 방지)
    const stopWindow = e => {
      // 페이지가 파일 드롭으로 네비게이션 되는걸 방지
      e.preventDefault();
    };
    window.addEventListener('dragover', stopWindow);
    window.addEventListener('drop', stopWindow);

    // 힌트 속성
    root.setAttribute('dropzone', 'none');

    return () => {
      root.removeEventListener('paste', onPaste, true);
      root.removeEventListener('beforeinput', onBeforeInput, true);
      root.removeEventListener('drop', onDrop, true);
      root.removeEventListener('dragover', onDragOver, true);
      root.removeEventListener('dragenter', hardStop, true);
      root.removeEventListener('dragstart', hardStop, true);
      root.removeEventListener('keydown', onKeydown, true);
      root.removeEventListener('contextmenu', onContext, true);
      window.removeEventListener('dragover', stopWindow);
      window.removeEventListener('drop', stopWindow);
    };
  }, []);

  return (
    <div
      className={[
        'rt-editor rounded-md border bg-white',
        '[&_.ql-toolbar]:border-0 [&_.ql-container]:border-0',
        '[&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md',
        className,
      ].join(' ')}
    >
      <ReactQuill
        ref={quillRef}
        theme='snow'
        defaultValue={initialValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: 'auto' }}
      />
    </div>
  );
});

export default memo(RichEditorInner);
