-- LIHUO Paper Review System initial schema
create extension if not exists pgcrypto;

create type public.case_type as enum ('GENERAL_PAPER_REVIEW','MEDICAL_PAPER_REVIEW');
create type public.publication_status as enum ('DRAFT','UNDER_REVIEW','PUBLISHED','ARCHIVED','WITHDRAWN');
create type public.document_role as enum ('PAPER_SOURCE','ORDINARY_AI_REVIEW','LIHUO_REVIEW');
create type public.review_type as enum ('ORDINARY_AI','LIHUO');

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admin_users a where a.user_id = auth.uid());
$$;

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null,
  paper_title text not null,
  authors text[] not null default '{}',
  journal text,
  publication_year integer check (publication_year is null or publication_year between 1800 and 2200),
  doi text,
  original_url text,
  domain text,
  keywords text[] not null default '{}',
  language text not null default 'zh-TW',
  case_type public.case_type not null,
  publication_status public.publication_status not null default 'DRAFT',
  review_date date,
  citation text,
  source_note text,
  paper_abstract text,
  paper_source_type text not null default 'PASTED_TEXT',
  paper_source_text text,
  copyright_note text,
  partial_case boolean not null default false,
  permissions_confirmed boolean not null default false,
  privacy_checked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  created_by uuid not null references auth.users(id)
);

create table public.case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  document_role public.document_role not null,
  file_path text not null unique,
  file_name text not null,
  mime_type text not null check (mime_type in ('application/pdf','text/plain','text/markdown')),
  file_size bigint not null check (file_size >= 0),
  pasted_text text,
  public_download_allowed boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.review_outputs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  review_type public.review_type not null,
  system_name text,
  system_version text,
  reasoning_mode text,
  review_date date,
  review_prompt_summary text,
  short_summary text,
  final_judgment text,
  full_text text,
  source_scope text,
  evidence_boundary text,
  missing_evidence text,
  required_revision text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(case_id, review_type)
);

create table public.general_review_states (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null unique references public.cases(id) on delete cascade,
  structural_reviewability jsonb not null default '{"status":"NOT_ASSESSED","reason":"","evidence_anchor":"","missing_evidence":""}',
  premise_integrity jsonb not null default '{"status":"NOT_ASSESSED","reason":"","evidence_anchor":"","missing_evidence":""}',
  claim_authority jsonb not null default '{"status":"NOT_ASSESSED","reason":"","evidence_anchor":"","missing_evidence":""}',
  formal_completeness jsonb not null default '{"status":"NOT_ASSESSED","reason":"","evidence_anchor":"","missing_evidence":""}',
  empirical_support jsonb not null default '{"status":"NOT_ASSESSED","reason":"","evidence_anchor":"","missing_evidence":""}',
  ontology_status jsonb not null default '{"status":"NOT_ASSESSED","reason":"","evidence_anchor":"","missing_evidence":""}',
  engineering_testability jsonb not null default '{"status":"NOT_ASSESSED","reason":"","evidence_anchor":"","missing_evidence":""}',
  failure_boundary_quality jsonb not null default '{"status":"NOT_ASSESSED","reason":"","evidence_anchor":"","missing_evidence":""}',
  review_completion jsonb not null default '{"status":"NOT_ASSESSED","reason":"","evidence_anchor":"","missing_evidence":""}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.medical_review_states (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null unique references public.cases(id) on delete cascade,
  paper_review_status text,
  medical_evidence_admissibility text,
  clinical_use_readiness text,
  claim_authority_level text,
  evidence_grounding_level text,
  clinical_translation_risks text,
  patient_safety_boundary text,
  external_validation_status text,
  calibration_status text,
  subgroup_validation_status text,
  prospective_validation_status text,
  regulatory_boundary text,
  expert_review_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comparison_summaries (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null unique references public.cases(id) on delete cascade,
  strongest_difference text,
  ordinary_ai_strength text,
  ordinary_ai_gap text,
  lihuo_strength text,
  lihuo_limit text,
  unresolved_question text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.case_tags (
  case_id uuid not null references public.cases(id) on delete cascade,
  tag text not null,
  primary key(case_id, tag)
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index cases_public_idx on public.cases(publication_status, published_at desc);
create index cases_search_idx on public.cases using gin(to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(paper_title,'') || ' ' || coalesce(journal,'') || ' ' || coalesce(doi,'')));
create index cases_keywords_idx on public.cases using gin(keywords);
create index documents_case_idx on public.case_documents(case_id, document_role);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger cases_updated before update on public.cases for each row execute function public.set_updated_at();
create trigger review_outputs_updated before update on public.review_outputs for each row execute function public.set_updated_at();
create trigger general_states_updated before update on public.general_review_states for each row execute function public.set_updated_at();
create trigger medical_states_updated before update on public.medical_review_states for each row execute function public.set_updated_at();
create trigger comparison_updated before update on public.comparison_summaries for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.cases enable row level security;
alter table public.case_documents enable row level security;
alter table public.review_outputs enable row level security;
alter table public.general_review_states enable row level security;
alter table public.medical_review_states enable row level security;
alter table public.comparison_summaries enable row level security;
alter table public.case_tags enable row level security;
alter table public.audit_logs enable row level security;

create policy admin_users_self_read on public.admin_users for select to authenticated using (user_id = auth.uid());
create policy cases_public_read on public.cases for select to anon, authenticated using (publication_status = 'PUBLISHED' or public.is_admin());
create policy cases_admin_all on public.cases for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy docs_public_metadata on public.case_documents for select to anon, authenticated using (
  exists(select 1 from public.cases c where c.id=case_id and c.publication_status='PUBLISHED')
  or public.is_admin()
);
create policy docs_admin_all on public.case_documents for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy outputs_public_read on public.review_outputs for select to anon, authenticated using (exists(select 1 from public.cases c where c.id=case_id and (c.publication_status='PUBLISHED' or public.is_admin())));
create policy outputs_admin_all on public.review_outputs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy general_public_read on public.general_review_states for select to anon, authenticated using (exists(select 1 from public.cases c where c.id=case_id and (c.publication_status='PUBLISHED' or public.is_admin())));
create policy general_admin_all on public.general_review_states for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy medical_public_read on public.medical_review_states for select to anon, authenticated using (exists(select 1 from public.cases c where c.id=case_id and (c.publication_status='PUBLISHED' or public.is_admin())));
create policy medical_admin_all on public.medical_review_states for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy comparison_public_read on public.comparison_summaries for select to anon, authenticated using (exists(select 1 from public.cases c where c.id=case_id and (c.publication_status='PUBLISHED' or public.is_admin())));
create policy comparison_admin_all on public.comparison_summaries for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy tags_public_read on public.case_tags for select to anon, authenticated using (exists(select 1 from public.cases c where c.id=case_id and (c.publication_status='PUBLISHED' or public.is_admin())));
create policy tags_admin_all on public.case_tags for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy audit_admin_read on public.audit_logs for select to authenticated using (public.is_admin());
create policy audit_admin_insert on public.audit_logs for insert to authenticated with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('case-documents','case-documents',false,20971520,array['application/pdf','text/plain','text/markdown'])
on conflict (id) do update set public=false, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

create policy storage_admin_select on storage.objects for select to authenticated using (bucket_id='case-documents' and public.is_admin());
create policy storage_admin_insert on storage.objects for insert to authenticated with check (bucket_id='case-documents' and public.is_admin());
create policy storage_admin_update on storage.objects for update to authenticated using (bucket_id='case-documents' and public.is_admin()) with check (bucket_id='case-documents' and public.is_admin());
create policy storage_admin_delete on storage.objects for delete to authenticated using (bucket_id='case-documents' and public.is_admin());

-- Explicit API privileges; RLS policies above remain the authorization boundary.
grant usage on schema public to anon, authenticated;
grant select on public.cases, public.case_documents, public.review_outputs, public.general_review_states,
  public.medical_review_states, public.comparison_summaries, public.case_tags to anon, authenticated;
grant select, insert, update, delete on public.cases, public.case_documents, public.review_outputs,
  public.general_review_states, public.medical_review_states, public.comparison_summaries, public.case_tags to authenticated;
grant select on public.admin_users, public.audit_logs to authenticated;
grant insert on public.audit_logs to authenticated;
grant usage, select on sequence public.audit_logs_id_seq to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
