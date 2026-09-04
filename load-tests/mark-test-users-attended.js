import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://conferenceapi.momentum57.cloud';
const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || '총학생회';
const DEPT_PREFIX = __ENV.DEPT_PREFIX || '부하테스트';

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

  const params = authHeaders(login.json('accessToken'));
  const depts = http.get(`${BASE_URL}/dept`, params).json();
  let changed = 0;
  let alreadyAttended = 0;

  for (const dept of depts) {
    if (!dept.deptName.startsWith(DEPT_PREFIX)) {
      continue;
    }

    const users = http.get(`${BASE_URL}/user/dept/${dept.deptId}`, params).json();

    for (const user of users) {
      if (user.attend === true) {
        alreadyAttended += 1;
        continue;
      }

      const attendance = http.patch(
        `${BASE_URL}/user/attendance/${user.userId}`,
        JSON.stringify({ userId: user.userId }),
        params,
      );

      check(attendance, {
        [`mark user ${user.userId} attended is 200`]: (res) =>
          res.status === 200 && res.json('attend') === true,
      });

      if (attendance.status === 200 && attendance.json('attend') === true) {
        changed += 1;
      }
    }
  }

  console.log(
    `attendance done: changed=${changed}, alreadyAttended=${alreadyAttended}`,
  );
}
