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
    document.body.className = 'pc_white';
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
    <div className="flex flex-col w-screen min-h-screen bg-white">
      <div className="fixed left-0 top-0 flex flex-col pt-10 pl-16 pb-5 w-full gap-6 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] z-10">
        <div className="font-bold text-3xl">
          2026학년도 하반기 전체학생대표자회의 출석 대의원 명부
        </div>

        <div className="flex flex-row gap-4.5">
          <div
            className={`w-[30px] h-[30px] rounded-full ${state === 'PROGRESS' ? 'bg-[#57AA5A]' : state === 'STOP' ? 'bg-[#F74040]' : 'bg-[#FBA650]'}`}
          />
          <p
            className={`text-2xl font-bold ${state === 'PROGRESS' ? 'text-[#57AA5A]' : state === 'STOP' ? 'text-[#F74040]' : 'text-[#FBA650]'}`}
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
            className="absolute left-3 top-2.5"
          />
          <input
            className="w-100 h-12 p-3 pl-14 bg-zinc-100 rounded-lg text-2xl font-bold"
            type="text"
            placeholder="이름으로 검색"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-row gap-5 justify-between items-center">
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

      <div className="flex flex-col gap-4 mt-[300px] mx-12">
        {deptList.map((dept) => (
          <div className="flex flex-row gap-3 items-center" key={dept.deptId}>
            <p className="w-40 text-2xl font-bold text-center">
              {dept.deptName}
            </p>
            <div className="flex flex-row w-[calc(100vw-160px)] p-3 bg-[#F1F1F1] rounded-xl gap-3 justify-start items-start flex-wrap content-start">
              {(visibleUsersByDept.get(dept.deptId) ?? []).map((user) => (
                <div
                  className={`flex flex-col py-1.5 px-6 rounded-lg justify-center items-center ${
                    user.attend ? 'bg-[#57AA5A]' : 'bg-[#F74040]'
                  }`}
                  key={user.userId}
                >
                  <p className="text-2xl font-bold text-white">
                    {user.userPos}
                  </p>
                  <p className="text-2xl font-bold text-white">
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
