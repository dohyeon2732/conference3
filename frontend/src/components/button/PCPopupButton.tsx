interface BlueButtonProps {
  text: string;
  color: string;
  onClick: () => void;
}

const PCBlueButton = ({ text, color, onClick }: BlueButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-[160px] h-[50px] text-white ${
        color === 'blue'
          ? '!bg-[#86A6FF]'
          : color === 'red'
            ? 'bg-[#FFA193]'
            : '!bg-gray-400'
      } rounded-lg `}
    >
      <p className="text-2xl font-bold">{text}</p>
    </button>
  );
};

export default PCBlueButton;
