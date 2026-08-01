type ProgressBarProps = {
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "accent" | "danger";
};

export function ProgressBar({ value, max = 100, label, showValue = false, color = "accent" }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  const barColor = color === "danger" ? "var(--danger)" : "var(--accent)";

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[var(--text-secondary)]">{label}</span>
          {showValue && (
            <span className="text-xs font-mono text-[var(--text-secondary)]">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-[var(--border)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
