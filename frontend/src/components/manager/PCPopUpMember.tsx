import React, { useState } from 'react';
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
  onSecondClick?: (
    position?: string,
    name?: string,
    isEmergency?: boolean,
  ) => void;
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
  const [inputValue1, setInputValue1] = React.useState('');
  const [inputValue2, setInputValue2] = React.useState('');

  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue1(e.target.value);
  };
  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue2(e.target.value);
  };

  const [emergency, setEmergency] = useState(false);
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="flex justify-center items-center h-screen"
      overlayClassName="fixed inset-0 w-full h-screen mx-auto bg-black/60 z-50 flex justify-center items-center"
    >
      <div
        className="flex flex-row justify-between px-12 items-center w-[774px] h72 pt-8 pb-8 mb-2.5 bg-[#fff] rounded-[8px] whitespace-pre-line "
        style={{ boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.05)' }}
      >
        <div className="flex flex-col gap-4 w-96 ">
          <p className=" text-3xl font-bold mb-2">{title}</p>

          <div className="flex flex-row gap-5 items-center">
            <p className="text-2xl font-bold">직책</p>
            <input
              className="w-70 h-12 p-5 bg-zinc-100 rounded-lg text-2xl font-bold "
              type="text"
              placeholder="직책을 입력하세요."
              value={inputValue1}
              onChange={handleInputChange1}
            />
          </div>
          <div className="flex flex-row gap-5 items-center">
            <p className="text-2xl font-bold">이름</p>
            <input
              className="w-70 h-12 p-5 bg-zinc-100 rounded-lg text-2xl font-bold "
              type="text"
              placeholder="이름을 입력하세요."
              value={inputValue2}
              onChange={handleInputChange2}
            />
          </div>
          <div>
            <div className="flex flex-row gap-5 items-center">
              <button
                className="flex flex-row gap-3 items-center"
                onClick={() => {
                  setEmergency(false);
                }}
              >
                <div
                  className={`w-6 h-6 ${emergency === false ? 'bg-[#86A6FF]' : 'bg-[#A3A3A3]'} rounded-full border-[#888888] border-1`}
                ></div>
                <p className="text-2xl font-bold">선출 단위</p>
              </button>
              <button
                className="flex flex-row gap-3 items-center"
                onClick={() => {
                  setEmergency(true);
                }}
              >
                <div
                  className={`w-6 h-6 ${emergency === true ? 'bg-[#86A6FF]' : 'bg-[#A3A3A3]'} rounded-full border-[#888888] border-1`}
                ></div>
                <p className="text-2xl font-bold">비대위 단위</p>
              </button>
            </div>
          </div>
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
                  onSecondClick?.(inputValue1, inputValue2, emergency);
                  setInputValue1('');
                  setInputValue2('');
                  setEmergency(false);
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
