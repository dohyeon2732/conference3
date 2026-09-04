import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://conferenceapi.momentum57.cloud';
const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || '총학생회';
const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD || '1234';
const USER_COUNT = Number(__ENV.USER_COUNT || 100);
const DEPT_NAME = __ENV.DEPT_NAME || `부하테스트-${Date.now()}`;

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    checks: ['rate>0.95'],
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1500'],
  },
};

function authHeaders(token) {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}

export default function () {
  const login = http.post(
    `${BASE_URL}/user/admin-login`,
    JSON.stringify({ password: ADMIN_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(login, {
    'admin login is 200': (res) => res.status === 200,
    'admin token exists': (res) => Boolean(res.json('accessToken')),
  });

  const token = login.json('accessToken');
  const params = authHeaders(token);

  const dept = http.post(
    `${BASE_URL}/dept`,
    JSON.stringify({ deptName: DEPT_NAME }),
    params,
  );

  check(dept, {
    'create test dept is 200': (res) => res.status === 200,
  });

  const deptId = dept.json('deptId');

  for (let i = 1; i <= USER_COUNT; i += 1) {
    const padded = String(i).padStart(3, '0');
    const user = http.post(
      `${BASE_URL}/user`,
      JSON.stringify({
        userName: `테스트학생${padded}`,
        password: TEST_USER_PASSWORD,
        userPos: `테스트직책${padded}`,
        deptId,
        emergency: false,
      }),
      params,
    );

    check(user, {
      [`create test user ${padded} is 200`]: (res) => res.status === 200,
    });

    if (user.status === 200 && user.json('attend') !== true) {
      const attendance = http.patch(
        `${BASE_URL}/user/attendance/${user.json('userId')}`,
        JSON.stringify({ userId: user.json('userId') }),
        params,
      );

      check(attendance, {
        [`mark test user ${padded} attended is 200`]: (res) =>
          res.status === 200 && res.json('attend') === true,
      });
    }
  }

  console.log(`created ${USER_COUNT} attended users in dept "${DEPT_NAME}"`);
}
