export const CASE_TYPES = ["GENERAL_PAPER_REVIEW", "MEDICAL_PAPER_REVIEW"] as const;
export const PUBLICATION_STATUSES = ["DRAFT", "UNDER_REVIEW", "PUBLISHED", "ARCHIVED", "WITHDRAWN"] as const;
export const DOCUMENT_ROLES = ["PAPER_SOURCE", "ORDINARY_AI_REVIEW", "LIHUO_REVIEW"] as const;
export const REVIEW_TYPES = ["ORDINARY_AI", "LIHUO"] as const;
export const GENERAL_STATUSES = ["PASS", "LIMIT", "HOLD", "FAIL", "PARTIAL", "NOT_ASSESSED", "NOT_APPLICABLE", "UNAUDITABLE"] as const;
export const MEDICAL_ADMISSIBILITY = [
  "NOT_CLINICALLY_ADMISSIBLE",
  "STRUCTURALLY_REVIEWABLE_ONLY",
  "EVIDENCE_CHAIN_LIMITED",
  "EVIDENCE_CHAIN_CONDITIONAL_HOLD",
  "SUPPORTIVE_EVIDENCE_ONLY",
  "READY_FOR_EXPERT_REVIEW",
  "ADMISSIBLE_WITH_BOUNDARY",
] as const;
export const CLINICAL_READINESS = [
  "NOT_READY",
  "RESEARCH_ONLY",
  "TRIAGE_ONLY",
  "ASSISTIVE_ONLY",
  "PARTIALLY_READY_CAUTION",
  "READY_FOR_PROSPECTIVE_VALIDATION",
  "CLINICALLY_ADMISSIBLE_WITH_BOUNDARY",
] as const;
export const EVIDENCE_GROUNDING = [
  "OBSERVED_IN_TEXT",
  "DIRECT_NUMERIC_CONFLICT",
  "METHOD_RISK_INFERRED",
  "CLINICAL_TRANSLATION_RISK",
  "NEEDS_SUPPLEMENTAL_CHECK",
  "UNSUPPORTED_BY_TEXT",
] as const;
export const GENERAL_AXES = [
  "structural_reviewability",
  "premise_integrity",
  "claim_authority",
  "formal_completeness",
  "empirical_support",
  "ontology_status",
  "engineering_testability",
  "failure_boundary_quality",
  "review_completion",
] as const;
export const ALLOWED_MIME_TYPES = ["application/pdf", "text/plain", "text/markdown"] as const;
export const DEFAULT_BUCKET = "case-documents";
