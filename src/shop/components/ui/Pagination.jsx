import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

import { LeftChevron, RightChevron } from '../../asset/icons';

export default function Pagination({ totalPage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const rawPage = Number(searchParams.get('page'));
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const GROUP_SIZE = 4;
  const currentGroup = Math.floor((currentPage - 1) / GROUP_SIZE);

  const getPageGroup = (currentPage, totalPage, groupSize) => {
    const currentGroup = Math.floor((currentPage - 1) / groupSize);
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPage);

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
              disabled={currentPage === 1}
              onClick={() =>
                handleChangePage(Math.max(1, currentGroup * GROUP_SIZE))
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
              {page}
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
                  handleChangePage(
                    Math.ceil(currentPage / GROUP_SIZE) * GROUP_SIZE + 1,
                  );
                } else {
                  handleChangePage(totalPage);
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
