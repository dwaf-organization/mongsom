export default function CheckBox({ checked = false, onChange, id }) {
  const handleCheckboxChange = () => {
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <>
      <div className='relative w-5 h-5'>
        <input
          id={id || 'custom-checkbox'}
          name='productchecked'
          type='checkbox'
          checked={checked}
          onChange={handleCheckboxChange}
          className='w-full h-full appearance-none border border-primary-200 rounded 
          checked:bg-primary-200 checked:border-transparent active:border-black
          cursor-pointer relative'
        />
        {checked && (
          <svg
            className='absolute inset-0 w-full h-full pointer-events-none'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              fill='white'
            />
          </svg>
        )}
      </div>
    </>
  );
}
