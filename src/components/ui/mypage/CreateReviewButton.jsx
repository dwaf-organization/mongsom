import { Link } from 'react-router-dom';

export default function CreateReviewButton({ id }) {
  return (
    <Link to={`/create-review/${id}`}>
      <button className='border border-primary-200 text-primary-200 rounded-lg px-6 py-1 self-center'>
        리뷰 작성
      </button>
    </Link>
  );
}
