import React from 'react';
import { ArrowContainer, Popover } from 'react-tiny-popover';
import Button from '../Button';

type NumpadPopupProps = {
  setIsPopoverOpen: (val: string) => void;
  isPopoverOpen: string;
  rowIndex: number;
  colIndex: number;
  children: JSX.Element;
  onSelectNumber: (num: string, rowIdx: number, colIdx: number) => void;
};
const nineItems = Array.from(Array(9).keys());

const NumpadPopup: React.FC<NumpadPopupProps> = ({
  setIsPopoverOpen,
  isPopoverOpen,
  rowIndex,
  colIndex,
  onSelectNumber,
  children,
}) => {
  return (
    <Popover
      padding={5}
      onClickOutside={() => setIsPopoverOpen('')}
      isOpen={isPopoverOpen === String(rowIndex) + String(colIndex)}
      positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={'gray'}
          arrowSize={5}
          arrowStyle={{ opacity: 1 }}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          <div className="bg-white p-5 border-2 border-gray-500 border-solid grid grid-cols-3 gap-1 justify-center items-center">
            {nineItems.map((item) => (
              <Button
                key={item + 1}
                onClick={() =>
                  onSelectNumber(String(item + 1), rowIndex, colIndex)
                }
              >
                {item + 1}
              </Button>
            ))}
          </div>
        </ArrowContainer>
      )}
    >
      {children}
    </Popover>
  );
};

export default NumpadPopup;