import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://conferenceapi.momentum57.cloud';
const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || '총학생회';
const USER_PASSWORD = __ENV.USER_PASSWORD || '1234';
const TEST_AGENDA_NAME =
  __ENV.TEST_AGENDA_NAME || `k6-load-test-${Date.now()}`;

export const options = {
  scenarios: {
    concurrent_vote: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 30 },
        { duration: '30s', target: 75 },
        { duration: '30s', target: 150 },
        { duration: '1m', target: 150 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.03'],
    http_req_duration: ['p(95)<1500', 'p(99)<3000'],
    checks: ['rate>0.97'],
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

function loginAdmin() {
  const res = http.post(
    `${BASE_URL}/user/admin-login`,
    JSON.stringify({ password: ADMIN_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(res, {
    'admin login is 200': (r) => r.status === 200,
    'admin token exists': (r) => Boolean(r.json('accessToken')),
  });

  return res.json('accessToken');
}

function loginStudent(deptName, userName) {
  const res = http.post(
    `${BASE_URL}/user/login`,
    JSON.stringify({ deptName, userName, password: USER_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  if (res.status !== 200) {
    return null;
  }

  return {
    deptName,
    userName,
    token: res.json('accessToken'),
    userId: res.json('userId'),
  };
}

function loadStudentSessions(limit) {
  const sessions = [];
  const depts = http.get(`${BASE_URL}/dept`).json();

  for (const dept of depts) {
    const users = http.get(`${BASE_URL}/user/dept/${dept.deptId}`).json();

    for (const user of users) {
      if (sessions.length >= limit) {
        return sessions;
      }

      const session = loginStudent(dept.deptName, user.userName);
      if (session) {
        sessions.push(session);
      }
    }
  }

  return sessions;
}

export function setup() {
  const adminToken = loginAdmin();
  const adminParams = authHeaders(adminToken);
  const students = loadStudentSessions(150);

  check(null, {
    'at least one student logged in': () => students.length > 0,
  });

  const agenda = http.post(
    `${BASE_URL}/agenda`,
    JSON.stringify({
      agendaName: TEST_AGENDA_NAME,
      agendaState: true,
      agendaMinimum: false,
    }),
    adminParams,
  );

  check(agenda, {
    'create agenda is 200': (res) => res.status === 200,
  });

  const agendaId = agenda.json('agendaId');

  const attendance = http.post(
    `${BASE_URL}/attendance`,
    JSON.stringify({ agendaId }),
    adminParams,
  );

  check(attendance, {
    'create attendance list is 200': (res) => res.status === 200,
  });

  const state = http.put(
    `${BASE_URL}/state`,
    JSON.stringify({ currentState: 'VOTING', currentAgendaId: agendaId }),
    adminParams,
  );

  check(state, {
    'change state to VOTING is 200': (res) => res.status === 200,
  });

  const votingStudents = [];

  for (const student of students) {
    const studentParams = authHeaders(student.token);
    const attendanceByUser = http.get(
      `${BASE_URL}/attendance/agenda/${agendaId}/user/${student.userId}`,
      studentParams,
    );

    if (attendanceByUser.status !== 200) {
      continue;
    }

    const attendanceId = attendanceByUser.json('attendanceId');
    const initialVote = http.post(
      `${BASE_URL}/vote`,
      JSON.stringify({ attendanceId, voteValue: 'ABSTAIN' }),
      studentParams,
    );

    if (initialVote.status === 200) {
      votingStudents.push({
        ...student,
        attendanceId,
      });
    }
  }

  check(null, {
    'at least one initial vote exists': () => votingStudents.length > 0,
  });

  return {
    adminToken,
    agendaId,
    students: votingStudents,
  };
}

export default function (data) {
  const students = data.students;
  const student = students[(__VU - 1) % students.length];
  const params = authHeaders(student.token);

  const state = http.get(`${BASE_URL}/state`, params);
  check(state, {
    'student GET /state is 200': (res) => res.status === 200,
  });

  const agenda = http.get(`${BASE_URL}/agenda/${data.agendaId}`, params);
  check(agenda, {
    'student GET /agenda/{id} is 200': (res) => res.status === 200,
  });

  const voteValues = ['AGREE', 'DISAGREE', 'ABSTAIN'];
  const voteValue = voteValues[(__ITER + __VU) % voteValues.length];

  const vote = http.put(
    `${BASE_URL}/vote`,
    JSON.stringify({ attendanceId: student.attendanceId, voteValue }),
    params,
  );

  check(vote, {
    'student vote update is 200': (res) => res.status === 200,
  });

  sleep(1);
}

export function teardown(data) {
  const params = authHeaders(data.adminToken);

  http.put(
    `${BASE_URL}/state`,
    JSON.stringify({ currentState: 'RESULT', currentAgendaId: data.agendaId }),
    params,
  );

  http.put(`${BASE_URL}/agenda/close/${data.agendaId}`, null, params);
}
