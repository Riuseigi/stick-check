import { type HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
