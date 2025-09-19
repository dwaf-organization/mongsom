// src/admin/components/ui/RichEditor.jsx
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'quill/dist/quill.snow.css';

/**
 * 비제어형 에디터: defaultValue만 사용. 깜빡임 방지.
 * ref로 getHTML/getText/insertImage 제공.
 */
const RichEditor = forwardRef(function RichEditor(
  {
    value = '', // 초기 HTML (mount 시 1회만 반영)
    onChange, // 필요하면 콜백만 호출 (state 연결 금지)
    variant = 'full',
    onUploadImage, // (file) => Promise<url>
    onUploadFile, // (file) => Promise<url>
    onUploadVideo, // (file) => Promise<url>
    maxChars,
    placeholder = '내용을 입력하세요…',
    minHeight = 240,
    className = '',
  },
  ref,
) {
  const quillRef = useRef(null);

  // 외부에서 HTML을 읽을 수 있도록 노출
  useImperativeHandle(ref, () => ({
    getHTML: () => quillRef.current?.getEditor()?.root?.innerHTML ?? '',
    getText: () => quillRef.current?.getEditor()?.getText() ?? '',
    insertImage: url => {
      const quill = quillRef.current?.getEditor();
      if (!quill || !url) return;
      const range = quill.getSelection(true) || {
        index: quill.getLength(),
        length: 0,
      };
      quill.insertEmbed(range.index, 'image', url, 'user');
      quill.setSelection(range.index + 1);
    },
  }));

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

  const toolbarContainer = useMemo(() => {
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
        ['link', ...(onUploadImage ? ['image'] : [])],
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
        ...(onUploadImage ? ['image'] : []),
        ...(onUploadVideo ? ['video'] : []),
        ...(onUploadFile ? ['file'] : []),
      ],
      ['clean'],
    ];
  }, [variant, onUploadImage, onUploadVideo, onUploadFile]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolbarContainer,
        handlers: {
          image: function () {
            if (!onUploadImage) return;
            pickFile('image/*', async file => {
              try {
                const url = await onUploadImage(file);
                if (!url) return;
                const quill = quillRef.current?.getEditor();
                const range = quill.getSelection(true) || {
                  index: quill.getLength(),
                  length: 0,
                };
                quill.insertEmbed(range.index, 'image', url, 'user');
                quill.setSelection(range.index + 1);
              } catch (e) {
                console.error('이미지 업로드 실패:', e);
              }
            });
          },
          video: function () {
            if (!onUploadVideo) return;
            pickFile('video/*', async file => {
              try {
                const url = await onUploadVideo(file);
                if (!url) return;
                const quill = quillRef.current?.getEditor();
                const range = quill.getSelection(true) || {
                  index: quill.getLength(),
                  length: 0,
                };
                quill.insertEmbed(range.index, 'video', url, 'user');
                quill.setSelection(range.index + 1);
              } catch (e) {
                console.error('비디오 업로드 실패:', e);
              }
            });
          },
          file: function () {
            if (!onUploadFile) return;
            pickFile('', async file => {
              try {
                const url = await onUploadFile(file);
                if (!url) return;
                const quill = quillRef.current?.getEditor();
                const range = quill.getSelection(true) || {
                  index: quill.getLength(),
                  length: 0,
                };
                const text = file.name;
                quill.insertText(range.index, text, 'link', url, 'user');
                quill.setSelection(range.index + text.length);
              } catch (e) {
                console.error('파일 업로드 실패:', e);
              }
            });
          },
        },
      },
    }),
    [toolbarContainer, onUploadImage, onUploadVideo, onUploadFile],
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

  const handleChange = (html, _delta, _source, editor) => {
    if (maxChars) {
      const textLen = editor.getText().replace(/\n$/, '').length;
      if (textLen > maxChars) {
        const quill = quillRef.current?.getEditor();
        quill.deleteText(maxChars, textLen);
        return;
      }
    }
    // 외부 상태를 굳이 갱신할 필요는 없지만, 콜백은 열어둔다
    onChange?.(html);
  };

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
      // wrapper 높이는 auto, 실제 편집 영역 minHeight만 보장
      style={{ height: 'auto' }}
    >
      <ReactQuill
        ref={quillRef}
        theme='snow'
        defaultValue={value} // ✅ 비제어형: 최초 1회만 반영
        onChange={handleChange} // ✅ 콜백만, 상태 연결 금지
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      {/* 편집 영역만 최소 높이 적용 */}
      <style>{`.rt-editor .ql-editor { min-height: ${minH}; }`}</style>
    </div>
  );
});

export default RichEditor;
