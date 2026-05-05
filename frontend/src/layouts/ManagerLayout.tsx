import { Outlet } from 'react-router-dom';

import TopBar from '../components/manager/TopBar';
import SideBar from '../components/manager/SideBar';
import { ManagerRealtimeProvider } from '../contexts/ManagerRealtimeContext';

const ManagerLayout = () => {
  return (
    <ManagerRealtimeProvider>
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex flex-1 mt-20">
          <SideBar />
          <Outlet />
        </div>
      </div>
    </ManagerRealtimeProvider>
  );
};

export default ManagerLayout;
