import { applyCaseFilters } from "../lib/case-filter";
import { buildPublishChecks } from "../lib/publish-check";
import { assessPublication } from "../lib/publication-guard";
import { GENERAL_AXES } from "../lib/constants";

const cases: any[] = [
  {
    id: "1",
    title: "Alpha",
    paper_title: "Cardiology model",
    authors: ["Chen"],
    journal: "Journal A",
    doi: "10.1/a",
    keywords: ["medical"],
    review_outputs: [{ review_type: "LIHUO", final_judgment: "HOLD" }],
    general_review_states: [{ claim_authority: { status: "LIMIT" }, empirical_support: { status: "PARTIAL" } }],
    medical_review_states: [{ clinical_use_readiness: "NOT_READY", evidence_grounding_level: "METHOD_RISK_INFERRED" }],
  },
  {
    id: "2",
    title: "Beta",
    paper_title: "General theory",
    authors: ["Lin"],
    journal: "Journal B",
    doi: "10.1/b",
    keywords: ["ontology"],
    review_outputs: [{ review_type: "LIHUO", final_judgment: "RELEASE" }],
    general_review_states: [{ claim_authority: { status: "PASS" }, empirical_support: { status: "PASS" } }],
    medical_review_states: [],
  },
];

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(applyCaseFilters(cases as any, { q: "chen" }).length === 1, "author search failed");
assert(applyCaseFilters(cases as any, { claim: "LIMIT" })[0]?.id === "1", "claim filter failed");
assert(applyCaseFilters(cases as any, { readiness: "NOT_READY" })[0]?.id === "1", "readiness filter failed");
assert(applyCaseFilters(cases as any, { review_status: "RELEASE" })[0]?.id === "2", "review status filter failed");

const checks = buildPublishChecks({
  summary: "summary",
  citation: "citation",
  paperSourceExists: true,
  ordinaryReviewExists: true,
  lihuoReviewExists: true,
  importantStatesComplete: false,
  permissionConfirmed: true,
  privacyConfirmed: true,
});
assert(checks.filter((item) => !item.ok).length === 1, "publish checks did not preserve warning state");

const completeStates = Object.fromEntries(
  GENERAL_AXES.map((axis) => [axis, { status: "PASS", reason: "", evidence_anchor: "", missing_evidence: "" }]),
);
const publicationPayload: any = {
  case: {
    summary: "summary",
    citation: "citation",
    source_note: "",
    permissions_confirmed: true,
    privacy_checked: true,
    partial_case: false,
  },
  paper_source: { pasted_text: "" },
  ordinary_review: { full_text: "", short_summary: "" },
  lihuo_review: { full_text: "", short_summary: "" },
  general_review_states: completeStates,
};

const fileBackedAssessment = assessPublication(publicationPayload, ["PAPER_SOURCE", "ORDINARY_AI_REVIEW", "LIHUO_REVIEW"]);
assert(fileBackedAssessment.confirmationsMissing.length === 0, "confirmed publication was rejected");
assert(fileBackedAssessment.contentMissing.length === 0, "uploaded documents were not accepted as publication content");

publicationPayload.case.permissions_confirmed = false;
const missingConfirmation = assessPublication(publicationPayload, ["PAPER_SOURCE", "ORDINARY_AI_REVIEW", "LIHUO_REVIEW"]);
assert(missingConfirmation.confirmationsMissing.length === 1, "permission confirmation was not enforced");

console.log("Logic smoke checks passed.");
