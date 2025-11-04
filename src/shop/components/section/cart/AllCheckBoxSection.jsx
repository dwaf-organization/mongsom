import CheckBox from '../../ui/CheckBox';

export default function AllCheckBoxSection({ allChecked, onAllCheckChange }) {
  return (
    <div className='flex items-center justify-end gap-2 cursor-pointer py-6 text-gray-600 md:px-6'>
      <span className='text-sm font-medium'>전체 선택</span>
      <CheckBox
        checked={allChecked}
        onChange={onAllCheckChange}
        id='all-checkbox'
      />
    </div>
  );
}
