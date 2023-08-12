import React from 'react';

type InputProps = {
  value: string;
  disabled: boolean;
};

const Field: React.FC<InputProps> = ({ value, disabled }) => {
  const conditionalClass = disabled
    ? 'cursor-not-allowed bg-amber-200'
    : 'bg-white cursor-pointer hover:bg-green-100';
  return (
    <div
      className={`border flex items-center justify-center w-14 h-14 md:w-20 md:h-20 text-lg md:text-2xl ${conditionalClass}`}
    >
      {value}
    </div>
  );
};

export default Field;
