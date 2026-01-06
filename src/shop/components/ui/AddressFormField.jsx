export default function AddressFormField({
  id,
  label,
  type = 'text',
  placeholder,
  children,
  className = '',
  required,
  value,
  onChange,
  error,
  readOnly = false,
}) {
  return (
    <label
      htmlFor={id}
      className={`flex flex-col items-start gap-2 w-full${className}`}
    >
      <span className='text-left '>
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
          readOnly={readOnly}
          className={`border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200 ${
            readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        />
      )}
      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </label>
  );
}
