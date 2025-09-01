import { RightChevron } from '../../asset/icons';

export default function CustomNextArrowButton({ className, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label='다음 슬라이드'
      className={`${className}`}
    >
      <RightChevron />
    </button>
  );
}
