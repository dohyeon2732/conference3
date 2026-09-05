import { useEffect, useMemo, useState } from 'react';

import SearchIcon from '../assets/icons/Search.svg';
import { useDeptApi } from '../hooks/useDeptApi';
import { useStateApi, type StateValue } from '../hooks/useStateApi';
import { useUserApi } from '../hooks/useUserApi';

type Dept = {
  deptId: number;
  deptName: string;
};

type User = {
  userId: number;
  userName: string;
  userPos: string;
  deptId: number;
  deptName: string;
  attend: boolean;
  emergency: boolean;
};

const PublicAttend = () => {
  const [state, setState] = useState<StateValue>('PROGRESS');
  const [deptList, setDeptList] = useState<Dept[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [name, setName] = useState('');

  const totalCount = userList.length;
  const attendCount = userList.filter((user) => user.attend).length;

  const visibleUsersByDept = useMemo(
    () =>
      new Map(
        deptList.map((dept) => [
          dept.deptId,
          userList.filter(
            (user) =>
              user.deptId === dept.deptId &&
              user.userName.includes(name.trim()),
          ),
        ]),
      ),
    [deptList, name, userList],
  );

  useEffect(() => {
    document.body.className = '';
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchState = async () => {
      try {
        const res = await useStateApi.state();
        if (!ignore) {
          setState(res.data.currentState);
        }
      } catch (e) {
        console.error('회의 상태 조회 실패', e);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 3000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchAttendance = async () => {
      try {
        const deptRes = await useDeptApi.findAll();
        const depts: Dept[] = deptRes.data;
        const userResponses = await Promise.all(
          depts.map((dept) => useUserApi.findByDept({ deptId: dept.deptId })),
        );

        if (ignore) return;

        setDeptList(depts);
        setUserList(userResponses.flatMap((res) => res.data));
      } catch (e) {
        console.error('출석 명단 조회 실패', e);
      }
    };

    fetchAttendance();
    const interval = setInterval(fetchAttendance, 3000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white overflow-x-hidden">
      <div className="sticky left-0 top-0 flex flex-col px-5 py-5 sm:px-10 lg:px-16 lg:pt-10 lg:pb-5 w-full gap-4 lg:gap-6 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] z-10">
        <div className="font-bold text-xl sm:text-2xl lg:text-3xl leading-tight break-keep">
          2026학년도 하반기 전체학생대표자회의 출석 대의원 명부
        </div>

        <div className="flex flex-row gap-3 lg:gap-4.5 items-center">
          <div
            className={`w-5 h-5 lg:w-[30px] lg:h-[30px] rounded-full shrink-0 ${state === 'PROGRESS' ? 'bg-[#57AA5A]' : state === 'STOP' ? 'bg-[#F74040]' : 'bg-[#FBA650]'}`}
          />
          <p
            className={`text-xl lg:text-2xl font-bold ${state === 'PROGRESS' ? 'text-[#57AA5A]' : state === 'STOP' ? 'text-[#F74040]' : 'text-[#FBA650]'}`}
          >
            {state === 'PROGRESS'
              ? '회의 중'
              : state === 'STOP'
                ? '정회 중'
                : '의결 중'}
          </p>
        </div>
        <div className="relative">
          <img
            src={SearchIcon}
            alt="Search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6"
          />
          <input
            className="w-full sm:w-100 h-12 p-3 pl-12 sm:pl-14 bg-zinc-100 rounded-lg text-lg sm:text-xl lg:text-2xl font-bold"
            type="text"
            placeholder="이름으로 검색"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-5 justify-between xl:items-center">
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-x-4 gap-y-2 sm:gap-5">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold">재적 {totalCount}명</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold">
              개의 정족수 {Math.ceil(totalCount / 2)}명
            </p>
            <div className="hidden sm:block bg-black w-[3px] h-7" />
            <p className="text-lg sm:text-xl lg:text-2xl font-bold">출석 {attendCount}명</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold">
              불참 {totalCount - attendCount}명
            </p>
            <div className="hidden sm:block bg-black w-[3px] h-7" />
            <p className="text-lg sm:text-xl lg:text-2xl font-bold col-span-2">
              참석률{' '}
              {totalCount === 0
                ? '0.00'
                : ((attendCount / totalCount) * 100).toFixed(2)}
              %
            </p>
          </div>
          <div className="flex flex-row gap-5 lg:gap-7 xl:mr-10">
            <div className="flex flex-row gap-2 lg:gap-3.5 items-center">
              <div className="bg-[#57AA5A] w-5 h-5 lg:w-[30px] lg:h-[30px] rounded-full" />
              <p className="text-[#57AA5A] text-lg sm:text-xl lg:text-2xl font-bold">참석</p>
            </div>
            <div className="flex flex-row gap-2 lg:gap-3.5 items-center">
              <div className="bg-[#F74040] w-5 h-5 lg:w-[30px] lg:h-[30px] rounded-full" />
              <p className="text-[#F74040] text-lg sm:text-xl lg:text-2xl font-bold">불참</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mx-4 sm:mx-8 lg:mx-12 py-5">
        {deptList.map((dept) => (
          <div
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center"
            key={dept.deptId}
          >
            <p className="w-full sm:w-32 lg:w-40 text-xl lg:text-2xl font-bold sm:text-center">
              {dept.deptName}
            </p>
            <div className="flex flex-row flex-1 min-w-0 p-3 bg-[#F1F1F1] rounded-xl gap-2 lg:gap-3 justify-start items-start flex-wrap content-start">
              {(visibleUsersByDept.get(dept.deptId) ?? []).map((user) => (
                <div
                  className={`flex flex-col min-w-[92px] sm:min-w-[104px] py-1.5 px-4 lg:px-6 rounded-lg justify-center items-center ${
                    user.attend ? 'bg-[#57AA5A]' : 'bg-[#F74040]'
                  }`}
                  key={user.userId}
                >
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-white leading-tight text-center">
                    {user.userPos}
                  </p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold text-white leading-tight text-center">
                    {user.userName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicAttend;
