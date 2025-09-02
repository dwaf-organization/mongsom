import { Button } from './button';

export default function DeleteConfirmModal({ itemCount, onConfirm, onCancel }) {
  return (
    <div className='space-y-4'>
      <p className='text-gray-700'>
        선택된 <span className='font-semibold'>{itemCount}개</span> 상품을
        삭제하시겠습니까?
      </p>
      <div className='flex justify-end gap-3'>
        <Button variant='outline' onClick={onCancel}>
          취소
        </Button>
        <Button onClick={onConfirm}>삭제</Button>
      </div>
    </div>
  );
}
