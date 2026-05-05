import { useState, useEffect } from 'react';

import SearchIcon from '../../assets/icons/Search.svg';
import { useUserApi } from '../../hooks/useUserApi';
import { useDeptApi } from '../../hooks/useDeptApi';

import { useManagerRealtime } from '../../contexts/ManagerRealtimeContext';

const Attend = () => {
  const { state, totalCount, attendCount, latestAttendanceUpdate } =
    useManagerRealtime();

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

  const [name, setName] = useState('');

  const handleAttendToggle = async (userId: number) => {
    try {
      await useUserApi.attendCheck({ userId });
    } catch (e) {
      console.error('출석 체크 실패', e);
    }
  };

  useEffect(() => {
    if (!latestAttendanceUpdate) return;

    setUserList((prev) =>
      prev.map((user) =>
        user.userId === latestAttendanceUpdate.userId
          ? { ...user, attend: latestAttendanceUpdate.attend }
          : user,
      ),
    );
  }, [latestAttendanceUpdate]);

  useEffect(() => {
    document.body.className = 'pc_white';
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

  return (
    <div className=" ml-[294px] flex flex-col w-[calc(100vw-294px)] ">
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
        <div className="relative ">
          <img
            src={SearchIcon}
            alt="Search"
            className="absolute left-3 top-2.5"
          />
          <input
            className="w-100 h-12 p-3 pl-14 bg-zinc-100 rounded-lg text-2xl font-bold "
            type="text"
            disabled={state === 'VOTING'}
            placeholder="이름으로 검색"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
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
      </div>

      <div className="flex flex-col gap-4 mt-[244px] mx-12">
        {deptList.map((dept) => (
          <div className="flex flex-row gap-3 items-center" key={dept.deptId}>
            <p className="w-40 text-2xl font-bold text-center">
              {dept.deptName}
            </p>
            <div className="flex flex-row  w-[calc(100vw-390px)] p-3 bg-[#F1F1F1] rounded-xl gap-3 justify-start items-start flex-wrap content-start ">
              {userList
                .filter(
                  (user) =>
                    user.deptId === dept.deptId &&
                    user.userName.includes(name.trim()),
                )

                .map((user) => (
                  <div key={user.userId}>
                    <button
                      className={`flex flex-col py-1.5 px-6 rounded-lg justify-center items-center ${
                        user.attend ? 'bg-[#57AA5A]' : 'bg-[#F74040]'
                      }`}
                      onClick={() => {
                        handleAttendToggle(user.userId);
                      }}
                    >
                      <p className="text-2xl font-bold text-white">
                        {user.userPos}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {user.userName}
                      </p>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {state === 'VOTING' && (
        <div className="fixed flex justify-center items-center left-[294px] top-[300px] w-[calc(100vw-294px)] h-[calc(100vh-300px)] bg-black/50">
          <div className="flex flex-col w-[500px] h-70 bg-white rounded-lg text-center gap-5 justify-center items-center">
            <p className="text-4xl font-bold">의결 진행 중</p>
            <p className="text-3xl font-semibold">
              인원 변경을 진행할 수 없습니다.
              <br />
              의결이 종료되면
              <br />
              자동으로 잠금이 해제됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attend;
