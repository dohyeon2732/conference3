import { useState, useEffect } from 'react';
import BlueButton from '../components/button/BlueButton';
import { useNavigate } from 'react-router-dom';
import PopUpCard from '../components/PopUpCard';

const LoginManager = () => {
  useEffect(() => {
    document.body.className = 'mobile';
  }, []);
  const navigate = useNavigate();

  const [popup1, setPopup1] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (password === 'chdgkrtodghl' || password === '총학생회') {
      navigate('/manager/attend'); //home
    } else {
      setPopup1(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div>
        <p className="text-3xl text-center font-semibold">
          2026학년도 하반기 정기
          <br />
          전체학생대표자회의
          <br />
          투표 시스템(관리자)
        </p>
      </div>
      <div className="flex flex-col gap-3">
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
export default LoginManager;
