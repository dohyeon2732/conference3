import api from '../apis/axios';

export type StateValue = 'PROGRESS' | 'STOP' | 'VOTING' | 'RESULT';

export const useStateApi = {
  state: () => api.get('/state'),
  change: (data: {
    currentState: StateValue;
    currentAgendaId: number | null;
  }) => api.put('/state', data),
  make: (data: { currentState: StateValue }) => api.post('/state', data),

  stateStream: (
    onMessage: (data: {
      stateId: number;
      currentState: StateValue;
      currentAgendaId: number | null;
    }) => void,
    onError: (error: Event) => void,
  ) => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/state/stream`,
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
