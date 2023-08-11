import React from 'react';

type InputProps = {
  value: string;
  disabled: boolean;
};

const Input: React.FC<InputProps> = ({ value, disabled }) => {
  return (
    <input
      disabled={disabled}
      value={value}
      type="text"
      maxLength={1}
      className="border w-14 h-14 md:w-20 md:h-20 text-center text-lg md:text-2xl disabled:bg-amber-200"
    />
  );
};

export default Input;
