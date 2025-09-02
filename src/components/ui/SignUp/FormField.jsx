export default function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  children,
  className = '',
  required,
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-20 border-b border-gray-400 pb-6 ${className}`}
    >
      <span className='min-w-[90px] text-left'>
        {label}
        {required && <span className='text-red-500'>*</span>}
      </span>
      {children || (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className='border border-gray-400 rounded-md p-2 max-w-[500px] w-full focus:outline-primary-200'
        />
      )}
    </label>
  );
}
