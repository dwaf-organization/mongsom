export default function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  children,
  className = '',
  required = false,
  error,
  message,
  value, // 제어모드 값 (옵션)
  defaultValue, // 비제어 초기값 (옵션)
  onChange,
  readOnly, // 강제 읽기전용 (옵션)
  ...rest
}) {
  const hasChildren = !!children;
  const isControlled = value !== undefined;

  return (
    <div className='flex flex-col gap-2 border-b border-gray-400 pb-6'>
      <label htmlFor={id} className='flex items-center gap-10 md:gap-20'>
        <span className='min-w-[90px] text-left'>
          {label}
          {required && <span className='text-red-500'>*</span>}
        </span>

        {hasChildren ? (
          <div className='w-full max-w-[500px]'>{children}</div>
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            // 제어/비제어 모드 분기
            {...(isControlled
              ? {
                  value,
                  onChange,
                  readOnly: readOnly || typeof onChange !== 'function',
                }
              : { defaultValue })}
            required={required}
            aria-invalid={!!error}
            className={`border rounded-md p-3 max-w-[500px] w-full focus:outline-primary-200 ${
              error ? 'border-red-500' : 'border-gray-400'
            } ${className}`}
            {...rest}
          />
        )}
      </label>

      {message && (
        <span className='text-left pl-[130px] md:pl-[170px] text-sm md:text-sm text-gray-500'>
          {message}
        </span>
      )}
      {error && <p className='text-red-500 text-xs ml-[110px]'>{error}</p>}
    </div>
  );
}
