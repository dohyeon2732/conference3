import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import type { ReactNode } from 'react';
import Login from '../pages/Login';
import Password from '../pages/Password';
import Home from '../pages/Home';
import Result from '../pages/manager/Result';
import Attend from '../pages/manager/Attend';
import AgendaList from '../pages/manager/AgendaList';
import Member from '../pages/manager/Member';
import Agenda from '../pages/manager/Agenda';
import LoginManager from '../pages/LoginManager';
import PublicAttend from '../pages/PublicAttend';
import ManagerLayout from '../layouts/ManagerLayout';
import { UserRealtimeProvider } from '../contexts/UserRealtimeContext';
import Setting from '../pages/manager/Setting';
import { ManagerRealtimeProvider } from '../contexts/ManagerRealtimeContext';

const getTokenRole = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
};

const ManagerAuthGuard = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('accessToken');

  if (!token || getTokenRole(token) !== 'ADMIN') {
    alert('관리자 로그인이 필요합니다.');
    localStorage.removeItem('accessToken');
    return <Navigate to="/" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/attendance', element: <PublicAttend /> },
  { path: '/manager/login', element: <LoginManager /> },
  {
    path: '/manager/result',
    element: (
      <ManagerAuthGuard>
        <ManagerRealtimeProvider>
          <Result />
        </ManagerRealtimeProvider>
      </ManagerAuthGuard>
    ),
  },

  {
    path: '/home',
    element: (
      <UserRealtimeProvider>
        <Home />
      </UserRealtimeProvider>
    ),
  },
  { path: '/password', element: <Password /> },

  {
    path: '/manager',
    element: (
      <ManagerAuthGuard>
        <ManagerLayout />
      </ManagerAuthGuard>
    ),
    children: [
      { path: 'attend', element: <Attend /> },
      { path: 'agendalist', element: <AgendaList /> },
      { path: 'member', element: <Member /> },
      { path: 'agenda', element: <Agenda /> },
      { path: 'setting', element: <Setting /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
