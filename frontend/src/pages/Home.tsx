import { useEffect, useRef, useState } from 'react';
import MobileTopBar from '../components/MobileTopBar';
import { useUserApi } from '../hooks/useUserApi';
import { useUserRealtime } from '../contexts/UserRealtimeContext';
import { useAgendaApi } from '../hooks/useAgendaApi';
import { useVoteApi } from '../hooks/useVoteApi';
import { useAttendanceApi } from '../hooks/useAttendanceApi';

type VoteValue = 'AGREE' | 'DISAGREE' | 'ABSTAIN' | null;
type SelectedVoteValue = Exclude<VoteValue, null>;

const Home = () => {
  const { state, myAttendance, currentAgendaId } = useUserRealtime();

  useEffect(() => {
    document.body.className = 'mobile';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const [bidae, setBidae] = useState(false);

  const [opinion, setOpinion] = useState<VoteValue | null>(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [agendaName, setAgendaName] = useState('');
  const [userName, setUserName] = useState('');
  const [userDept, setUserDept] = useState('');
  const [userId, setUserId] = useState(0);
  const [attendanceId, setAttendanceId] = useState(0);
  const voteRequestLockRef = useRef(false);
  const lastVoteClickRef = useRef<{
    voteValue: SelectedVoteValue;
    clickedAt: number;
  } | null>(null);

  useEffect(() => {
    {
      const fetchMe = async () => {
        try {
          const res = await useUserApi.me();
          setUserName(res.data.userName);
          setUserDept(res.data.deptName);
          setUserId(res.data.userId);
        } catch (e) {
          console.error('내 정보 조회 실패', e);
        }
      };
      fetchMe();
    }
  }, []);

  useEffect(() => {
    const fetchMyVote = async () => {
      if (currentAgendaId === null || currentAgendaId === 0 || userId === 0)
        return;

      try {
        const res = await useAttendanceApi.findByAgendaIdUserId({
          agendaId: currentAgendaId,
          userId: userId,
        });
        setAttendanceId(res.data.attendanceId);
        setOpinion(res.data.voteValue ?? null);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMyVote();
  }, [currentAgendaId, userId]);

  useEffect(() => {
    setAttendanceId(0);
    setOpinion(null);
  }, [currentAgendaId]);

  useEffect(() => {
    const fetchAgenda = async () => {
      if (currentAgendaId === null || currentAgendaId === 0) return;
      try {
        const res = await useAgendaApi.findById({ agendaId: currentAgendaId });
        setAgendaName(res.data.agendaName);
      } catch (e) {
        console.error('의결 안건 조회 실패', e);
      }
    };
    fetchAgenda();
  }, [currentAgendaId]);

  useEffect(() => {
    {
      const bidaeCheck = async () => {
        try {
          const res = await useUserApi.me();
          setBidae(res.data.emergency);
        } catch (e) {
          console.error('비대위 여부 조회 실패', e);
        }
      };
      bidaeCheck();
    }
  }, [userId]);

  const handleVote = async (voteValue: SelectedVoteValue) => {
    const now = Date.now();
    const lastVoteClick = lastVoteClickRef.current;

    if (
      lastVoteClick?.voteValue === voteValue &&
      now - lastVoteClick.clickedAt < 350
    ) {
      return;
    }

    lastVoteClickRef.current = { voteValue, clickedAt: now };

    if (state !== 'VOTING' || voteRequestLockRef.current) return;

    const previousOpinion = opinion;
    const nextOpinion = previousOpinion === voteValue ? null : voteValue;

    voteRequestLockRef.current = true;
    setOpinion(nextOpinion);
    setIsSubmittingVote(true);

    try {
      if (nextOpinion === null) {
        try {
          await useVoteApi.cancelCast();
        } catch (cancelError) {
          throw cancelError;
        }
      } else {
        try {
          await useVoteApi.cast({ voteValue: nextOpinion });
        } catch (castError) {
          if (!attendanceId) {
            throw castError;
          }
          await useVoteApi.make({ attendanceId, voteValue: nextOpinion });
        }
      }
    } catch (e) {
      setOpinion(previousOpinion);
      console.error(e);
    } finally {
      voteRequestLockRef.current = false;
      setIsSubmittingVote(false);
    }
  };

  return (
    <div className="w-full max-w-[393px] h-[100dvh] mx-auto flex flex-col items-center overflow-hidden pt-[128px] pb-3">
      <MobileTopBar
        buttonOn={true}
        dept={userDept}
        name={userName}
        title="2026학년도 하반기 정기 전체학생대표자회의"
        back={false}
      />

      {/* 상태 창 */}
      <div className="fixed top-[92px] w-[calc(100%-40px)] max-w-[353px] flex flex-row gap-3 justify-end items-center">
        <div className="flex flex-row gap-2 justify-center items-center text-center">
          <div
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${state === 'PROGRESS' ? 'bg-[#57AA5A]' : state === 'STOP' ? 'bg-[#F74040]' : 'bg-[#FBA650]'}`}
          ></div>
          <p
            className={`text-lg sm:text-xl font-bold ${state === 'PROGRESS' ? 'text-[#57AA5A]' : state === 'STOP' ? 'text-[#F74040]' : 'text-[#FBA650]'}`}
          >
            {state === 'PROGRESS' ? '개의' : state === 'STOP' ? '정회' : '의결'}
          </p>
        </div>
        <div className="flex flex-row gap-2 ">
          <div
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${myAttendance ? 'bg-[#57AA5A]' : 'bg-[#F74040]'}`}
          ></div>
          <p
            className={`text-lg sm:text-xl font-bold ${myAttendance ? 'text-[#57AA5A]' : 'text-[#F74040]'}`}
          >
            {myAttendance ? '참석' : '불참'}
          </p>
        </div>
      </div>

      {/* 의결 중 */}
      {bidae && (
        <div className="flex flex-1 min-h-0 flex-col justify-center items-center w-[calc(100%-40px)] max-w-[353px] gap-5 text-center">
          <p className="flex justify-center items-center text-neutral-400 text-2xl font-semibold">
            비대위 단위는 의결권이 없습니다.
          </p>
        </div>
      )}

      {/* 불참 */}
      {!bidae && !myAttendance && (
        <div className="flex flex-1 min-h-0 flex-col justify-center items-center w-[calc(100%-40px)] max-w-[353px] gap-5 text-center">
          <p className="flex justify-center items-center text-neutral-400 text-xl font-semibold">
            회의 불참 상태입니다. <br /> 회의에 참석한 후 의결에 참여해주세요.
          </p>
        </div>
      )}

      {/* 의결 준비중 */}
      {!bidae && state === 'PROGRESS' && myAttendance && (
        <div className="flex flex-1 min-h-0 flex-col justify-center items-center w-[calc(100%-40px)] max-w-[353px] gap-5 text-center">
          <p className="flex justify-center items-center text-neutral-400 text-2xl font-semibold">
            {' '}
            의결 준비 중
          </p>
        </div>
      )}

      {/* 의결 중 */}
      {!bidae && state === 'VOTING' && myAttendance && (
        <div className="flex flex-1 min-h-0 flex-col justify-center items-center w-[calc(100%-40px)] max-w-[353px] gap-4">
          <div className="flex flex-col gap-2 justify-center items-center text-center">
            <p className="text-xl sm:text-2xl font-semibold">의결</p>
            <p className="text-lg sm:text-xl font-semibold leading-tight break-keep">
              {agendaName}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 w-full">
            <button
              onClick={() => {
                handleVote('AGREE');
              }}
              disabled={isSubmittingVote || !attendanceId}
              className={`w-full h-[clamp(76px,14dvh,112px)] rounded-lg flex justify-center items-center disabled:cursor-default ${opinion === 'AGREE' || opinion === null ? 'bg-[#57AA5A]' : 'bg-[#8E8E8E]'}`}
            >
              <p className="text-white text-3xl sm:text-4xl font-semibold">
                찬성
              </p>
            </button>
            <button
              onClick={() => {
                handleVote('DISAGREE');
              }}
              disabled={isSubmittingVote || !attendanceId}
              className={`w-full h-[clamp(76px,14dvh,112px)] rounded-lg flex justify-center items-center disabled:cursor-default ${opinion === 'DISAGREE' || opinion === null ? 'bg-[#F74040]' : 'bg-[#8E8E8E]'}`}
            >
              <p className="text-white text-3xl sm:text-4xl font-semibold">
                반대
              </p>
            </button>
            {/* <button
              onClick={() => {
                handleVote('ABSTAIN');
              }}
              disabled={isSubmittingVote || !attendanceId}
              className={`w-full h-[clamp(76px,14dvh,112px)] rounded-lg flex justify-center items-center disabled:cursor-default ${opinion === 'ABSTAIN' || opinion === null ? 'bg-[#FBA650]' : 'bg-[#8E8E8E]'}`}
            >
              <p className="text-white text-3xl sm:text-4xl font-semibold">
                기권
              </p>
            </button> */}
          </div>
        </div>
      )}

      {/* 정회 */}
      {!bidae && state === 'STOP' && myAttendance && (
        <div className="flex flex-1 min-h-0 flex-col justify-center items-center w-[calc(100%-40px)] max-w-[353px] gap-5">
          <p className="flex justify-center items-center text-neutral-400 text-2xl font-semibold">
            정회 중입니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
