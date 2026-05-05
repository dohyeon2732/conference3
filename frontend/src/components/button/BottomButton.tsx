interface BlueButtonProps {
  text1: string;
  color1: string;
  onClick1?: () => void;
  text2: string;
  color2: string;
  onClick2?: () => void;
}

const BottomButton = ({
  text1,
  color1,
  onClick1,
  text2,
  color2,
  onClick2,
}: BlueButtonProps) => {
  return (
    <div className="w-[393px] flex justify-center items-center">
      <button
        className={`w-88.25 h-[50px] fixed bottom-20.5 font-bold ${color1 === 'blue' ? 'bg-[#86A6FF] text-white' : color1 === 'lightblue' ? 'bg-[#D9E3FF] text-[#1A49CB]' : color1 === 'red' ? 'bg-[#FFA193] text-white' : 'bg-gray-400 text-white'}  rounded-lg `}
        onClick={onClick1}
      >
        <p className="text-xl font-bold">{text1}</p>
      </button>

      <button
        className={`w-88.25 h-[50px] fixed bottom-5 font-bold ${color2 === 'blue' ? 'bg-[#86A6FF] text-white' : color2 === 'lightblue' ? 'bg-[#D9E3FF] text-[#1A49CB]' : color2 === 'red' ? 'bg-[#FFA193] text-white' : 'bg-gray-400 text-white'}  rounded-lg `}
        onClick={onClick2}
      >
        <p className="text-xl font-bold">{text2}</p>
      </button>
    </div>
  );
};

export default BottomButton;
