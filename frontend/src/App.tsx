import { useEffect } from 'react';
import AppRouter from './router/Router';
import api from './apis/axios';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/users/me').catch(() => {
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
