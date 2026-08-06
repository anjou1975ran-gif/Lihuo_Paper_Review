# Test report

Generated: 2026-08-06

## Executed

| Check | Result | Evidence |
|---|---|---|
| Required artifact structure | PASS | `test-results/verify.log` |
| Security smoke checks | PASS | `test-results/security-smoke.log` |
| Case filter and publish-check logic | PASS | `test-results/logic-smoke.log` |
| TypeScript syntax parsing | PASS | `test-results/typescript-syntax.log` |
| Stub-assisted semantic and no-unused pass | PASS (LOCAL CODE ONLY) | `test-results/typescript-semantic-stub.log`; external library types were stubbed, so this is not the full framework typecheck |
| Empty seed / no fictional cases | PASS | `supabase/seed.sql` and security smoke check |
| Static visual captures | CREATED | `screenshots/*.png`; these are visual verification captures, not live browser E2E evidence |

## Attempted but not completed

| Check | Result | Reason |
|---|---|---|
| `npm install` | FAIL | The execution environment's internal npm registry returned HTTP 404 for `@supabase/ssr`; a public-registry retry could not resolve the external host. See `test-results/npm-install.log`. |
| `npm run build` | NOT RUN TO COMPLETION | Dependencies were unavailable, so `next` was not installed; see `test-results/build.log`. |
| `npm run lint` | NOT RUN TO COMPLETION | Dependencies were unavailable, so local `eslint` was not installed; see `test-results/lint.log`. |
| `npm run typecheck` | NOT RUN TO COMPLETION | Framework and React type packages were unavailable; see `test-results/typecheck.log`. |
| Supabase migration execution | NOT EXECUTED | No external Supabase project was provided. |
| Vercel deployment | NOT EXECUTED | No external Vercel project or credentials were provided. |
| End-to-end browser test against live backend | NOT EXECUTED | Requires installed dependencies and a configured Supabase project. |

No unavailable test is reported as PASS.
