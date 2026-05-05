import React from 'react';
import PCPopupButton from '../button/PCPopupButton';
import ReactModal from 'react-modal';

interface PopUpCardProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: React.ReactNode;
  descript: React.ReactNode;
  first?: string;
  second?: string;
  onFirstClick?: () => void;
  onSecondClick?: (inputValue?: string) => void;
}

const PCPopUp = ({
  isOpen,
  onRequestClose,
  title,
  first,
  second,
  onFirstClick,
  onSecondClick,
}: PopUpCardProps) => {
  const [inputValue, setInputValue] = React.useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="flex justify-center items-center h-screen"
      overlayClassName="fixed inset-0 w-full h-screen mx-auto bg-black/60 z-50 flex justify-center items-center"
    >
      <div
        className="flex flex-row justify-between px-12 items-center w-[774px] h-52 pt-8 pb-8 mb-2.5 bg-[#fff] rounded-[8px] whitespace-pre-line "
        style={{ boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.05)' }}
      >
        <div className="flex flex-col gap-2 w-96">
          <p className=" text-3xl font-bold">{title}</p>
          <input
            className="w-100 h-12 p-5 bg-zinc-100 rounded-lg text-2xl font-bold "
            type="text"
            placeholder="단위를 입력하세요."
            value={inputValue}
            onChange={handleInputChange}
          />{' '}
        </div>

        {(first || second) && (
          <div
            className={`flex flex-col gap-2.5 items-center mt-4 ${first && second ? 'justify-between' : 'justify-center'}`}
          >
            {first && (
              <PCPopupButton
                text={first}
                color="gray"
                onClick={() => {
                  onFirstClick?.();
                }}
              />
            )}

            {second && (
              <PCPopupButton
                color="blue"
                text={second}
                onClick={() => {
                  onSecondClick?.(inputValue);
                  setInputValue('');
                }}
              />
            )}
          </div>
        )}
      </div>
    </ReactModal>
  );
};

export default PCPopUp;
