import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://conferenceapi.momentum57.cloud';
const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || '총학생회';

export const options = {
  stages: [
    { duration: '30s', target: 30 },
    { duration: '1m', target: 75 },
    { duration: '1m', target: 150 },
    { duration: '2m', target: 150 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    checks: ['rate>0.98'],
  },
};

function jsonHeaders(token) {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}

export function setup() {
  const login = http.post(
    `${BASE_URL}/user/admin-login`,
    JSON.stringify({ password: ADMIN_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(login, {
    'admin login is 200': (res) => res.status === 200,
    'admin token exists': (res) => Boolean(res.json('accessToken')),
  });

  return {
    adminToken: login.json('accessToken'),
  };
}

export default function (data) {
  const params = jsonHeaders(data.adminToken);

  const state = http.get(`${BASE_URL}/state`, params);
  const userCount = http.get(`${BASE_URL}/user/count`, params);
  const dept = http.get(`${BASE_URL}/dept`, params);
  const users = http.get(`${BASE_URL}/user`, params);
  const agendas = http.get(`${BASE_URL}/agenda`, params);

  check(state, {
    'GET /state is 200': (res) => res.status === 200,
  });
  check(userCount, {
    'GET /user/count is 200': (res) => res.status === 200,
  });
  check(dept, {
    'GET /dept is 200': (res) => res.status === 200,
  });
  check(users, {
    'GET /user is 200': (res) => res.status === 200,
  });
  check(agendas, {
    'GET /agenda is 200': (res) => res.status === 200,
  });

  sleep(1);
}
