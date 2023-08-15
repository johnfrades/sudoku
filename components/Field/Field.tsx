import React from 'react';

type InputProps = {
  value: string;
  disabled: boolean;
  hasError: boolean;
};

const Field: React.FC<InputProps> = ({ value, disabled, hasError }) => {
  const conditionalClass = disabled
    ? 'cursor-not-allowed bg-amber-200'
    : 'bg-white cursor-pointer hover:bg-green-100';

  const hasErrorClass = hasError ? 'border-4 border-solid border-red-500' : '';
  return (
    <div
      className={`select-none border flex items-center m-auto justify-center w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 text-sm sm:text-lg md:text-2xl ${conditionalClass} ${hasErrorClass}`}
    >
      {value}
    </div>
  );
};

export default Field;
