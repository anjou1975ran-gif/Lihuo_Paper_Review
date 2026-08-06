import type { CASE_TYPES, DOCUMENT_ROLES, GENERAL_AXES, GENERAL_STATUSES, PUBLICATION_STATUSES } from "@/lib/constants";

export type CaseType = (typeof CASE_TYPES)[number];
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];
export type DocumentRole = (typeof DOCUMENT_ROLES)[number];
export type GeneralAxis = (typeof GENERAL_AXES)[number];
export type GeneralStatus = (typeof GENERAL_STATUSES)[number];

export type AxisState = {
  status: GeneralStatus;
  reason: string;
  evidence_anchor: string;
  missing_evidence: string;
};

export type ReviewOutputInput = {
  system_name?: string;
  system_version?: string;
  reasoning_mode?: string;
  review_date?: string;
  review_prompt_summary?: string;
  short_summary?: string;
  final_judgment?: string;
  full_text?: string;
  source_scope?: string;
  evidence_boundary?: string;
  missing_evidence?: string;
  required_revision?: string;
  notes?: string;
};

export type CaseFormPayload = {
  case: {
    title: string;
    slug: string;
    summary: string;
    paper_title: string;
    authors: string[];
    journal?: string;
    publication_year?: number | null;
    doi?: string;
    original_url?: string;
    domain?: string;
    keywords: string[];
    language: string;
    case_type: CaseType;
    publication_status: PublicationStatus;
    review_date?: string;
    citation?: string;
    source_note?: string;
    paper_abstract?: string;
    partial_case?: boolean;
    permissions_confirmed?: boolean;
    privacy_checked?: boolean;
  };
  paper_source: {
    source_type?: string;
    pasted_text?: string;
    copyright_note?: string;
    public_download_allowed?: boolean;
  };
  ordinary_review: ReviewOutputInput;
  lihuo_review: ReviewOutputInput;
  general_review_states: Record<GeneralAxis, AxisState>;
  medical_review_state?: Record<string, unknown> | null;
  comparison_summary: Record<string, string>;
};

export type PublicCase = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  paper_title: string;
  authors: string[];
  journal: string | null;
  publication_year: number | null;
  doi: string | null;
  original_url: string | null;
  domain: string | null;
  keywords: string[];
  language: string;
  case_type: CaseType;
  publication_status: PublicationStatus;
  published_at: string | null;
  review_outputs?: Array<{
    review_type: "ORDINARY_AI" | "LIHUO";
    short_summary: string | null;
    final_judgment: string | null;
    system_name: string | null;
    system_version: string | null;
    reasoning_mode: string | null;
    review_date: string | null;
    full_text: string | null;
    source_scope: string | null;
    evidence_boundary: string | null;
    missing_evidence: string | null;
    required_revision: string | null;
    notes: string | null;
  }>;
  general_review_states?: Array<Record<string, any>>;
  medical_review_states?: Array<Record<string, any>>;
  comparison_summaries?: Array<Record<string, unknown>>;
  case_documents?: Array<Record<string, unknown>>;
};
