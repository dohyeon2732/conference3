import api from '../apis/axios';

export type StateValue = 'PROGRESS' | 'STOP' | 'VOTING' | 'RESULT';

const getStreamUrl = (path: string) => {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ?? 'https://conferenceapi.momentum57.cloud';
  const url = new URL(path, baseUrl);
  const token = localStorage.getItem('accessToken');

  if (token) {
    url.searchParams.set('accessToken', token);
  }

  return url.toString();
};

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
    const eventSource = new EventSource(getStreamUrl('/state/stream'));
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
