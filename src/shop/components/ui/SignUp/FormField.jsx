export default function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  children,
  className = '',
  required,
  error,
  message,
  value,
  onChange,
}) {
  return (
    <div className={`flex flex-col gap-2 border-b border-gray-400 pb-6`}>
      <label htmlFor={id} className='flex items-center gap-20'>
        <span className='min-w-[90px] text-left'>
          {label}
          {required && <span className='text-red-500'>*</span>}
        </span>
        {children || (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange}
            className={`border rounded-md p-3 max-w-[500px] w-full focus:outline-primary-200 ${
              error ? 'border-red-500' : 'border-gray-400'
            }${className}`}
          />
        )}
      </label>
      <span className='text-left pl-[170px] text-sm text-gray-500'>
        {message}
      </span>
      {error && <p className='text-red-500 text-xs ml-[110px]'>{error}</p>}
    </div>
  );
}
