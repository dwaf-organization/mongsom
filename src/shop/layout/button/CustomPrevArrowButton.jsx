import { LeftChevron } from '../../asset/icons';

export default function CustomPrevArrowButton({ className, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label='이전 슬라이드'
      className={`${className} hidden md:block`}
    >
      <LeftChevron />
    </button>
  );
}
