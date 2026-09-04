# Conference Load Tests

k6 기반 부하 테스트입니다. 운영 서버에 실행할 수 있지만 `vote-150.js`는 실제 안건, 출석부, 투표 데이터를 생성합니다.

## 설치

```bash
brew install k6
```

## 1. 빠른 연결 확인

```bash
k6 run load-tests/smoke.js
```

## 2. 관리자 조회 API 150명 테스트

```bash
ADMIN_PASSWORD='총학생회' k6 run load-tests/read-150.js
```

## 3. 의결/동시 투표 150명 테스트

학생 계정들의 기본 비밀번호가 `1234`일 때:

```bash
ADMIN_PASSWORD='총학생회' USER_PASSWORD='1234' k6 run load-tests/vote-150.js
```

## 테스트 학생 생성

기존 학생 수가 부족하면 테스트용 학생을 먼저 생성하세요.

```bash
ADMIN_PASSWORD='총학생회' TEST_USER_PASSWORD='1234' USER_COUNT=100 k6 run load-tests/seed-users.js
```

생성 후 같은 비밀번호로 투표 테스트를 실행합니다.

```bash
ADMIN_PASSWORD='총학생회' USER_PASSWORD='1234' k6 run load-tests/vote-150.js
```

이미 만든 `부하테스트-*` 사용자들을 모두 출석 처리하려면:

```bash
ADMIN_PASSWORD='총학생회' k6 run load-tests/mark-test-users-attended.js
```

대상 서버를 바꾸려면:

```bash
BASE_URL='https://conferenceapi.momentum57.cloud' ADMIN_PASSWORD='총학생회' USER_PASSWORD='1234' k6 run load-tests/vote-150.js
```

## 서버 모니터링

테스트 중 EC2에서 같이 확인하세요.

```bash
top
free -h
sudo journalctl -u conference -f
sudo ss -ant | wc -l
```

## 주의

- `vote-150.js`는 관리자 로그인 후 새 안건을 만들고 회의 상태를 `VOTING`으로 바꿉니다.
- 테스트 종료 시 상태를 `RESULT`로 바꾸고 안건을 close 처리합니다.
- 운영 중 실제 회의가 진행 중이면 실행하지 마세요.
- 학생 비밀번호가 서로 다르면 `USER_PASSWORD` 하나로 로그인할 수 없어 동시 투표 테스트가 제한됩니다.
