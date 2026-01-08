import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

import LeftChevron from '../../assets/icons/LeftChevron';
import RightChevron from '../../assets/icons/RightChevron';

export default function Pagination({
  totalPage,
  currentPage: propCurrentPage,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const rawPage = Number(searchParams.get('page'));
  const currentPage =
    propCurrentPage ?? (isNaN(rawPage) || rawPage < 0 ? 0 : rawPage);

  const GROUP_SIZE = 4;
  const currentGroup = Math.floor(currentPage / GROUP_SIZE);

  const getPageGroup = (currentPage, totalPage, groupSize) => {
    const currentGroup = Math.floor(currentPage / groupSize);
    const startPage = currentGroup * groupSize;
    const endPage = Math.min(startPage + groupSize - 1, totalPage - 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  const pageNumbers =
    totalPage === 0 ? [] : getPageGroup(currentPage, totalPage, GROUP_SIZE);
  const hasNextGroup = (currentGroup + 1) * GROUP_SIZE < totalPage;
  const hasPrevGroup = currentGroup > 0;

  const handleChangePage = newPage => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <nav className='py-10'>
      <ul className='flex items-center justify-center gap-2'>
        {hasPrevGroup && (
          <li>
            <button
              type='button'
              className='flex items-center justify-center hover:bg-gray-100 disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed'
              disabled={currentPage === 0}
              onClick={() =>
                handleChangePage(Math.max(0, currentGroup * GROUP_SIZE - 1))
              }
            >
              <LeftChevron className='w-6 h-6' />
            </button>
          </li>
        )}

        {totalPage === 0 && (
          <li>
            <button
              type='button'
              className=' flex items-center justify-center bg-gray-300 text-gray-500 font-medium cursor-not-allowed'
              disabled
            >
              1
            </button>
          </li>
        )}

        {pageNumbers.map(page => (
          <li key={page}>
            <button
              type='button'
              className={`flex items-center justify-center font-medium ${
                currentPage === page
                  ? ' text-primary-200 px-2'
                  : 'bg-white text-gray-800 hover:text-primary-200 px-2'
              }`}
              onClick={() => handleChangePage(page)}
            >
              {page + 1}
            </button>
          </li>
        ))}

        {hasNextGroup && (
          <li>
            <button
              type='button'
              className='flex items-center justify-center hover:bg-gray-100 disabled:bg-gray-300 disabled:text-black disabled:cursor-not-allowed disabled:border-gray-500'
              disabled={!hasNextGroup}
              onClick={() => {
                if (hasNextGroup) {
                  handleChangePage((currentGroup + 1) * GROUP_SIZE);
                } else {
                  handleChangePage(totalPage - 1);
                }
              }}
            >
              <RightChevron className='w-6 h-6' />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
