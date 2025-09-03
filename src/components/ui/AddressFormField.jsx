export default function AddressFormField({
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
      className={`flex flex-col items-start gap-2 w-full${className}`}
    >
      <span className='text-left text-lg '>
        {label}
        {required && <span className='text-red-500'>*</span>}
      </span>
      {children || (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className='border border-gray-400 rounded-md p-2  w-full focus:outline-primary-200'
        />
      )}
    </label>
  );
}
