# LIHUO Paper Review System V3.0-EXP-QS-R3
## DAIL-LIHUO 2.0 × V3.5 Wiring Constitution Integration Patch

```yaml
DOCUMENT:
  type: SYSTEM_SPECIFICATION_INCREMENTAL_PATCH
  version: V3.0-EXP-QS-R3
  date: 2026-08-27
  parent: V3.0-EXP-QS-R2
  parent_sha256: 4b6df49d261ad9e5fe0acb0ce14a228bdb517279d7cf3b06d646120c5a7f2736
  inheritance: FULL_EXCEPT_EXPLICIT_R3_SUPERSESSION

ALIGNMENT:
  protocol: LIHUO PROTOCOL V2.3
  protocol_sha256: 0cc74b924c949bdfebcf07a7127d820962e27e73f3bc53f3c1190974287b062b
  lighter: LIHUO LIGHTER V3.5-EXP
  lighter_sha256: 516bd5b03a75c1ee728626c12df7092ab7313b7e744ddba1faba7f3589a1b574
  main_system: LIHUO AI SYSTEM V3.5-EXP
  main_system_sha256: bf692de4af9d7023e5b97a21486de8a24b30de475cdfedd9ba5573f57e5f66b0
  medreview: LIHUO MedReview Agent v0.2
  medreview_sha256: 57400d09f583b01ce446d1a4f254ed52c2d49afdfe8f617b92bbfe2d663232a9

EVIDENCE_STATE:
  E0_SOURCE_WRITTEN: true
  E1_IR_NORMALIZED: true
  E2_SEMANTIC_VALIDATED: true
  E3_CAPABILITY_RESOLVED: true
  E4_BOUND: true
  E5_GRAPH_AUDITED: true
  E6_RUNTIME_TESTED: false
  E7_HOST_ENFORCED: false
```

## 1. Upgrade rule

R3 preserves the review semantics of V3.0-EXP-QS/R2 and the R1 web adapter. It changes **placement and wiring semantics**: the paper-review vertical now describes its world, boundaries, responsibilities, manifestation contract and semantic capability requirements through DAIL-LIHUO 2.0. Lighter V3.5 resolves providers according to SAC dependency and governs binding, ordering, scope and return paths.

The vertical must not treat implementation module names as portable semantic requirements. `CAPABILITY_REQUIREMENT != PROVIDER_PRESENT`, `CAPABILITY_PRESENT != CAPABILITY_WIRED`, and `BOUND != EXECUTED` are active invariants.

## 2. Placement

### SAC-independent paper-review vertical

- SOURCE_SCOPE_LOCK
- Q0_FRAME_AUDIT
- PAPER_STRUCTURE_RECONSTRUCTION
- PREMISE_AUTHORIZATION_AUDIT
- EVIDENCE_AUDIT
- CLAIM_AUTHORITY_DOWNGRADE
- MULTI_AXIS_QUALIFICATION
- POSITION_PROVENANCE_TRACKING
- UNCERTAINTY_PRESERVATION
- LIGHT_TRACE_OBSERVATION
- AUTHORITY_GRAVITY_AUDIT
- ANTI_FLATTERY_OUTPUT_ORDER

### Medical vertical provider

`MEDICAL_EVIDENCE_PROFILE` is provided by **LIHUO MedReview Agent v0.2** by default without SAC dependency. This wiring upgrade does not change its medical evidence logic and therefore does not create a fake v0.3.

### SAC-dependent Main System provider

Only when requested and bound through Lighter:

- MULTI_PATH_RECOMPETITION
- COUNTER_PATH_REENTRY
- R_CCC_QS_RECOMPOSITION
- ENDLESS_RESCAN
- SAC_DEPENDENT_SCOPED_REACTIVATION

The Main System is a provider, not the owner of DAIL, LLIA, the paper-review domain, or Final Classicalization.

## 3. First-touch / ordering

```text
SOURCE_SCOPE_LOCK
↓
FACT / EVIDENCE / UNKNOWN typing
↓
Q0 frame audit
↓
Premise + method authorization
↓
Evidence boundary + claim downgrade
↓
Multi-axis qualification
↓
Optional bound SAC-dependent provider
↓
Report assembly
↓
Lighter Final Classicalization
↓
Optional Web Case Export
```

Raw source must be first touched by intake/source-scope logic before lossy summary or rendering. Evidence grounding must precede reviewer recommendation. Medical method/data/endpoint detail must be preserved before generic simplification.

## 4. Atomic bundles

- `INTAKE_EVIDENCE_BUNDLE`: source lock + FACT/EVIDENCE/UNKNOWN separation + evidence audit.
- `QS_RECOMPETITION_BUNDLE`: multi-path recompetition + counter-path reentry + R-CCC/QS recomposition + uncertainty preservation.
- `ENDLESS_REVIEW_BUNDLE`: ENDLESS rescan + semantic-equivalence compression + structural stop justification.
- `MEDREVIEW_BUNDLE`: medical router + evidence grounding + medical gates + claim authority/readiness separation.
- `WEB_EXPORT_BUNDLE`: report projection + no-fabrication + translation provenance; only after Final Classicalization.

## 5. Main-System binding and return

Main System accepts an authorized invocation package plus validated DAIL-IR and, where applicable, a binding manifest. Raw DAIL source is not a Main-System execution command.

The provider return object must preserve:

- candidate state;
- UNKNOWN values not legally closed;
- must-preserve invariants;
- structural HOLD / non-manifestation;
- provider execution-evidence level;
- responsibility ownership.

It returns to Lighter/Paper Review report assembly and cannot final-release or change the academic decision owner.

## 6. Website boundary

The website is a database/presentation/export target. `WEB_CASE_EXPORT` projects an already-qualified review report into case fields and may not fabricate missing paper facts, ordinary-AI output, author positions, evidence, or runtime state. Website publishing is an application workflow and is not equivalent to LIHUO Final Classicalization or scientific truth.

## 7. Current evidence claim

This patch and its DAIL/binding documents have been statically graph-audited to **E5_GRAPH_AUDITED**. No runtime-regression or host-enforcement claim is made. E6 and E7 remain false until independently observable evidence exists.
