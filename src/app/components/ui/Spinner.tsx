type SpinnerProps = {
  size?: number;
};

export default function Spinner({ size = 20 }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        border: "2px solid #d1d5db",
        borderTopColor: "#2563eb",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}