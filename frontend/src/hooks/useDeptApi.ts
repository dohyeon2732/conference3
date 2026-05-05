import api from '../apis/axios';

export const useDeptApi = {
  findAll: () => api.get('/dept'),
  make: (data: { deptName: string }) => api.post('/dept', data),
  find: (deptId: number) => api.get(`/dept/${deptId}`),
  delete: (deptId: number) => api.delete(`/dept/${deptId}`),
};
