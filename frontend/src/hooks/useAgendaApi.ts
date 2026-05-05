import api from '../apis/axios';

export const useAgendaApi = {
  findAll: () => api.get('/agenda'),
  create: (data: {
    agendaName: string;
    agendaState: boolean;
    agendaMinimum: boolean;
  }) => api.post('/agenda', data),
  close: (data: { agendaId: number }) =>
    api.put(`/agenda/close/${data.agendaId}`),
  findById: (data: { agendaId: number }) => api.get(`/agenda/${data.agendaId}`),
  delete: (data: { agendaId: number }) =>
    api.delete(`/agenda/${data.agendaId}`),
};
