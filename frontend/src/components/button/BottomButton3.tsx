interface BlueButtonProps {
  text1: string;
  color1: string;
  onClick1?: () => void;
  text2: string;
  color2: string;
  onClick2?: () => void;
  text3: string;
  color3: string;
  onClick3?: () => void;
}

const BottomButton = ({
  text1,
  color1,
  onClick1,
  text2,
  color2,
  onClick2,
  text3,
  color3,
  onClick3,
}: BlueButtonProps) => {
  return (
    <div className="w-[393px] flex justify-center items-center">
      <button
        className={`w-88.25 h-[50px] fixed bottom-36 font-bold ${color1 === 'blue' ? 'bg-[#86A6FF] text-white' : color1 === 'lightblue' ? 'bg-[#D9E3FF] text-[#1A49CB]' : color1 === 'red' ? 'bg-[#FFA193] text-white' : 'bg-gray-400 text-white'}  rounded-lg `}
        onClick={onClick1}
      >
        <p className="text-xl font-bold">{text1}</p>
      </button>
      <button
        className={`w-88.25 h-[50px] fixed bottom-20.5 font-bold ${color2 === 'blue' ? 'bg-[#86A6FF] text-white' : color2 === 'lightblue' ? 'bg-[#D9E3FF] text-[#1A49CB]' : color2 === 'red' ? 'bg-[#FFA193] text-white' : 'bg-gray-400 text-white'}  rounded-lg `}
        onClick={onClick2}
      >
        <p className="text-xl font-bold">{text2}</p>
      </button>

      <button
        className={`w-88.25 h-[50px] fixed bottom-5 font-bold ${color3 === 'blue' ? 'bg-[#86A6FF] text-white' : color3 === 'lightblue' ? 'bg-[#D9E3FF] text-[#1A49CB]' : color3 === 'red' ? 'bg-[#FFA193] text-white' : 'bg-gray-400 text-white'}  rounded-lg `}
        onClick={onClick3}
      >
        <p className="text-xl font-bold">{text3}</p>
      </button>
    </div>
  );
};

export default BottomButton;
