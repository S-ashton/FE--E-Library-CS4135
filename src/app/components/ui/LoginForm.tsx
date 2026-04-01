import Spinner from "./Spinner";

type LoginFormProps = {
  email: string;
  password: string;
  error?: string | null;
  emailFieldError?: string;
  passwordFieldErrors?: string[];
  isSubmitting?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function LoginForm({
  email,
  password,
  error,
  emailFieldError = "",
  passwordFieldErrors = [],
  isSubmitting = false,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "16px" }}>
      {error && (
        <div
          style={{
            color: "#dc2626",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            padding: "10px 12px",
            fontSize: "0.95rem",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "6px" }}>
        <label htmlFor="email" style={{ fontWeight: 600 }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isSubmitting}
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#0f172a",
          }}
        />
        {emailFieldError && (
          <span style={{ color: "#dc2626", fontSize: "0.95rem" }}>
            {emailFieldError}
          </span>
        )}
      </div>

      <div style={{ display: "grid", gap: "6px" }}>
        <label htmlFor="password" style={{ fontWeight: 600 }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isSubmitting}
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#0f172a",
          }}
        />
        {passwordFieldErrors.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: "18px", color: "#dc2626" }}>
            {passwordFieldErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          border: "none",
          borderRadius: "10px",
          padding: "12px 16px",
          background: isSubmitting ? "#93c5fd" : "#2563eb",
          color: "#ffffff",
          fontWeight: 600,
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting && <Spinner size={16} />}
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}