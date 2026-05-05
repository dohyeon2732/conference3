import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 px-10 flex flex-row w-screen h-[80px] px-4 bg-white items-center justify-between shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] z-[9999]">
      <div className="flex flex-row gap-4 ">
        <p className="text-3xl font-bold">전체학생대표자회의 운영 시스템</p>
        <p className="text-3xl font-medium">- 관리자 모드</p>
      </div>
      <button
        className="w-32 h-12 bg-[#86A6FF] rounded-lg text-white text-2xl font-bold"
        onClick={() => navigate('/')}
      >
        나가기
      </button>
    </div>
  );
};

export default TopBar;
