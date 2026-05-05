import { useEffect, useState } from 'react';

import Plus from '../../assets/icons/Plus.svg';
import PCPopUp from '../../components/manager/PCPopUp';
import PCPopUpMember from '../../components/manager/PCPopUpMember';
import { useUserApi } from '../../hooks/useUserApi';
import { useDeptApi } from '../../hooks/useDeptApi';

const Member = () => {
  const [popUp1, setPopUp1] = useState(false);
  const [popUp2, setPopUp2] = useState(false);
  const [clickedDept, setClickedDept] = useState<number | null>(null);

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

  const handleDeptAdd = async (deptName?: string) => {
    try {
      if (!deptName) return;
      await useDeptApi.make({ deptName });
      const res = await useDeptApi.findAll();
      setDeptList(res.data);
      setPopUp1(false);
    } catch (e) {
      console.error('단위 추가 실패', e);
    }
  };

  const handleMemberAdd = async (
    position?: string,
    name?: string,
    isEmergency?: boolean,
  ) => {
    try {
      if (!position || !name) return;
      await useUserApi.create({
        userName: name,
        password: '1234',
        userPos: position,
        deptId: clickedDept ?? 0,
        emergency: isEmergency ?? false,
      });
      const res = await useUserApi.findAll();
      setUserList(res.data);
      setPopUp2(false);
    } catch (e) {
      console.error('구성원 추가 실패', e);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col ml-[294px]">
        <div className="flex flex-row gap-5 w-[calc(100vw-294px)] justify-end px-10 py-5">
          {/* 배너 */}
          <div className="flex flex-row gap-3">
            <div className="w-9 h-9 bg-white border-1 border-black rounded-full"></div>
            <p className="text-3xl font-bold">의결권 O</p>
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-9 h-9 bg-[#A3A3A3] rounded-full"></div>
            <p className="text-3xl font-bold">의결권 X</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center mx-8">
          {deptList.map((dept) => (
            <div className="flex flex-row gap-3 items-center" key={dept.deptId}>
              <p className="w-40 text-2xl font-bold text-center">
                {dept.deptName}
              </p>
              <div className="flex flex-row  w-[calc(100vw-530px)] p-3 bg-[#F1F1F1] rounded-xl gap-3 justify-start items-center flex-wrap content-start ">
                {userList
                  .filter((user) => user.deptId === dept.deptId)
                  .map((user) => (
                    <button
                      className={`flex flex-col py-1.5 px-6 rounded-lg bg-[${user.emergency ? '#A3A3A3' : '#fff'}]  justify-center items-center`}
                      key={user.userId}
                    >
                      <p
                        className={`text-2xl font-bold text-${user.emergency ? 'white' : 'black'}  `}
                      >
                        {user.userPos}
                      </p>
                      <p
                        className={`text-2xl font-bold text-${user.emergency ? 'white' : 'black'}  `}
                      >
                        {user.userName}
                      </p>
                    </button>
                  ))}
                <button
                  onClick={() => {
                    setClickedDept(dept.deptId);
                    setPopUp2(true);
                  }}
                  className="w-8 h-8 bg-[#aeaeae] rounded-full flex items-center justify-center"
                >
                  <img src={Plus} alt="plus" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              setPopUp1(true);
            }}
            className="w-[calc(100vw-358px)] h-14 bg-[#aeaeae] text-white text-3xl font-bold rounded-xl"
          >
            추가하기
          </button>
        </div>
      </div>
      <PCPopUp
        isOpen={popUp1}
        onRequestClose={() => {
          setPopUp1(false);
        }}
        title={'단위 추가하기'}
        descript={undefined}
        first="닫기"
        second="추가하기"
        onFirstClick={() => setPopUp1(false)}
        onSecondClick={(value) => handleDeptAdd(value)}
      />

      <PCPopUpMember
        isOpen={popUp2}
        onRequestClose={() => {
          setPopUp2(false);
        }}
        title={'구성원 추가하기'}
        descript={undefined}
        first="닫기"
        second="추가하기"
        onFirstClick={() => setPopUp2(false)}
        onSecondClick={(position, name, isEmergency) => {
          handleMemberAdd(position, name, isEmergency);
        }}
      />
    </div>
  );
};

export default Member;
