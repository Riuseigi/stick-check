import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: "bg-[var(--accent)] text-[var(--bg-canvas)] px-6 py-3 text-sm font-semibold hover:brightness-110 active:scale-[0.98]",
    secondary: "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] px-6 py-3 text-sm hover:bg-[var(--border)]",
    ghost: "text-[var(--text-secondary)] px-4 py-2 text-sm hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
