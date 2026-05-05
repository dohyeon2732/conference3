import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';

import ArrowRight from '../../assets/icons/ArrowRight.svg';
import { useStateApi } from '../../hooks/useStateApi';
import { useAgendaApi } from '../../hooks/useAgendaApi';
import { useUserApi } from '../../hooks/useUserApi';
import { useAttendanceApi } from '../../hooks/useAttendanceApi';
import { useVoteApi } from '../../hooks/useVoteApi';
import { useDeptApi } from '../../hooks/useDeptApi';
import { useManagerRealtime } from '../../contexts/ManagerRealtimeContext';

type AttendanceVote = {
  attendanceId: number;
  agendaId: number;
  userId: number;
  voteValue: 'AGREE' | 'DISAGREE' | 'ABSTAIN' | null;
};

const Agenda = () => {
  const { state, totalCount, attendCount } = useManagerRealtime();

  useEffect(() => {
    document.body.className = 'pc_white';
  }, []);
  const navigate = useNavigate();

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

  const [deptList, setDeptList] = useState<
    {
      deptId: number;
      deptName: string;
    }[]
  >([]);

  useEffect(() => {
    const eventSource = useUserApi.attendStream(
      (data) => {
        setUserList((prev) =>
          prev.map((user) =>
            user.userId === data.userId
              ? { ...user, attend: data.attend }
              : user,
          ),
        );
      },
      (error) => {
        console.error('출석 상태 SSE 연결 오류', error);
      },
    );

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const res = await useUserApi.findAll();
        setUserList(res.data);
      } catch (e) {
        console.error('사용자 목록 조회 실패', e);
      }
    };

    const fetchDeptList = async () => {
      try {
        const res = await useDeptApi.findAll();
        setDeptList(res.data);
      } catch (e) {
        console.error('소속 목록 조회', e);
      }
    };

    fetchUserList();
    fetchDeptList();
  }, []);

  const [agendaName, setAgendaName] = useState('');
  const [countOption, setCountOption] = useState(0); //0: 일반(1/2), 1: 특별(2/3)
  const [agendaId, setAgendaId] = useState(0);
  const [voteResult, setVoteResult] = useState({
    agreeCount: 0,
    disagreeCount: 0,
    abstainCount: 0,
    totalVotes: 0,
  });

  const [attendanceList, setAttendanceList] = useState<AttendanceVote[]>([]);

  const isQuorumMet = attendCount >= Math.ceil(totalCount / 2);

  const buttonInfo = (() => {
    if (state === 'VOTING') {
      return { text: '투표 종료', color: '#FF8686', disabled: false };
    }

    if (state === 'PROGRESS') {
      if (isQuorumMet) {
        return { text: '투표 시작', color: '#86A6FF', disabled: false };
      }
      return { text: '정족수 미달', color: '#A3A3A3', disabled: true };
    }
    if (state === 'RESULT') {
      return { text: '속개하기', color: '#34AE6B', disabled: false };
    }
    return { text: '정회 중', color: '#A3A3A3', disabled: true };
  })();

  const getVoteColor = (voteValue: AttendanceVote['voteValue']) => {
    if (voteValue === 'AGREE') return 'bg-[#57AA5A]';
    if (voteValue === 'DISAGREE') return 'bg-[#F74040]';
    if (voteValue === 'ABSTAIN') return 'bg-[#FBA650]';
    return 'bg-[#fff]';
  };

  const getTextColor = (voteValue: AttendanceVote['voteValue']) => {
    if (voteValue === 'AGREE') return 'text-white';
    if (voteValue === 'DISAGREE') return 'text-white';
    if (voteValue === 'ABSTAIN') return 'text-white';
    return 'text-[#303030]';
  };

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

  const createAgenda = async () => {
    if (agendaName.trim() === '') {
      alert('의결 명을 입력해주세요.');
      return;
    }

    try {
      const res = await useAgendaApi.create({
        agendaName: agendaName,
        agendaState: true,
        agendaMinimum: countOption ? true : false,
      });
      setAgendaId(res.data.agendaId);
      await useStateApi.change({
        currentState: 'VOTING',
        currentAgendaId: res.data.agendaId,
      });
      await useAttendanceApi.create({
        agendaId: res.data.agendaId,
      });
      fetchAttendanceList(res.data.agendaId);
    } catch (e) {
      console.error('의결 생성 실패', e);
    }
  };

  const restartProgress = async () => {
    try {
      await useStateApi.change({
        currentState: 'PROGRESS',
        currentAgendaId: null,
      });
      setAgendaName('');
      setVoteResult({
        agreeCount: 0,
        disagreeCount: 0,
        abstainCount: 0,
        totalVotes: 0,
      });
      setAttendanceList([]);
      navigate(`/manager/agendalist`);
    } catch (e) {
      console.error('진행 재시작 실패', e);
    }
  };

  const closeAgenda = async () => {
    try {
      await useAgendaApi.close({ agendaId });
      await useStateApi.change({
        currentState: 'RESULT',
        currentAgendaId: agendaId,
      });
    } catch (e) {
      console.error('의결 종료 실패', e);
    }
  };
  useEffect(() => {
    if (state !== 'VOTING' || !agendaId) return;

    fetchVoteResult(agendaId);
    fetchAttendanceList(agendaId);

    const interval = setInterval(() => {
      fetchVoteResult(agendaId);
      fetchAttendanceList(agendaId);
    }, 500);

    return () => clearInterval(interval);
  }, [state, agendaId]);

  useEffect(() => {
    if (state !== 'VOTING') return;
    fetchCurrentAgenda();
  }, [state]);

  const fetchCurrentAgenda = async () => {
    try {
      const res = await useAgendaApi.findAll();

      const currentAgenda = res.data
        .filter(
          (agenda: { agendaId: number; agendaState: boolean }) =>
            agenda.agendaState,
        )
        .at(-1);

      if (!currentAgenda) return;

      setAgendaId(currentAgenda.agendaId);
      setAgendaName(currentAgenda.agendaName);

      fetchVoteResult(currentAgenda.agendaId);
      fetchAttendanceList(currentAgenda.agendaId);
    } catch (e) {
      console.error(e);
    }
  };

  const voteMap = useMemo(
    () =>
      new Map(
        attendanceList.map((attendance) => [
          attendance.userId,
          attendance.voteValue,
        ]),
      ),
    [attendanceList],
  );

  return (
    <div className=" ml-[294px] flex flex-col w-[calc(100vw-314px)] ">
      <div className="fixed left-[294px] top-[80px] flex flex-col pt-10 pl-16 pb-5 w-full gap-6 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] ">
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
        <div className="relative flex flex-row gap-5 items-center">
          <p className="text-2xl font-bold">안건명</p>
          <img
            src={ArrowRight}
            alt="Search"
            className="absolute left-24 top-3"
          />
          <input
            className="w-[calc(100vw-1002px)]  h-12 p-3 pl-12 bg-zinc-100 rounded-lg text-2xl font-bold "
            type="text"
            placeholder="안건 명을 입력하세요"
            value={agendaName}
            onChange={(e) => {
              setAgendaName(e.target.value);
            }}
          />
          <div className="flex flex-row gap-5 items-center">
            <button
              className="flex flex-row gap-3 items-center"
              onClick={() => {
                setCountOption(0);
              }}
            >
              <div
                className={`w-6 h-6 ${countOption === 0 ? 'bg-[#86A6FF]' : 'bg-[#A3A3A3]'} rounded-full border-[#888888] border-1`}
              ></div>
              <p className="text-2xl font-bold">일반 정족수</p>
            </button>
            <button
              className="flex flex-row gap-3 items-center"
              onClick={() => {
                setCountOption(1);
              }}
            >
              <div
                className={`w-6 h-6 ${countOption === 1 ? 'bg-[#86A6FF]' : 'bg-[#A3A3A3]'} rounded-full border-[#888888] border-1`}
              ></div>
              <p className="text-2xl font-bold">특별 정족수</p>
            </button>
          </div>
          <button
            className={`w-36 h-12  rounded-lg text-white text-2xl font-bold ${buttonInfo.disabled ? 'cursor-default' : 'cursor-pointer'}`}
            style={{ backgroundColor: buttonInfo.color }}
            onClick={() => {
              if (state === 'VOTING') {
                closeAgenda();
              } else if (state === 'PROGRESS') {
                createAgenda();
              } else if (state === 'RESULT') {
                restartProgress();
              }
            }}
            disabled={buttonInfo.disabled}
          >
            {buttonInfo.text}
          </button>
        </div>
        <div className="flex flex-row gap-5 justify-between items-center">
          {/* 정족수 등 */}
          <div className="flex flex-row gap-5">
            <p className="text-2xl font-bold">재적 {totalCount}명</p>
            <p className="text-2xl font-bold">
              개의 정족수 {Math.ceil(totalCount / 2)}명
            </p>
            <div className="bg-black w-[3px] h-7" />
            <p className="text-2xl font-bold">출석 {attendCount}명</p>
            <p className="text-2xl font-bold">
              불참 {totalCount - attendCount}명
            </p>
            <div className="bg-black w-[3px] h-7" />
            <p className="text-2xl font-bold">
              참석률{' '}
              {totalCount === 0
                ? '0.00'
                : ((attendCount / totalCount) * 100).toFixed(2)}
              %
            </p>
          </div>
          <div className="flex flex-row gap-7 mr-10">
            <div className="flex flex-row gap-3.5">
              <div className="bg-[#57AA5A] w-[30px] h-[30px] rounded-full" />
              <p className="text-[#57AA5A] text-2xl font-bold">참석</p>
            </div>
            <div className="flex flex-row gap-3.5">
              <div className="bg-[#F74040] w-[30px] h-[30px] rounded-full" />
              <p className="text-[#F74040] text-2xl font-bold">불참</p>
            </div>
          </div>
        </div>
        {(state === 'RESULT' || state === 'VOTING') && (
          <div className="flex flex-row w-[calc(100vw-390px)] gap-5 justify-between items-center">
            {/* 정족수 등 */}
            <div className="flex flex-row gap-5">
              <p className="text-2xl font-bold ">
                의결권 수 {attendanceList.length}명
              </p>
              <p className="text-2xl font-bold">
                투표수 {voteResult.totalVotes}명
              </p>
              <div className="bg-black w-[3px] h-7" />
              <p className="text-2xl font-bold text-[#57AA5A]">
                찬성 {voteResult.agreeCount}명
              </p>
              <p className="text-2xl font-bold text-[#F74040]">
                반대 {voteResult.disagreeCount}명
              </p>
              <p className="text-2xl font-bold text-[#FBA650]">
                기권 {voteResult.abstainCount}명
              </p>

              <div className="bg-black w-[3px] h-7" />
              <p className="text-2xl font-bold">
                투표율{' '}
                {(voteResult.totalVotes === 0
                  ? 0
                  : (voteResult.totalVotes / attendanceList.length) * 100
                ).toFixed(2)}
                %
              </p>
            </div>
            <div className="flex flex-row gap-4 mr-10">
              <div className="flex felx-row gap-2">
                <div className="bg-white w-[30px] h-[30px] rounded-full border-2 border-black" />
                <p className="text-zinc-800 text-2xl font-bold">미투표</p>
              </div>
              <div className="flex felx-row gap-2">
                <div className="bg-[#A3A3A3] w-[30px] h-[30px] rounded-full" />
                <p className="text-zinc-800 text-2xl font-bold">불참/비대위</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`flex flex-col gap-4 mt-[244px] mx-12 ${state === 'RESULT' || state === 'VOTING' ? 'mt-[300px]' : 'mt-[220px]'}`}
      >
        {/* 출석부 테이블 */}
        {/* {state === 'VOTING' &&(  */}
        {deptList.map((dept) => (
          <div className="flex flex-row gap-3 items-center" key={dept.deptId}>
            <p className="w-40 text-2xl font-bold text-center">
              {dept.deptName}
            </p>
            <div className="flex flex-row  w-[calc(100vw-390px)] p-3 bg-[#F1F1F1] rounded-xl gap-3 justify-start items-start flex-wrap content-start ">
              {userList
                .filter((user) => user.deptId === dept.deptId)
                .map((user) => {
                  const voteValue = voteMap.get(user.userId) ?? null;

                  console.log(user.attend, user.emergency);
                  return (
                    <div key={user.userId}>
                      <div
                        className={`flex flex-col py-1.5 px-6 rounded-lg justify-center items-center ${
                          user.attend && !user.emergency
                            ? getVoteColor(voteValue)
                            : 'bg-[#A3A3A3]'
                        } cursor-default`}
                      >
                        <p
                          className={`text-2xl font-bold ${user.attend && !user.emergency ? getTextColor(voteValue) : 'text-white'}`}
                        >
                          {user.userPos}
                        </p>
                        <p
                          className={`text-2xl font-bold ${user.attend && !user.emergency ? getTextColor(voteValue) : 'text-white'}`}
                        >
                          {user.userName}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}{' '}
        {/* )} */}
      </div>
    </div>
  );
};

export default Agenda;
