import { useLocation, useNavigate } from 'react-router-dom';

import { useManagerRealtime } from '../../contexts/ManagerRealtimeContext';

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useManagerRealtime();

  const now = location.pathname.includes('attend')
    ? 'attend'
    : location.pathname.includes('agendalist')
      ? 'agendalist'
      : location.pathname.includes('member')
        ? 'member'
        : location.pathname.includes('result')
          ? 'result'
          : '';

  const commonBtnStyle =
    'w-[294px] h-16 text-2xl font-bold text-left py-3 px-4 transition-colors duration-200 cursor-pointer';

  return (
    <div className="fixed top-[80px] left-0 flex flex-col w-[294px] h-full py-[30px] bg-neutral-50 shadow-[4px_0px_4px_0px_rgba(0,0,0,0.05)]">
      <button
        className={`${commonBtnStyle} cursor-pointer ${
          now === 'attend'
            ? 'bg-zinc-400 text-white'
            : 'bg-transparent text-black hover:bg-zinc-100'
        }`}
        onClick={() => {
          navigate('/manager/attend');
        }}
      >
        출석 확인
      </button>
      <button
        className={`${commonBtnStyle} cursor-pointer ${
          now === 'agendalist'
            ? 'bg-zinc-400 text-white'
            : 'bg-transparent text-black hover:bg-zinc-100'
        }`}
        onClick={() => {
          navigate('/manager/agendalist');
        }}
      >
        의결
      </button>
      <button
        className={`${commonBtnStyle} ${
          now === 'member'
            ? 'bg-zinc-400 text-white'
            : 'bg-transparent text-black hover:bg-zinc-100'
        }`}
        onClick={() => {
          navigate('/manager/member');
        }}
      >
        명부 관리
      </button>
      <button
        className={`${commonBtnStyle} cursor-pointer ${
          now === 'result'
            ? 'bg-zinc-400 text-white'
            : 'bg-transparent text-black hover:bg-zinc-100'
        }`}
        onClick={() => {
          navigate('/manager/result');
        }}
      >
        의결 공개
      </button>
      <button
        className={`${commonBtnStyle} cursor-pointer ${
          now === 'result'
            ? 'bg-zinc-400 text-white'
            : 'bg-transparent text-black hover:bg-zinc-100'
        }`}
        onClick={() => {
          state !== 'VOTING' && navigate('/manager/setting');
        }}
      >
        회의 관리
      </button>
    </div>
  );
};

export default SideBar;
