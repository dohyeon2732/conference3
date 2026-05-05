interface BlueButtonProps {
  text: string;
  color: string;
  onClick?: () => void;
}

const BlueButton = ({ text, color, onClick }: BlueButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-88.25 h-[50px] text-white ${color === 'blue' ? '!bg-[#86A6FF]' : '!bg-gray-400'} rounded-lg `}
    >
      <p className="text-xl font-bold">{text}</p>
    </button>
  );
};

export default BlueButton;
