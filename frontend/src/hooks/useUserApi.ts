import api from '../apis/axios';

export const useUserApi = {
  login: (data: { deptName: string; userName: string; password: string }) =>
    api.post('user/login', data),

  me: () => api.get('/user/me'),
  findAll: () => api.get('/user'),
  create: (data: {
    userName: string;
    password: string;
    userPos: string;
    deptId: number;
    emergency: boolean;
  }) => api.post('/user', data),

  find: (data: { userId: number }) => api.get(`/user/id/${data.userId}`),
  delete: (data: { userId: number }) => api.delete(`/user/id/${data.userId}`),

  findByDept: (data: { deptId: number }) =>
    api.get(`/user/dept/${data.deptId}`),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/user/password', data),

  countAttend: () => api.get('/user/count'),
  attendCheck: (data: { userId: number }) =>
    api.patch(`/user/attendance/${data.userId}`, data),

  countAttendStream: (
    onMessage: (data: { totalCount: number; attendanceCount: number }) => void,
    onError: (error: Event) => void,
  ) => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/user/count/stream`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    eventSource.onerror = (error) => {
      if (onError) {
        onError(error);
      }
    };
    return eventSource;
  },

  attendStream: (
    onMessage: (data: { userId: number; attend: boolean }) => void,
    onError: (error: Event) => void,
  ) => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/user/attendance/stream`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    eventSource.onerror = (error) => {
      if (onError) {
        onError(error);
      }
    };
    return eventSource;
  },
};
