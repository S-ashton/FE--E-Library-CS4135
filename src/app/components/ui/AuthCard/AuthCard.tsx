import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        padding: "28px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "1.8rem",
            lineHeight: 1.2,
            color: "#0f172a",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              margin: "8px 0 0",
              color: "#475569",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}