import Spinner from "./Spinner";

type FullPageLoaderProps = {
  message?: string;
};

export default function FullPageLoader({
  message = "Loading...",
}: FullPageLoaderProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "var(--shadow)",
        }}
      >
        <Spinner />
        <span>{message}</span>
      </div>
    </div>
  );
}