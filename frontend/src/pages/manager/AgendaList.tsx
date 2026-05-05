import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useAgendaApi } from '../../hooks/useAgendaApi';

const AgendaList = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.className = 'pc_white';
  }, []);

  const [agendaList, setAgendaList] = useState<
    {
      agendaId: number;
      agendaName: string;
      agendaState: boolean;
      agendaMinimum: boolean;

      agendaAgree: number;
      agendaDisagree: number;
      agendaAbstain: number;
    }[]
  >([]);

  useEffect(() => {
    const fetchAgendaList = async () => {
      try {
        const res = await useAgendaApi.findAll();
        const sortedData = [...res.data].sort(
          (a, b) => b.agendaId - a.agendaId,
        );
        console.log(sortedData);
        setAgendaList(sortedData);
      } catch (error) {
        console.error('의결 항목 리스트를 불러오는 중 오류 발생:', error);
      }
    };
    fetchAgendaList();
  }, []);

  return (
    <div className=" ml-[294px] flex flex-col w-[calc(100vw-314px)] ">
      <div className="fixed w-[calc(100vw-294px)] left-[294px] top-[80px] w-[1000px] h-22 flex flex-row items-center justify-between px-10 gap-6 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] ">
        <div className="flex flex-row gap-5">
          <p className="text-3xl font-bold">의결 항목 리스트</p>
          <p className="text-3xl font-normal">{agendaList.length}개</p>
        </div>
        <button
          className="w-32 h-12 bg-[#86A6FF] rounded-lg text-white text-2xl font-bold"
          onClick={() => navigate('/manager/agenda')}
        >
          의결하기
        </button>
      </div>
      <div className="flex flex-col gap-7 mt-[90px] pt-8 mx-8">
        {agendaList.map((agenda) => (
          <div
            key={agenda.agendaId}
            className="flex flex-row w-[calc(100vw-360px)] h-[110px] px-6 py-12  items-center justify-between bg-zinc-100 rounded-lg cursor-default"
            // onClick={() => navigate('/manager/schedule/spec')}
          >
            <div className="flex flex-col gap-[3px]">
              <p className="text-3xl  font-bold">{agenda.agendaName}</p>
            </div>
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-[5px] justify-center">
                <p className="text-xl font-medium text-center">찬성</p>
                <p className="text-4xl font-bold text-center">
                  {agenda.agendaAgree}
                </p>
              </div>
              <div className="flex flex-col gap-[5px] justify-center">
                <p className="text-xl font-medium text-center">반대</p>
                <p className="text-4xl font-bold text-center">
                  {agenda.agendaDisagree}
                </p>
              </div>
              <div className="flex flex-col gap-[5px] justify-center">
                <p className="text-xl font-medium text-center">기권</p>
                <p className="text-4xl font-bold text-center">
                  {agenda.agendaAbstain}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaList;
