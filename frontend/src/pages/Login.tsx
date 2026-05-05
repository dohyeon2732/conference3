import { useState, useEffect } from 'react';
import BlueButton from '../components/button/BlueButton';
import ComboBox from '../components/ComboBox';
import { useNavigate } from 'react-router-dom';
import { useUserApi } from '../hooks/useUserApi';
import PopUpCard from '../components/PopUpCard';
import { useDeptApi } from '../hooks/useDeptApi';

const Login = () => {
  useEffect(() => {
    document.body.className = 'mobile';
  }, []);
  const navigate = useNavigate();

  const [clicked, setClicked] = useState(0);
  const [popup1, setPopup1] = useState(false);
  const [deptList, setDeptList] = useState<{ id: number; deptName: string }[]>(
    [],
  );
  const [userList, setUserList] = useState<string[]>([]);
  const [dept, setDept] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchDeptList = async () => {
      try {
        const res = await useDeptApi.findAll();
        console.log('dept list', res.data);
        setDeptList(
          res.data.map((k: { deptId: number; deptName: string }) => ({
            id: k.deptId,
            deptName: k.deptName,
          })),
        );
        console.log('dept list2', deptList);
      } catch (e) {
        console.error('Dept list empty', e);
      }
    };
    fetchDeptList();
  }, []);

  useEffect(() => {
    if (!dept) {
      setUserList([]);
      setName('');
      return;
    }

    const fetchUsersByDept = async () => {
      try {
        const selectedDept = deptList.find((k) => k.deptName === dept);
        if (!selectedDept) return;

        const res = await useUserApi.findByDept({ deptId: selectedDept.id });
        setUserList(res.data.map((u: { userName: string }) => u.userName));
        console.log('user list', res.data);
      } catch (e) {
        console.error('user list load fail', e);
      }
    };
    fetchUsersByDept();
  }, [dept, deptList]);

  const handleLogin = async () => {
    try {
      const res = await useUserApi.login({
        deptName: dept,
        userName: name,
        password: password,
      });

      const { accessToken } = res.data;

      if (!accessToken) {
        throw new Error('accessToken이 없습니다.');
      }

      localStorage.setItem('accessToken', accessToken);

      navigate('/home'); //home
    } catch (e) {
      console.error('login fail', e);
      setPopup1(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <button
        onClick={() => {
          setClicked(clicked + 1);
          if (clicked >= 7) {
            setClicked(0);
            navigate('/manager/login');
          }
        }}
      >
        <p className="text-3xl text-center font-semibold">
          2026학년도 하반기 정기
          <br />
          전체학생대표자회의
          <br />
          투표 시스템
        </p>
      </button>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-center gap-3.5">
          <p className="w-20 text-black text-lg font-semibold text-center">
            소속 단위
          </p>
          <ComboBox
            placeholder="소속 단위을 선택하세요."
            name={deptList.map((k) => k.deptName)}
            value={dept}
            onChange={setDept}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-3.5">
          <p className="w-20 text-black text-lg font-semibold text-center">
            직위/이름
          </p>
          <ComboBox
            placeholder="이름을 선택하세요."
            name={userList}
            value={name}
            onChange={setName}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-3.5">
          <p className="w-20 text-black text-lg font-semibold text-center">
            비밀번호
          </p>
          <input
            className="w-64 h-12 p-3 bg-zinc-100 rounded-lg"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
      </div>
      <BlueButton text="로그인" color="blue" onClick={handleLogin} />

      <PopUpCard
        isOpen={popup1}
        onRequestClose={() => setPopup1(false)}
        title={'로그인 실패'}
        descript={'로그인 정보가 올바르지 않습니다.'}
        input={false}
        placeholder=""
        first="돌아가기"
        onFirstClick={() => setPopup1(false)}
      />
    </div>
  );
};
export default Login;
