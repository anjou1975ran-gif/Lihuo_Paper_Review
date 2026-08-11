type AnyRecord = Record<string, any>;

export type WebCasePacketParseResult = {
  detected: boolean;
  patch: AnyRecord;
  warnings: string[];
  importedFields: number;
};

const EMPTY_MARKERS = [
  "未提供",
  "[未提供]",
  "[未提供／留白]",
  "not provided",
  "[not provided]",
  "[not provided / leave blank]",
  "unknown / not recorded",
];

function clean(value = "") {
  const v = value.trim();
  if (EMPTY_MARKERS.includes(v.toLowerCase())) return "";
  return v;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function section(packet: string, id: string) {
  const marker = `[${id}｜`;
  const start = packet.indexOf(marker);
  if (start < 0) return "";
  const bodyStart = packet.indexOf("\n", start);
  if (bodyStart < 0) return "";
  const rest = packet.slice(bodyStart + 1);
  const nextMatch = /\n\[\d{2}｜/.exec(rest);
  const end = nextMatch ? bodyStart + 1 + nextMatch.index : packet.length;
  return packet.slice(bodyStart + 1, end).trim();
}

function readFields(body: string, labels: string[]) {
  const anchors: Array<{ label: string; start: number; valueStart: number }> = [];
  for (const label of labels) {
    const re = new RegExp(`(?:^|\\n)${escapeRegExp(label)}[：:]`, "m");
    const match = re.exec(body);
    if (!match) continue;
    const prefixLength = match[0].startsWith("\n") ? 1 : 0;
    const start = match.index + prefixLength;
    const colonOffset = body.slice(start).search(/[：:]/);
    anchors.push({ label, start, valueStart: start + colonOffset + 1 });
  }
  anchors.sort((a, b) => a.start - b.start);
  const result: Record<string, string> = {};
  anchors.forEach((anchor, index) => {
    const end = anchors[index + 1]?.start ?? body.length;
    result[anchor.label] = clean(body.slice(anchor.valueStart, end));
  });
  return result;
}

function splitList(value: string) {
  if (!value) return [];
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function yes(value: string) {
  return /^(true|yes|是|允許)$/i.test(clean(value));
}

function validSlug(value: string) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function mergeText(a: string, b: string) {
  return [clean(a), clean(b)].filter(Boolean).join("\n\n");
}

function reportMeta(reportText: string) {
  const read = (key: string) => {
    const match = new RegExp(`^\\s*${escapeRegExp(key)}\\s*:\\s*[\"']?([^\\n\"']+)`, "m").exec(reportText);
    return clean(match?.[1] || "");
  };
  return {
    reportId: read("report_id"),
    engineVersion: read("engine_version"),
    runtimeProfile: read("runtime_profile"),
    reviewScope: read("review_scope"),
    reviewDate: read("review_date"),
  };
}

function isFullReportPointer(value: string) {
  return /本報告全文|full report/i.test(value);
}

export function parseWebCaseUploadPacket(text: string): WebCasePacketParseResult {
  const packetIndex = text.indexOf("WEB CASE UPLOAD PACKET");
  if (packetIndex < 0) return { detected: false, patch: {}, warnings: ["找不到 WEB CASE UPLOAD PACKET 標記。"], importedFields: 0 };

  const warnings: string[] = [];
  let importedFields = 0;
  const reportText = text.slice(0, packetIndex).trim();
  const packet = text.slice(packetIndex);
  const meta = reportMeta(reportText);

  const s01 = readFields(section(packet, "01"), [
    "中文論文標題",
    "英文論文標題",
    "案例類型",
    "網址代稱",
    "作者",
    "期刊／出版來源",
    "出版年份",
    "DOI",
    "原始來源網址",
    "標籤",
    "中文摘要",
    "英文摘要",
  ]);
  const s02 = readFields(section(packet, "02"), ["檔名", "MIME", "來源說明", "公開下載"]);
  const s03 = readFields(section(packet, "03"), [
    "普通 AI 審查（中文）",
    "Ordinary AI Review (English)",
    "來源狀態",
    "模型名稱",
    "模型版本",
    "推理模式",
    "審查日期",
  ]);
  const s04 = readFields(section(packet, "04"), [
    "理火審查（中文）",
    "LIHUO Review (English)",
    "English_review_provenance",
    "Evidence Boundary",
    "Missing Evidence",
    "Required Revision",
  ]);
  const s05 = readFields(section(packet, "05"), [
    "案例摘要（中文）",
    "Case Summary (English)",
    "審查結論（中文）",
    "Review Verdict (English)",
  ]);
  const s06 = readFields(section(packet, "06"), [
    "Paper Review Status",
    "Medical Evidence Admissibility",
    "Clinical Use Readiness",
    "Claim Authority Level",
    "Evidence Grounding Level",
    "Clinical Translation Risks",
    "Patient Safety Boundary",
    "External Validation Status",
    "Calibration Status",
    "Subgroup Validation Status",
    "Prospective Validation Status",
    "Regulatory Boundary",
    "Expert Review Required",
  ]);
  const s07 = readFields(section(packet, "07"), [
    "Structural Reviewability",
    "Premise Integrity",
    "Claim Authority",
    "Formal Completeness",
    "Empirical Support",
    "Ontology Status",
    "Engineering Testability",
    "Failure Boundary Quality",
    "Review Completion",
  ]);
  const s08 = readFields(section(packet, "08"), ["Comparison Available", "Reason"]);

  const paperTitleZh = clean(s01["中文論文標題"]);
  const paperTitleEn = clean(s01["英文論文標題"]);
  const caseType = clean(s01["案例類型"]);
  const publicationYearRaw = clean(s01["出版年份"]);
  let publicationYear: number | null | undefined;
  if (publicationYearRaw) {
    const yearMatch = /\b(18|19|20|21)\d{2}\b/.exec(publicationYearRaw);
    if (/推測|請確認|estimated|confirm/i.test(publicationYearRaw)) {
      warnings.push(`出版年份「${publicationYearRaw}」含推測／待確認標記，未自動寫入正式年份欄。`);
    } else if (yearMatch) {
      publicationYear = Number(yearMatch[0]);
    }
  }

  const casePatch: AnyRecord = {};
  if (paperTitleZh || paperTitleEn) casePatch.title = paperTitleZh || paperTitleEn;
  if (paperTitleEn || paperTitleZh) casePatch.paper_title = paperTitleEn || paperTitleZh;
  if (s05["案例摘要（中文）"] || s05["Case Summary (English)"]) casePatch.summary = clean(s05["案例摘要（中文）"]) || clean(s05["Case Summary (English)"]);
  const slug = validSlug(s01["網址代稱"] || paperTitleEn);
  if (slug) casePatch.slug = slug;
  if (caseType === "GENERAL_PAPER_REVIEW" || caseType === "MEDICAL_PAPER_REVIEW") casePatch.case_type = caseType;
  if (s01["作者"]) casePatch.authors = splitList(s01["作者"]);
  if (s01["期刊／出版來源"]) casePatch.journal = clean(s01["期刊／出版來源"]);
  if (publicationYear !== undefined) casePatch.publication_year = publicationYear;
  if (clean(s01["DOI"])) casePatch.doi = clean(s01["DOI"]);
  if (/^https?:\/\//i.test(clean(s01["原始來源網址"]))) casePatch.original_url = clean(s01["原始來源網址"]);
  if (s01["標籤"]) casePatch.keywords = splitList(s01["標籤"]);
  const abstract = clean(s01["中文摘要"]) || clean(s01["英文摘要"]);
  if (abstract && !/可複製|已於報告中引用/i.test(abstract)) casePatch.paper_abstract = abstract;
  if (meta.reviewDate) casePatch.review_date = meta.reviewDate;
  if (s02["來源說明"]) casePatch.source_note = clean(s02["來源說明"]);

  const sourceFileName = clean(s02["檔名"]);
  const sourceMime = clean(s02["MIME"]);
  if (sourceFileName) {
    const ref = `來源檔參照：${sourceFileName}${sourceMime ? ` (${sourceMime})` : ""}。此匯入只帶入文字資料，原始二進位檔仍需另外上傳。`;
    casePatch.source_note = mergeText(casePatch.source_note || "", ref);
    warnings.push(`回報包只參照來源檔「${sourceFileName}」，不代表該檔案已上傳到網站。`);
  }

  const ordinaryZh = clean(s03["普通 AI 審查（中文）"]);
  const ordinaryEn = clean(s03["Ordinary AI Review (English)"]);
  const ordinaryProvided = clean(s03["來源狀態"]) !== "NOT_PROVIDED" && Boolean(ordinaryZh || ordinaryEn);
  const ordinaryPatch: AnyRecord = {};
  if (ordinaryProvided) {
    ordinaryPatch.full_text = mergeText(ordinaryZh, ordinaryEn);
    if (s03["模型名稱"]) ordinaryPatch.system_name = clean(s03["模型名稱"]);
    if (s03["模型版本"]) ordinaryPatch.system_version = clean(s03["模型版本"]);
    if (s03["推理模式"]) ordinaryPatch.reasoning_mode = clean(s03["推理模式"]);
    if (s03["審查日期"]) ordinaryPatch.review_date = clean(s03["審查日期"]);
  } else {
    warnings.push("普通 AI 審查標記為 NOT_PROVIDED；依 R1 規格保持空白，不自動生成對照審查。");
  }

  const lihuoPatch: AnyRecord = {
    system_name: caseType === "MEDICAL_PAPER_REVIEW" ? "LIHUO MedReview" : "LIHUO Paper Review System",
    system_version: meta.engineVersion || "3.0-EXP-QS-R1",
  };
  if (meta.runtimeProfile) lihuoPatch.reasoning_mode = meta.runtimeProfile;
  if (meta.reviewDate) lihuoPatch.review_date = meta.reviewDate;
  if (meta.reviewScope) lihuoPatch.source_scope = meta.reviewScope;
  const reviewZh = clean(s04["理火審查（中文）"]);
  if (reportText && (!reviewZh || isFullReportPointer(reviewZh))) lihuoPatch.full_text = reportText;
  else if (reviewZh) lihuoPatch.full_text = reviewZh;
  if (s05["案例摘要（中文）"]) lihuoPatch.short_summary = clean(s05["案例摘要（中文）"]);
  if (s05["審查結論（中文）"]) lihuoPatch.final_judgment = clean(s05["審查結論（中文）"]);
  if (s04["Evidence Boundary"]) lihuoPatch.evidence_boundary = clean(s04["Evidence Boundary"]);
  if (s04["Missing Evidence"]) lihuoPatch.missing_evidence = clean(s04["Missing Evidence"]);
  if (s04["Required Revision"]) lihuoPatch.required_revision = clean(s04["Required Revision"]);
  if (s04["English_review_provenance"]) lihuoPatch.notes = `English review provenance:\n${clean(s04["English_review_provenance"])}`;

  const axisMap: Record<string, string> = {
    "Structural Reviewability": "structural_reviewability",
    "Premise Integrity": "premise_integrity",
    "Claim Authority": "claim_authority",
    "Formal Completeness": "formal_completeness",
    "Empirical Support": "empirical_support",
    "Ontology Status": "ontology_status",
    "Engineering Testability": "engineering_testability",
    "Failure Boundary Quality": "failure_boundary_quality",
    "Review Completion": "review_completion",
  };
  const generalReviewStates: AnyRecord = {};
  for (const [label, key] of Object.entries(axisMap)) {
    const status = clean(s07[label]);
    if (status) generalReviewStates[key] = { status, reason: "", evidence_anchor: "", missing_evidence: "" };
  }

  const medicalMap: Record<string, string> = {
    "Paper Review Status": "paper_review_status",
    "Medical Evidence Admissibility": "medical_evidence_admissibility",
    "Clinical Use Readiness": "clinical_use_readiness",
    "Claim Authority Level": "claim_authority_level",
    "Evidence Grounding Level": "evidence_grounding_level",
    "Clinical Translation Risks": "clinical_translation_risks",
    "Patient Safety Boundary": "patient_safety_boundary",
    "External Validation Status": "external_validation_status",
    "Calibration Status": "calibration_status",
    "Subgroup Validation Status": "subgroup_validation_status",
    "Prospective Validation Status": "prospective_validation_status",
    "Regulatory Boundary": "regulatory_boundary",
  };
  const medicalReviewState: AnyRecord = {};
  for (const [label, key] of Object.entries(medicalMap)) {
    const value = clean(s06[label]);
    if (value) medicalReviewState[key] = value;
  }
  if (s06["Expert Review Required"]) medicalReviewState.expert_review_required = yes(s06["Expert Review Required"]);

  const comparisonSummary: AnyRecord = {};
  if (/^false$/i.test(clean(s08["Comparison Available"]))) {
    if (s08["Reason"]) comparisonSummary.unresolved_question = clean(s08["Reason"]);
  }

  const patch: AnyRecord = {
    case: casePatch,
    paper_source: { source_type: "PASTED_TEXT", pasted_text: "", public_download_allowed: yes(s02["公開下載"]) },
    ordinary_review: ordinaryPatch,
    lihuo_review: lihuoPatch,
    general_review_states: generalReviewStates,
    medical_review_state: medicalReviewState,
    comparison_summary: comparisonSummary,
  };

  const countLeaves = (value: any): number => {
    if (value === null || value === undefined || value === "") return 0;
    if (Array.isArray(value)) return value.length ? 1 : 0;
    if (typeof value !== "object") return 1;
    return Object.values(value).reduce((sum, item) => sum + countLeaves(item), 0);
  };
  importedFields = countLeaves(patch);

  if (!casePatch.title) warnings.push("未找到可用的案例／論文標題，請在儲存前手動補上。");
  if (!casePatch.slug) warnings.push("未找到可用的網址代稱，請在儲存前手動補上 slug。");
  if (!casePatch.summary) warnings.push("未找到案例摘要，請在儲存前手動補上。 ");

  return { detected: true, patch, warnings, importedFields };
}
