import clsx from "clsx";

export function StatusBadge({ value }: { value?: string | null }) {
  const text = value || "UNKNOWN / NOT RECORDED";
  const upper = text.toUpperCase();
  const tone = upper.includes("FAIL") || upper.includes("STOP") || upper.includes("NOT_CLINICALLY")
    ? "badge-danger"
    : upper.includes("PASS") || upper.includes("READY_FOR_EXPERT") || upper.includes("ADMISSIBLE_WITH")
      ? "badge-pass"
      : upper.includes("HOLD") || upper.includes("LIMIT") || upper.includes("PARTIAL") || upper.includes("CAUTION") || upper.includes("NOT_READY")
        ? "badge-warn"
        : "badge-neutral";
  return <span className={clsx("badge", tone)} aria-label={`狀態：${text}`}>● {text}</span>;
}
