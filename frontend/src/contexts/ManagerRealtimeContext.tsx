import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { useStateApi, type StateValue } from '../hooks/useStateApi';
import { useUserApi } from '../hooks/useUserApi';

type AttendanceCount = {
  totalCount: number;
  attendanceCount: number;
};

type AttendanceUpdate = {
  userId: number;
  attend: boolean;
};

type ManagerRealtimeContextValue = {
  state: StateValue;
  currentAgendaId: number | null;
  totalCount: number;
  attendCount: number;
  latestAttendanceUpdate: AttendanceUpdate | null;
  refreshState: () => Promise<void>;
  refreshAttendanceCount: () => Promise<void>;
};

const ManagerRealtimeContext =
  createContext<ManagerRealtimeContextValue | null>(null);

export const ManagerRealtimeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<StateValue>('PROGRESS');
  const [currentAgendaId, setCurrentAgendaId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [attendCount, setAttendCount] = useState(0);
  const [latestAttendanceUpdate, setLatestAttendanceUpdate] =
    useState<AttendanceUpdate | null>(null);

  const refreshState = async () => {
    const res = await useStateApi.state();
    setState(res.data.currentState);
    setCurrentAgendaId(res.data.currentAgendaId);
  };

  const refreshAttendanceCount = async () => {
    const res = await useUserApi.countAttend();
    setTotalCount(res.data.totalCount);
    setAttendCount(res.data.attendanceCount);
  };

  useEffect(() => {
    refreshState();
    refreshAttendanceCount();
  }, []);

  useEffect(() => {
    const eventSource = useStateApi.stateStream(
      (data) => {
        setState(data.currentState);
        setCurrentAgendaId(data.currentAgendaId);
      },
      (error) => {
        console.error('상태 SSE 연결 오류', error);
      },
    );

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const eventSource = useUserApi.countAttendStream(
      (data: AttendanceCount) => {
        setTotalCount(data.totalCount);
        setAttendCount(data.attendanceCount);
      },
      (error) => {
        console.error('출석 인원 SSE 연결 오류', error);
      },
    );

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const eventSource = useUserApi.attendStream(
      (data: AttendanceUpdate) => {
        setLatestAttendanceUpdate(data);
      },
      (error) => {
        console.error('출석 상태 SSE 연결 오류', error);
      },
    );

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <ManagerRealtimeContext.Provider
      value={{
        state,
        currentAgendaId,
        totalCount,
        attendCount,
        latestAttendanceUpdate,
        refreshState,
        refreshAttendanceCount,
      }}
    >
      {children}
    </ManagerRealtimeContext.Provider>
  );
};

export const useManagerRealtime = () => {
  const context = useContext(ManagerRealtimeContext);

  if (!context) {
    throw new Error(
      'useManagerRealtime must be used inside ManagerRealtimeProvider',
    );
  }

  return context;
};
