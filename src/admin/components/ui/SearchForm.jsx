import { Button } from './button';

const SearchForm = ({
  children,
  onSubmit,
  submitButtonText = '조회',
  submitButtonClassName = 'w-fit py-3 px-8 mt-4',
  className = '',
}) => {
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};

    // FormData를 객체로 변환
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    onSubmit?.(data);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className='rounded-lg border border-gray-400'>{children}</div>

      <div className='flex justify-center'>
        <Button type='submit' className={submitButtonClassName}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
