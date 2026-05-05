import BackButton from '../assets/icons/BackButton.svg';
import { useNavigate } from 'react-router-dom';

interface MobileTopBarProps {
  dept: string;
  name: string;
  title: string;
  back?: boolean;
  buttonOn?: boolean;
}

const MobileTopBar = ({
  dept,
  name,
  title,
  back,
  buttonOn,
}: MobileTopBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed  top-0 z-9999 flex flex-row justify-between items-center w-[393px] h-20 bg-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.05)]">
      <button
        className={`${back ? '' : 'invisible'} `}
        onClick={() => navigate('/home')}
      >
        <img src={BackButton} alt="back" />
      </button>
      <div className="flex flex-col justify-center items-center">
        <button
          className={`flex flex-row gap-2 ${buttonOn ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => {
            buttonOn ? navigate('/password') : '';
          }}
        >
          <p className="text-base font-medium">{dept}</p>
          <p className="text-base font-bold">{name}</p>
        </button>
        <p className=" text-xl font-bold">{title}</p>
      </div>
      <button className="invisible">
        <img src={BackButton} alt="" />
      </button>
    </div>
  );
};

export default MobileTopBar;
