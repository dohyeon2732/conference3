import { useEffect, useRef, useState } from 'react';
import MobileTopBar from '../components/MobileTopBar';
import { useUserApi } from '../hooks/useUserApi';
import { useUserRealtime } from '../contexts/UserRealtimeContext';
import { useAgendaApi } from '../hooks/useAgendaApi';
import { useVoteApi } from '../hooks/useVoteApi';
import { useAttendanceApi } from '../hooks/useAttendanceApi';

type VoteValue = 'AGREE' | 'DISAGREE' | 'ABSTAIN' | null;

const Home = () => {
  const { state, myAttendance, currentAgendaId } = useUserRealtime();

  useEffect(() => {
    document.body.className = 'mobile';
  }, []);

  const [bidae, setBidae] = useState(false);

  const [opinion, setOpinion] = useState<VoteValue | null>(null);
  const [isVoted, setIsVoted] = useState(false);
  const isVotedRef = useRef(false);
  const [agendaName, setAgendaName] = useState('');
  const [userName, setUserName] = useState('');
  const [userDept, setUserDept] = useState('');
  const [userId, setUserId] = useState(0);
  const [attendanceId, setAttendanceId] = useState(0);
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
    const fetchAttendanceId = async () => {
      if (currentAgendaId === null || currentAgendaId === 0 || userId === 0)
        return;

      try {
        const res = await useAttendanceApi.findByAgendaIdUserId({
          agendaId: currentAgendaId,
          userId: userId,
        });
        setAttendanceId(res.data.attendanceId);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAttendanceId();
  }, [currentAgendaId, userId]);

  // useEffect(() => {
  //   const sendResult = async () => {
  //     if (state === 'RESULT') {
  //       try {
  //         const voteValue = opinion ?? 'ABSTAIN';

  //         console.log(voteValue);

  //         const res = await useVoteApi.make({
  //           attendanceId: attendanceId,
  //           voteValue: voteValue,
  //         });
  //         setOpinion(null);
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }
  //   };
  //   sendResult();
  // }, [state]);

  useEffect(() => {
    setIsVoted(false);
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

  useEffect(() => {
    const sendResult = async () => {
      try {
        const voteValue = opinion ?? 'ABSTAIN';
        console.log(voteValue, 'attend: ', attendanceId, ' voted :', isVoted);

        if (attendanceId !== 0) {
          if (!isVotedRef.current) {
            isVotedRef.current = true;
            try {
              await useVoteApi.make({
                attendanceId,
                voteValue: voteValue,
              });
              setIsVoted(true);
            } catch (e) {
              isVotedRef.current = false;
              throw e;
            }
          } else {
            await useVoteApi.change({
              attendanceId,
              voteValue: voteValue,
            });
            // console.log('change');
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    sendResult();
  }, [opinion]);

  useEffect(() => {
    if (state === 'RESULT') {
      setIsVoted(false);
      isVotedRef.current = false;
    }
  }, [state]);

  return (
    <div className="w-[393px] flex flex-col items-center justify-center">
      <MobileTopBar
        buttonOn={true}
        dept={userDept}
        name={userName}
        title="2026학년도 하반기 정기 전체학생대표자회의"
        back={false}
      />

      {/* 상태 창 */}
      <div className="fixed top-[92px] w-[353px] flex flex-row gap-3 justify-end items-center ">
        <div className="flex flex-row gap-2 justify-center items-center text-center">
          <div
            className={`w-6 h-6 rounded-full ${state === 'PROGRESS' ? 'bg-[#57AA5A]' : state === 'STOP' ? 'bg-[#F74040]' : 'bg-[#FBA650]'}`}
          ></div>
          <p
            className={`text-xl, font-bold ${state === 'PROGRESS' ? 'text-[#57AA5A]' : state === 'STOP' ? 'text-[#F74040]' : 'text-[#FBA650]'}`}
          >
            {state === 'PROGRESS' ? '개의' : state === 'STOP' ? '정회' : '의결'}
          </p>
        </div>
        <div className="flex flex-row gap-2 ">
          <div
            className={`w-6 h-6 rounded-full ${myAttendance ? 'bg-[#57AA5A]' : 'bg-[#F74040]'}`}
          ></div>
          <p
            className={`text-xl, font-bold ${myAttendance ? 'text-[#57AA5A]' : 'text-[#F74040]'}`}
          >
            {myAttendance ? '참석' : '불참'}
          </p>
        </div>
      </div>

      {/* 의결 중 */}
      {bidae && (
        <div className="flex flex-col justify-center items-center pt-50 w-[353px] gap-5 text-center">
          <p className="flex justify-center items-center text-neutral-400 text-2xl font-semibold">
            비대위 단위는 의결권이 없습니다.
          </p>
        </div>
      )}

      {/* 불참 */}
      {!bidae && !myAttendance && (
        <div className="flex flex-col justify-center items-center pt-50 w-[353px] gap-5 text-center">
          <p className="flex justify-center items-center text-neutral-400 text-xl font-semibold">
            회의 불참 상태입니다. <br /> 회의에 참석한 후 의결에 참여해주세요.
          </p>
        </div>
      )}

      {/* 의결 준비중 */}
      {!bidae && state === 'PROGRESS' && myAttendance && (
        <div className="flex flex-col justify-center items-center pt-50 w-[353px] gap-5 text-center">
          <p className="flex justify-center items-center text-neutral-400 text-2xl font-semibold">
            {' '}
            의결 준비 중
          </p>
        </div>
      )}

      {/* 의결 중 */}
      {!bidae && state === 'VOTING' && myAttendance && (
        <div className="flex flex-col justify-center items-center w-[353px] gap-5">
          <div className="flex flex-col gap-2 justify-center items-center text-center">
            <p className="text-2xl font-semibold">의결</p>
            <p className="text-xl font-semibold">{agendaName}</p>
          </div>

          <div className="flex flex-col gap-10">
            <button
              onClick={() => {
                setOpinion('AGREE');
              }}
              className={`w-96 h-28  rounded-lg justify-center items-center ${opinion === 'AGREE' || opinion === null ? 'bg-[#57AA5A]' : 'bg-[#8E8E8E]'}`}
            >
              <p className="text-white text-4xl font-semibold">찬성</p>
            </button>
            <button
              onClick={() => {
                setOpinion('DISAGREE');
              }}
              className={`w-96 h-28  rounded-lg justify-center items-center ${opinion === 'DISAGREE' || opinion === null ? 'bg-[#F74040]' : 'bg-[#8E8E8E]'}`}
            >
              <p className="text-white text-4xl font-semibold">반대</p>
            </button>
            <button
              onClick={() => {
                setOpinion('ABSTAIN');
              }}
              className={`w-96 h-28  rounded-lg justify-center items-center ${opinion === 'ABSTAIN' || opinion === null ? 'bg-[#FBA650]' : 'bg-[#8E8E8E]'}`}
            >
              <p className="text-white text-4xl font-semibold">기권</p>
            </button>
          </div>
        </div>
      )}

      {/* 정회 */}
      {!bidae && state === 'STOP' && myAttendance && (
        <div className="flex flex-col justify-center items-center pt-50 w-[353px] gap-5">
          <p className="flex justify-center items-center text-neutral-400 text-2xl font-semibold">
            정회 중입니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
