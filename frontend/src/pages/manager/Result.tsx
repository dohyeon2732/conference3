import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useManagerRealtime } from '../../contexts/ManagerRealtimeContext';
import { useAgendaApi } from '../../hooks/useAgendaApi';
import { useUserApi } from '../../hooks/useUserApi';
import { useVoteApi } from '../../hooks/useVoteApi';
import { useAttendanceApi } from '../../hooks/useAttendanceApi';

const Result = () => {
  type AttendanceVote = {
    attendanceId: number;
    agendaId: number;
    userId: number;
    voteValue: 'AGREE' | 'DISAGREE' | 'ABSTAIN' | null;
  };

  const { state, attendCount, currentAgendaId } = useManagerRealtime();
  // 'PROGRESS': 준비중, 'VOTING': 의결, 'RESULT': 결과

  const [voteResult, setVoteResult] = useState<{
    agendaId: number;
    agreeCount: number;
    disagreeCount: number;
    abstainCount: number;
    totalVotes: number;
  }>();
  const navigate = useNavigate();
  const [attendanceList, setAttendanceList] = useState<AttendanceVote[]>([]);

  const [agendaName, setAgendaName] = useState('');
  const [userList, setUserList] = useState<
    {
      userId: number;
      userName: string;
      userPos: string;
      deptId: number;
      deptName: string;
      attend: boolean;
      emergency: boolean;
    }[]
  >([]);

  const getVoteColor = (voteValue: AttendanceVote['voteValue']) => {
    if (voteValue === 'AGREE') return 'text-[#57AA5A]';
    if (voteValue === 'DISAGREE') return 'text-[#F74040]';
    if (voteValue === 'ABSTAIN') return 'text-[#FBA650]';
    return 'text-[#fff]';
  };

  useEffect(() => {
    document.body.className = 'pc_black';
  }, []);

  useEffect(() => {
    const fetchAgenda = async () => {
      if (currentAgendaId === null) return;
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
    const fetchResult = async () => {
      if (currentAgendaId === null) return;
      try {
        const res = await useVoteApi.result({ agendaId: currentAgendaId });
        setVoteResult({
          agendaId: res.data.agendaId,
          agreeCount: res.data.agreeCount,
          disagreeCount: res.data.disagreeCount,
          abstainCount: res.data.abstainCount,
          totalVotes:
            res.data.agreeCount +
            res.data.disagreeCount +
            res.data.abstainCount,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchResult();
  }, [currentAgendaId]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const res = await useUserApi.findAll();
        setUserList(res.data);
      } catch (e) {
        console.error('사용자 목록 조회 실패', e);
      }
    };

    fetchUserList();
  }, []);

  const fetchAttendanceList = async (agendaId: number) => {
    try {
      const res = await useAttendanceApi.findByAgendaId({ agendaId });
      setAttendanceList(res.data);
      console.log('출석부 리스트', res.data);
    } catch (e) {
      console.error('출석부 조회 실패', e);
    }
  };
  const fetchVoteResult = async (agendaId: number) => {
    try {
      const res = await useVoteApi.result({ agendaId });
      console.log('투표 결과', res.data);
      setVoteResult({
        agendaId: agendaId,
        agreeCount: res.data.agreeCount,
        disagreeCount: res.data.disagreeCount,
        abstainCount: res.data.abstainCount,
        totalVotes:
          res.data.agreeCount + res.data.disagreeCount + res.data.abstainCount,
      });
    } catch (e) {
      console.error('투표 결과 조회 실패', e);
    }
  };

  useEffect(() => {
    if (state === 'RESULT' && currentAgendaId !== null) {
      fetchVoteResult(currentAgendaId);
    }
  }, [state, currentAgendaId]);

  useEffect(() => {
    if (state !== 'VOTING' || !currentAgendaId) return;

    fetchVoteResult(currentAgendaId);
    fetchAttendanceList(currentAgendaId);

    const interval = setInterval(() => {
      fetchVoteResult(currentAgendaId);
      fetchAttendanceList(currentAgendaId);
    }, 500);

    return () => clearInterval(interval);
  }, [state, currentAgendaId]);

  return (
    <div
      className={`flex flex-col min-h-screen ${state === 'PROGRESS' ? 'justify-center' : 'justify-start'} `}
    >
      {state !== 'PROGRESS' && (
        <div className="flex flex-col w-screen px-20 pt-15 ">
          <div className="flex flex-row justify-between items-center mb-10">
            <div
              className={`flex flex-col gap-2 ${state === 'VOTING' ? '' : 'invisible'}`}
            >
              <div className="flex felx-row gap-4.5 items-center">
                <div className="w-[30px] h-[30px]  bg-[#57AA5A] rounded-full"></div>
                <p className="text-2xl font-semibold text-[#57AA5A]">
                  찬성 {voteResult?.agreeCount}
                </p>
              </div>
              <div className="flex felx-row gap-4.5 items-center">
                <div className="w-[30px] h-[30px]  bg-[#F74040] rounded-full"></div>
                <p className="text-2xl font-semibold text-[#F74040]">
                  반대 {voteResult?.disagreeCount}
                </p>
              </div>
              <div className="flex felx-row gap-4.5 items-center">
                <div className="w-[30px] h-[30px]  bg-[#FBA650] rounded-full"></div>
                <p className="text-2xl font-semibold text-[#FBA650]">
                  기권 {voteResult?.abstainCount}
                </p>
              </div>
              <div className="flex felx-row gap-4.5 items-center">
                <div className="w-[30px] h-[30px]  bg-[#FFFFFF] rounded-full"></div>
                <p className="text-2xl font-semibold text-[#FFFFFF]">
                  미투표 {attendanceList.length - (voteResult?.totalVotes ?? 0)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 justify-center items-center">
              <p className="text-3xl font-semibold">
                2026학년도 하반기 정기 전체학생대표자회의
              </p>
              <p className=" text-4xl font-bold">
                {state === 'RESULT' ? '의결 결과' : '의결'}
              </p>
              <p className="text-2xl font-semibold">{agendaName}</p>
            </div>
            <div>
              <button
                onClick={() => navigate('/manager/agendalist')}
                className="bg-[#A3A3A3] text-white text-xl font-semibold rounded-lg px-4 py-2"
              >
                나가기
              </button>
            </div>
          </div>
          {state === 'VOTING' && (
            <div className="grid grid-cols-14 gap-4">
              {[...userList]
                .filter((user) => user.attend)
                .filter((user) => !user.emergency)
                .sort((a, b) => a.userName.localeCompare(b.userName, 'ko'))
                .map((user) => {
                  const attendance = attendanceList.find(
                    (attendance) => attendance.userId === user.userId,
                  );
                  const voteValue = attendance?.voteValue ?? null;
                  return (
                    <p
                      key={user.userId}
                      className={`text-xl font-semibold ${getVoteColor(voteValue)}`}
                    >
                      {user.userName}
                    </p>
                  );
                })}
            </div>
          )}

          {state === 'RESULT' && (
            <div className="flex flex-col gap-10 justify-center items-center mt-20">
              <p className="text-white text-6xl font-bold">
                의결권 {attendCount}명
              </p>
              <div className="flex flex-col gap-5">
                <p className="text-[#57AA5A] text-6xl font-bold">
                  찬성 {voteResult?.agreeCount}명
                </p>
                <p className="text-[#F74040] text-6xl font-bold">
                  반대 {voteResult?.disagreeCount}명
                </p>
                <p className="text-[#FBA650] text-6xl font-bold">
                  기권 {voteResult?.abstainCount}명
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      {state === 'PROGRESS' && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-3xl font-semibold">
            2026학년도 하반기 정기 전체학생대표자회의
          </p>
          <p className=" text-4xl font-bold">의결 준비 중</p>
        </div>
      )}
    </div>
  );
};

export default Result;
