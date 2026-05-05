import { useManagerRealtime } from '../../contexts/ManagerRealtimeContext';
import Toggle from '../../components/Toggle';

const Setting = () => {
  const { state } = useManagerRealtime();

  return (
    <div className=" ml-[294px] flex flex-col w-[calc(100vw-294px)] ">
      <div className="fixed left-[294px] top-[80px] flex flex-col pt-10 pl-16 pb-5 w-full gap-6 bg-white">
        <div className="flex flex-row gap-4.5">
          {/* 상태표시 */}
          <div
            className={`w-[30px] h-[30px] rounded-full ${state === 'PROGRESS' ? 'bg-[#57AA5A]' : state === 'STOP' ? 'bg-[#F74040]' : 'bg-[#FBA650]'} `}
          ></div>
          <p
            className={`text-2xl font-bold ${state === 'PROGRESS' ? 'text-[#57AA5A]' : state === 'STOP' ? 'text-[#F74040]' : 'text-[#FBA650]'} `}
          >
            {state === 'PROGRESS'
              ? '회의 중'
              : state === 'STOP'
                ? '정회 중'
                : '의결 중'}
          </p>
        </div>
        {state === 'VOTING' && (
          <p className="text-xl font-bold text-gray-800">
            투표 중에는 조작할 수 없습니다.
          </p>
        )}
         
        {state !== 'VOTING' && (
          <div className="flex flex-row gap-3 items-center ">
            <p className="text-2xl font-bold">정회</p>
            <Toggle state={state} />
            <p className="text-2xl font-bold">개의/속개</p>
          </div>
        )}
      </div>{' '}
    </div>
  );
};

export default Setting;
