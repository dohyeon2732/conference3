import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import Password from '../pages/Password';
import Home from '../pages/Home';
import Result from '../pages/manager/Result';
import Attend from '../pages/manager/Attend';
import AgendaList from '../pages/manager/AgendaList';
import Member from '../pages/manager/Member';
import Agenda from '../pages/manager/Agenda';
import LoginManager from '../pages/LoginManager';
import ManagerLayout from '../layouts/ManagerLayout';
import { UserRealtimeProvider } from '../contexts/UserRealtimeContext';
import Setting from '../pages/manager/Setting';
import { ManagerRealtimeProvider } from '../contexts/ManagerRealtimeContext';

// const AuthGuard = ({ children }: { children: JSX.Element }) => {
//   const token = localStorage.getItem("accessToken");
//   if (!token) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };
const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/manager/login', element: <LoginManager /> },
  {
    path: '/manager/result',
    element: (
      <ManagerRealtimeProvider>
        <Result />
      </ManagerRealtimeProvider>
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
    element: <ManagerLayout />,
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
