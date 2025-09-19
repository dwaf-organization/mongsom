import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = '선택해주세요',
  className = '',
  disabled = false,
  hidden = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(option => option.value === value) || null,
  );
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const option = options.find(option => option.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  const handleSelect = option => {
    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  if (hidden) return null;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type='button'
        onClick={toggleOpen}
        disabled={disabled}
        className={`
          w-full px-3 py-1 text-left text-sm border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500
          hover:border-gray-400 transition-colors duration-200
          ${disabled ? ' text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
          ${selectedOption ? 'text-gray-900' : 'text-gray-500'}
          flex items-center justify-between
        `}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
      >
        <span className='block truncate flex-1'>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className='flex items-center justify-center ml-2'>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto'>
          {options.length === 0 ? (
            <div className='px-4 py-3 text-gray-500 text-center'>
              옵션이 없습니다
            </div>
          ) : (
            <ul className='py-1' role='listbox'>
              {options.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`
                    px-4 py-3 cursor-pointer transition-colors duration-150 hover:text-primary-200 text-xs text-left
                    ${selectedOption?.value === option.value ? ' text-primary-700' : 'text-gray-900'}
                    ${index === 0 ? 'rounded-t-lg' : ''}
                    ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                  `}
                  role='option'
                  aria-selected={selectedOption?.value === option.value}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
