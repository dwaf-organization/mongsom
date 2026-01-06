import { updateAllCheckStatus } from '../../../api/cart/index';
import { useAuth } from '../../../context/AuthContext';
import CheckBox from '../../ui/CheckBox';

export default function AllCheckBoxSection({ allChecked, onAllCheckChange, refreshCart }) {
  const { userCode } = useAuth();

  const handleAllCheckChange = async checked => {
    if (onAllCheckChange) onAllCheckChange(checked);
    const response = await updateAllCheckStatus(userCode, checked ? 1 : 0);
    console.log('🚀 ~ handleAllCheckChange ~ response:', response);
    if (response?.code === 1 && refreshCart) {
      await refreshCart();
    }
  };
  return (
    <div className='flex items-center justify-end gap-2 cursor-pointer py-6 text-gray-600 md:px-6'>
      <span className='text-sm font-medium'>전체 선택</span>
      <CheckBox
        checked={allChecked}
        onChange={handleAllCheckChange}
        id='all-checkbox'
      />
    </div>
  );
}
