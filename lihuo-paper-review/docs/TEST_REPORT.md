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
| Safe environment template present | PASS | `.env.example` contains placeholders only |
| Local secret and build output ignore rules present | PASS | `.gitignore` |
| GitHub Actions verification workflow present | CONFIGURED, RESULT PENDING | `.github/workflows/lihuo-paper-review-ci.yml`; a workflow file being present does not prove the run has passed |

## Attempted but not completed

| Check | Result | Reason |
|---|---|---|
| `npm install` | FAIL IN PRIOR EXECUTION ENVIRONMENT | The prior execution environment's internal npm registry returned HTTP 404 for `@supabase/ssr`; a public-registry retry could not resolve the external host. See `test-results/npm-install.log`. |
| `npm run build` | NOT YET VERIFIED IN GITHUB ACTIONS OR VERCEL | The workflow is configured, but no successful external run is recorded here yet. |
| `npm run lint` | NOT YET VERIFIED IN GITHUB ACTIONS OR VERCEL | The workflow is configured, but no successful external run is recorded here yet. |
| `npm run typecheck` | NOT YET VERIFIED IN GITHUB ACTIONS OR VERCEL | The workflow is configured, but no successful external run is recorded here yet. |
| Supabase migration execution | NOT EXECUTED | No external Supabase project has been connected. |
| Vercel deployment | NOT EXECUTED | No external Vercel project has been connected. |
| End-to-end browser test against live backend | NOT EXECUTED | Requires installed dependencies and a configured Supabase project. |

## Empty launch boundary

- No case seed data may be added before initial deployment.
- LIHUO MedReview samples are not imported automatically.
- The first production `/cases` page is expected to show the empty state.
- Real case data is entered manually by the administrator after deployment.

No unavailable or pending test is reported as PASS.
