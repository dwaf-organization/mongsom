function MyPage() {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10 13.75H14C17.4448 13.75 20.25 16.5552 20.25 20V20.25H3.75V20C3.75 16.5551 6.55428 13.75 10 13.75ZM12 2.75C14.0668 2.75 15.75 4.43321 15.75 6.5C15.75 8.56679 14.0668 10.25 12 10.25C9.93321 10.25 8.25 8.56679 8.25 6.5C8.25 4.43321 9.93321 2.75 12 2.75Z'
        stroke='#666666'
        stroke-width='1.5'
      />
    </svg>
  );
}

function ActiveMyPage() {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M7.5 6.5C7.5 8.981 9.519 11 12 11C14.481 11 16.5 8.981 16.5 6.5C16.5 4.019 14.481 2 12 2C9.519 2 7.5 4.019 7.5 6.5ZM20 21H21V20C21 16.141 17.859 13 14 13H10C6.14 13 3 16.141 3 20V21H20Z'
        fill='#3A3A3A'
      />
    </svg>
  );
}

export { MyPage, ActiveMyPage };
