import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://conferenceapi.momentum57.cloud';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const responses = {
    dept: http.get(`${BASE_URL}/dept`),
  };

  check(responses.dept, {
    'GET /dept is 200': (res) => res.status === 200,
  });
}
