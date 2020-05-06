import React from 'react';

interface IProps {
  side: 'left' | 'right';
}

const Separator = (props: IProps) => {

  const classes = props.side == 'left' ?
    'mr-10 right-0 xl:left-0' :
    'ml-10 xl:right-0';

  return (
    <svg viewBox="0 0 1235 25" xmlns="http://www.w3.org/2000/svg"
      height="25"
      className={`absolute ${classes}`}>
      { props.side == 'left' ?
      <path fill-rule="evenodd" clip-rule="evenodd" d="M-928 0H1182.9L1235 25H-928V0Z" fill="#003471"/> :
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2162 0H52.0713L0 25H2162V0Z" fill="#003471"/> }
    </svg>
  )
}

export default Separator;
