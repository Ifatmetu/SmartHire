# Unit Testing: SmartHire

## 1. Project Overview

SmartHire is a Next.js 16 and TypeScript job marketplace. The inspected implementation uses Zod schemas, Better Auth, MongoDB, and a Next.js API route for posting jobs. The job creation page validates a form and posts to `/api/jobs`; `lib/actions/jobs.ts` contains a separate helper for an external jobs API.

## 2. Objective

The unit tests verify job-data validation, role checks, external job API behavior, and `/api/jobs` authentication, authorization, validation, database success, and database failure behavior without using a production database or credentials.

## 3. Framework and Tools

- Vitest 3.2.4
- TypeScript
- Zod (existing application dependency)
- Node test environment
- Vitest module mocking and global fetch mocking

Vitest was selected because it supports the project's ESM/TypeScript configuration and allows direct mocking of modules and external boundaries.

## 4. Testing Methodology

- Tests use Arrange-Act-Assert structure.
- Database, authentication, and HTTP boundaries are mocked.
- Tests are independent and do not make network or database connections.
- Business validation is tested through the actual `jobSchema`.
- API behavior is tested through the actual `POST` route and actual `next/server` `NextResponse` implementation, with only authentication, headers, and MongoDB dependencies mocked.
- External action behavior is tested through mocked `fetch`.

## 5. Test Modules

| Module | File |
|---|---|
| Job schema | `tests/lib/job-schema.test.ts` |
| Job creation action | `tests/lib/jobs.test.ts` |
| User role helper | `tests/lib/user-role.test.ts` |
| Jobs API route | `tests/api/jobs.test.ts` |
| Vitest configuration | `vitest.config.ts` |

## 6. Individual Test Cases

| Test ID | Module | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| UT-SCHEMA-001 | Job schema | Accept valid job information | Validation succeeds | Validation succeeded | Passed |
| UT-SCHEMA-002 | Job schema | Reject title shorter than 3 characters | Validation fails at `title` | Failed at `title` | Passed |
| UT-SCHEMA-003 | Job schema | Reject missing company name | Validation fails | Validation failed | Passed |
| UT-SCHEMA-004 | Job schema | Reject short responsibilities | Validation fails | Validation failed | Passed |
| UT-SCHEMA-005 | Job schema | Reject negative salary | Validation fails | Validation failed | Passed |
| UT-SCHEMA-006 | Job schema | Reject maximum salary below minimum | Validation fails | Validation failed | Passed |
| UT-SCHEMA-007 | Job schema | Reject unsupported job type | Validation fails | Validation failed | Passed |
| UT-SCHEMA-008 | Job schema | Accept null salary and deadline values | Validation succeeds | Validation succeeded | Passed |
| UT-SCHEMA-009 | Job schema | Reject fractional vacancies | Validation fails | Validation failed | Passed |
| UT-SCHEMA-010 | Job schema | Reject malformed deadline | Validation fails | Validation failed | Passed |
| UT-SCHEMA-011 | Job schema | Trim title and skill strings | Trimmed values are accepted | Trimmed values returned | Passed |
| UT-SCHEMA-012 | Job schema | Reject an empty skill | Validation fails | Validation failed | Passed |
| UT-SCHEMA-013 | Job schema | Reject zero vacancies | Validation fails | Validation failed | Passed |
| UT-SCHEMA-014 | Job schema | Accept vacancy boundary values | Values 1 and 999 succeed | Boundary values succeeded | Passed |
| UT-SCHEMA-015 | Job schema | Accept equal minimum and maximum salaries | Validation succeeds | Validation succeeded | Passed |
| UT-ACTION-001 | Job action | Send valid payload to external API | Job data is returned and fetch is called | Data returned; fetch called | Passed |
| UT-ACTION-002 | Job action | Reject invalid input before fetch | Zod error thrown; fetch not called | Zod error thrown; fetch not called | Passed |
| UT-ACTION-003 | Job action | Handle API `error` response | API error message is thrown | Error message thrown | Passed |
| UT-ACTION-004 | Job action | Handle API `message` fallback | Message is thrown | Message thrown | Passed |
| UT-ACTION-005 | Job action | Handle HTTP status fallback | Status-based error is thrown | Status error thrown | Passed |
| UT-ACTION-006 | Job action | Handle a non-JSON error response | Status-based error is thrown | Status error thrown | Passed |
| UT-ROLE-001 | Role helper | Accept all supported roles | Returns true | Returned true | Passed |
| UT-ROLE-002 | Role helper | Reject unsupported role | Returns false | Returned false | Passed |
| UT-ROLE-003 | Role helper | Reject non-string role values | Returns false | Returned false | Passed |
| UT-API-001 | Jobs API | Reject unauthenticated request | 401 response | 401 response | Passed |
| UT-API-002 | Jobs API | Reject seeker role | 403 response | 403 response | Passed |
| UT-API-003 | Jobs API | Reject a missing role | 403 response | 403 response | Passed |
| UT-API-004 | Jobs API | Reject malformed JSON | 400 response | 400 response | Passed |
| UT-API-005 | Jobs API | Reject invalid job fields | 400 response | 400 response | Passed |
| UT-API-006 | Jobs API | Create job for recruiter | 201 response and recruiter metadata inserted | 201 response and metadata inserted | Passed |
| UT-API-007 | Jobs API | Allow admin to create job | 201 response | 201 response | Passed |
| UT-API-008 | Jobs API | Handle database failure | 500 response with safe error message | 500 response returned | Passed |

## 7. Installation

```bash
npm install
```

Vitest is listed as a development dependency.

## 8. Execution

```bash
npm test
npm run test:watch
npm run typecheck
```

## 9. Executed Results

The complete suite was executed on 2026-11-23:

- Test files: 4 passed
- Tests: 32 passed
- Failed tests: 0
- Skipped tests: 0
- TypeScript validation: passed

## 10. Known Limitations

- Tests do not connect to MongoDB or Better Auth services.
- Authentication, request headers, and MongoDB are mocked at their module boundaries; the route itself uses the real `NextResponse` implementation.
- The external job action is not integrated into the create-job form; tests cover the helper only.
- UI component rendering and end-to-end browser workflows are outside this unit-testing scope.
