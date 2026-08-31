import { useEffect } from 'react';
import AppRouter from './router/Router';
import api from './apis/axios';

const getTokenRole = (token: string) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.role;
  } catch {
    return null;
  }
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && getTokenRole(token) !== 'ADMIN') {
      api.get('/user/me').catch(() => {
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <AppRouter />
    </div>
  );
}

export default App;
