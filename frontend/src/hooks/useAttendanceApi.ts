import api from '../apis/axios';

export const useAttendanceApi = {
  find: () => api.get('/attendance'),
  create: (data: { agendaId: number }) => api.post('/attendance', data),

  findById: (data: { attendanceId: number }) =>
    api.get(`/attendance/${data.attendanceId}`),
  delete: (data: { attendanceId: number }) =>
    api.delete(`/attendance/${data.attendanceId}`),
  findByAgendaId: (data: { agendaId: number }) =>
    api.get(`/attendance/agenda/${data.agendaId}`),
  findByAgendaIdUserId: (data: { agendaId: number; userId: number }) =>
    api.get(`/attendance/agenda/${data.agendaId}/user/${data.userId}`),
};
