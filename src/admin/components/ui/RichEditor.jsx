// src/components/RichEditor.jsx
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new'; // React 19 호환 포크
import 'quill/dist/quill.snow.css';

const RichEditor = forwardRef(function RichEditor(
  {
    value,
    onChange,
    variant = 'full',
    onUploadImage,
    onUploadFile,
    onUploadVideo,
    maxChars,
    placeholder = '내용을 입력하세요…',
    minHeight = 240, // 숫자(px) 또는 '480px' 문자열 모두 허용
    className = '',
  },
  ref,
) {
  const quillRef = useRef(null);

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
              const url = await onUploadImage(file);
              const quill = quillRef.current?.getEditor();
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', url, 'user');
              quill.setSelection(range.index + 1);
            });
          },
          video: function () {
            if (!onUploadVideo) return;
            pickFile('video/*', async file => {
              const url = await onUploadVideo(file);
              const quill = quillRef.current?.getEditor();
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'video', url, 'user');
              quill.setSelection(range.index + 1);
            });
          },
          file: function () {
            if (!onUploadFile) return;
            pickFile('', async file => {
              const url = await onUploadFile(file);
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
    onChange?.(html);
  };

  // CSS 변수 값 만들기
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
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: 'auto' }}
      />
    </div>
  );
});

export default RichEditor;
