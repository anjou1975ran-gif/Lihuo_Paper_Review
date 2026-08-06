import { z } from "zod";
import { CASE_TYPES, GENERAL_AXES, GENERAL_STATUSES, PUBLICATION_STATUSES } from "@/lib/constants";

const axisStateSchema = z.object({
  status: z.enum(GENERAL_STATUSES),
  reason: z.string().max(5000).default(""),
  evidence_anchor: z.string().max(10000).default(""),
  missing_evidence: z.string().max(10000).default(""),
});

const reviewOutputSchema = z.object({
  system_name: z.string().max(300).optional().default(""),
  system_version: z.string().max(200).optional().default(""),
  reasoning_mode: z.string().max(300).optional().default(""),
  review_date: z.string().optional().default(""),
  review_prompt_summary: z.string().max(10000).optional().default(""),
  short_summary: z.string().max(10000).optional().default(""),
  final_judgment: z.string().max(10000).optional().default(""),
  full_text: z.string().max(2_000_000).optional().default(""),
  source_scope: z.string().max(10000).optional().default(""),
  evidence_boundary: z.string().max(20000).optional().default(""),
  missing_evidence: z.string().max(20000).optional().default(""),
  required_revision: z.string().max(20000).optional().default(""),
  notes: z.string().max(20000).optional().default(""),
});

export const casePayloadSchema = z.object({
  case: z.object({
    title: z.string().min(1).max(300),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
    summary: z.string().min(1).max(15000),
    paper_title: z.string().min(1).max(1000),
    authors: z.array(z.string().max(300)).default([]),
    journal: z.string().max(500).optional().default(""),
    publication_year: z.number().int().min(1800).max(2200).nullable().optional(),
    doi: z.string().max(300).optional().default(""),
    original_url: z.string().url().optional().or(z.literal("")).default(""),
    domain: z.string().max(300).optional().default(""),
    keywords: z.array(z.string().max(100)).default([]),
    language: z.string().max(80).default("zh-TW"),
    case_type: z.enum(CASE_TYPES),
    publication_status: z.enum(PUBLICATION_STATUSES),
    review_date: z.string().optional().default(""),
    citation: z.string().max(10000).optional().default(""),
    source_note: z.string().max(10000).optional().default(""),
    paper_abstract: z.string().max(50000).optional().default(""),
    partial_case: z.boolean().optional().default(false),
    permissions_confirmed: z.boolean().optional().default(false),
    privacy_checked: z.boolean().optional().default(false),
  }),
  paper_source: z.object({
    source_type: z.string().max(100).optional().default("PASTED_TEXT"),
    pasted_text: z.string().max(2_000_000).optional().default(""),
    copyright_note: z.string().max(10000).optional().default(""),
    public_download_allowed: z.boolean().optional().default(false),
  }),
  ordinary_review: reviewOutputSchema,
  lihuo_review: reviewOutputSchema,
  general_review_states: z.record(z.enum(GENERAL_AXES), axisStateSchema),
  medical_review_state: z.record(z.string(), z.unknown()).nullable().optional(),
  comparison_summary: z.record(z.string(), z.string()),
});
