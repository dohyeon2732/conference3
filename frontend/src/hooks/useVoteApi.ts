import api from '../apis/axios';

type VoteValue = 'AGREE' | 'DISAGREE' | 'ABSTAIN';

export const useVoteApi = {
  make: (data: { attendanceId: number; voteValue: VoteValue }) =>
    api.post('/vote', data),
  change: (data: { attendanceId: number; voteValue: VoteValue }) =>
    api.put('/vote', data),

  result: (data: { agendaId: number }) =>
    api.get(`/vote/result/${data.agendaId}`),

  list: (data: { agendaId: number }) =>
    api.get(`/vote/agenda/${data.agendaId}`),
};
