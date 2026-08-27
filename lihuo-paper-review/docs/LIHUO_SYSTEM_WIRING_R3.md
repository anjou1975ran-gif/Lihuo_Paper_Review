# LIHUO Paper Review R3 — DAIL 2.0 / V3.5 Wiring Profile

## Current alignment

- Root protocol: **LIHUO PROTOCOL V2.3**
- Lighter: **LIHUO LIGHTER V3.5-EXP**
- Main system: **LIHUO AI SYSTEM V3.5-EXP**
- Paper review vertical: **V3.0-EXP-QS-R3**
- Medical profile: **LIHUO MedReview Agent v0.2**
- DAIL profile: **DAIL-LIHUO Runtime Authoring Profile 2.0-EXP**
- Highest current wiring claim: **E5_GRAPH_AUDITED**
- Runtime regression: **NOT_EXECUTED**
- Host enforcement: **NOT_CLAIMED**

## Active topology

```text
HOST / PLATFORM
↓
LIHUO PROTOCOL V2.3
↓
LIHUO LIGHTER V3.5-EXP
  ├─ LLIA / boundary
  ├─ DAIL parse / normalize / validate
  ├─ Paper Review vertical semantic program
  ├─ capability resolution
  └─ wiring / binding governance
↓
AUTHORIZED_INPUT_PACKAGE + VALIDATED_DAIL_IR
↓
PAPER REVIEW VERTICAL (SAC-independent domain layer)
  ├─ source-scope lock
  ├─ Q0 / premise / evidence audit
  ├─ claim downgrade + multi-axis qualification
  ├─ provenance / uncertainty / Light Trace
  └─ MedReview v0.2 when medical
↓ conditional binding only
LIHUO AI SYSTEM V3.5-EXP (SAC-dependent provider)
  ├─ MULTI_PATH_RECOMPETITION
  ├─ R_CCC_QS_RECOMPOSITION
  ├─ ENDLESS_RESCAN
  └─ SAC_DEPENDENT_SCOPED_REACTIVATION
↓ PROVIDER_RETURN_STATE
LIHUO LIGHTER / report assembler
↓ CANDIDATE_REVIEW_REPORT
FINAL_CLASSICALIZATION_GATE
↓ RELEASE / HOLD / REAUTHORIZATION_REQUIRED
WEB CASE EXPORT (optional projection only)
↓ website / database
```

## Placement rules

The vertical system expresses **semantic capability requirements**, not implementation module ownership. `EVIDENCE_AUDIT`, `CLAIM_AUTHORITY_DOWNGRADE`, `MULTI_AXIS_QUALIFICATION`, provenance, uncertainty preservation and MedReview remain SAC-independent. `MULTI_PATH_RECOMPETITION`, `R_CCC_QS_RECOMPOSITION`, `ENDLESS_RESCAN` and SAC-dependent scoped reactivation bind to Main System V3.5 only when requested.

`CALLABLE != OWNED`, `CAPABILITY_PRESENT != CAPABILITY_WIRED`, and `BOUND != EXECUTED` are active invariants.

## First-touch and ordering

1. Raw paper/source material first reaches source-scope and evidence typing before lossy summary or rendering.
2. Evidence grounding runs before reviewer recommendation or positive-strength rendering.
3. Medical routing receives preserved method/data/endpoint details before generic simplification.
4. Main System receives only an authorized invocation package plus validated DAIL-IR/binding manifest; it never receives raw DAIL as an execution command.
5. Web export runs after candidate report and Final Classicalization; it may not write back into WORLD/evidence.

## Atomic bundles

- **INTAKE_EVIDENCE_BUNDLE** — source lock + fact/evidence/unknown separation + evidence audit.
- **QS_RECOMPETITION_BUNDLE** — multi-path recompetition + counter-path reentry + R-CCC/QS recomposition + uncertainty preservation.
- **ENDLESS_REVIEW_BUNDLE** — ENDLESS rescan + semantic equivalence compression + structural stop justification.
- **MEDREVIEW_BUNDLE** — medical router + grounding levels + medical gates + claim authority/readiness separation.
- **WEB_EXPORT_BUNDLE** — report projection + no-fabrication guard + translation provenance.

## Return contract

Main System returns `candidate_state`, `preserved_unknowns`, `preserved_invariants`, any `structural_hold`, any `non_manifestation`, and `provider_execution_evidence_level` to Lighter/Paper Review report assembly. Main System cannot final-release or change the academic decision owner.

## Evidence ladder

```yaml
E0_SOURCE_WRITTEN: true
E1_IR_NORMALIZED: true
E2_SEMANTIC_VALIDATED: true
E3_CAPABILITY_RESOLVED: true
E4_BOUND: true
E5_GRAPH_AUDITED: true
E6_RUNTIME_TESTED: false
E7_HOST_ENFORCED: false
```

This repository therefore claims only **specification + static graph-audited wiring**. It does not claim that the website deploys the LIHUO Runtime, that the host enforces this route, or that Runtime behavioral equivalence has been regression-tested.
