import { useEffect, useState } from 'react';
import { useUserApi } from '../hooks/useUserApi';
import MobileTopBar from '../components/MobileTopBar';
import BottomButton from '../components/button/BottomButton';
import PopUpCard from '../components/PopUpCard';
import { useNavigate } from 'react-router-dom';

const Password = () => {
  useEffect(() => {
    document.body.className = 'mobile';
  }, []);

  const [userName, setUserName] = useState('');
  const [userDept, setUserDept] = useState('');

  const [popup1, setPopup1] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [popup3, setPopup3] = useState(false);
  const [popup4, setPopup4] = useState(false);

  const [old, setOld] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwCheck, setNewPwCheck] = useState('');

  const navigate = useNavigate();

  const handleApply = async () => {
    try {
      if (newPw !== newPwCheck) {
        alert('신규 비밀번호가 일치하지 않습니다.');

        return;
      }
      const res = await useUserApi.changePassword({
        currentPassword: old,
        newPassword: newPw,
      });

      if (res.status === 200) {
        console.log('비밀번호 변경 성공', res);
        navigate('/home');
      } else {
        console.error('비밀번호 변경 실패', res);
      }
    } catch (e) {
      console.error('비밀번호 변경 실패', e);
    }
  };

  useEffect(() => {
    {
      const fetchMe = async () => {
        try {
          const res = await useUserApi.me();
          setUserName(res.data.userName);
          setUserDept(res.data.deptName);
        } catch (e) {
          console.error('내 정보 조회 실패', e);
        }
      };
      fetchMe();
    }
  }, []);

  return (
    <div>
      <MobileTopBar
        dept={userDept}
        name={userName}
        title="2026학년도 하반기 정기 전학대회"
        back={true}
      />
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row justify-center items-center gap-6">
          <p className="text-base font-semibold">기존 비밀번호</p>
          <input
            className="w-58 py-2 px-3 rounded bg-zinc-100 text-left"
            type="password"
            placeholder="기존 비밀번호 입력"
            value={old}
            onChange={(v) => setOld(v.target.value)}
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-6">
          <p className="text-base font-semibold">신규 비밀번호</p>
          <input
            className="w-58 py-2 px-3 rounded bg-zinc-100 text-left"
            type="password"
            placeholder="신규 비밀번호 입력"
            value={newPw}
            onChange={(v) => setNewPw(v.target.value)}
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-6">
          <p className="text-base font-semibold">비밀번호 확인</p>
          <input
            className="w-58 py-2 px-3 rounded bg-zinc-100 text-left"
            type="password"
            placeholder="비밀번호 확인"
            value={newPwCheck}
            onChange={(v) => setNewPwCheck(v.target.value)}
          />
        </div>
      </div>

      <BottomButton
        text1={'취소하기'}
        color1={'gray'}
        onClick1={() => setPopup2(true)}
        text2={'비밀번호 변경하기'}
        color2={'blue'}
        onClick2={() => setPopup1(true)}
      />

      <PopUpCard
        isOpen={popup1}
        onRequestClose={() => setPopup1(false)}
        title={'비밀번호 변경하기'}
        descript={'비밀번호를 변경하시겠습니까?'}
        input={false}
        placeholder=""
        first="돌아가기"
        second="변경하기"
        onFirstClick={() => setPopup1(false)}
        onSecondClick={() => {
          handleApply();
        }}
      />

      <PopUpCard
        isOpen={popup2}
        onRequestClose={() => setPopup2(false)}
        title={'취소하기'}
        descript={'현재까지 작성한 내용은 저장되지 않습니다.'}
        input={false}
        placeholder=""
        first="돌아가기"
        second="취소하기"
        onFirstClick={() => setPopup2(false)}
        onSecondClick={() => {
          navigate('/home');
          setOld('');
          setNewPw('');
          setNewPwCheck('');
        }}
      />

      <PopUpCard
        isOpen={popup3}
        onRequestClose={() => setPopup3(false)}
        title={'입력 오류'}
        descript={'신규 비밀번호가 일치하지 않습니다.'}
        input={false}
        placeholder=""
        first="돌아가기"
        onFirstClick={() => setPopup3(false)}
      />

      <PopUpCard
        isOpen={popup4}
        onRequestClose={() => setPopup4(false)}
        title={'변경 완료'}
        descript={'비밀번호가 변경되었습니다.'}
        input={false}
        placeholder=""
        first="돌아가기"
        onFirstClick={() => setPopup4(false)}
      />
    </div>
  );
};

export default Password;
