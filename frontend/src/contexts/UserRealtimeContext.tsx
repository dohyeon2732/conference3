import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useStateApi, type StateValue } from '../hooks/useStateApi';
import { useUserApi } from '../hooks/useUserApi';

type AttendanceUpdate = {
  userId: number;
  attend: boolean;
};

type UserRealtimeContextValue = {
  state: StateValue;
  currentAgendaId: number | null;
  myAttendance: boolean;
  latestAttendanceUpdate: AttendanceUpdate | null;
  refreshState: () => Promise<void>;
};

const UserRealtimeContext = createContext<UserRealtimeContextValue | null>(
  null,
);

export const UserRealtimeProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StateValue>('PROGRESS');
  const [currentAgendaId, setCurrentAgendaId] = useState<number | null>(null);
  const [myAttendance, setMyAttendance] = useState(false);
  const [latestAttendanceUpdate, setLatestAttendanceUpdate] =
    useState<AttendanceUpdate | null>(null);

  const [userId, setUserId] = useState(0);

  const refreshState = async () => {
    const res = await useStateApi.state();
    setState(res.data.currentState);
    setCurrentAgendaId(res.data.currentAgendaId);
  };

  useEffect(() => {
    const init = async () => {
      const res = await useUserApi.me();
      setUserId(res.data.userId);
      setMyAttendance(res.data.attend);
    };
    init();
    refreshState();
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
    if (!userId) return;

    const eventSource = useUserApi.attendStream(
      (data: AttendanceUpdate) => {
        setLatestAttendanceUpdate(data);

        if (data.userId === userId) {
          setMyAttendance(data.attend);
        }
      },
      (error) => {
        console.error('출석 상태 SSE 연결 오류', error);
      },
    );

    return () => {
      eventSource.close();
    };
  }, [userId]);

  return (
    <UserRealtimeContext.Provider
      value={{
        state,
        currentAgendaId,
        myAttendance,
        latestAttendanceUpdate,
        refreshState,
      }}
    >
      {children}
    </UserRealtimeContext.Provider>
  );
};

export const useUserRealtime = () => {
  const context = useContext(UserRealtimeContext);

  if (!context) {
    throw new Error('useUserRealtime must be used inside UserRealtimeProvider');
  }
  return context;
};
